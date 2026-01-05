"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"

export function ManuscriptForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null)
  const [synopsisFile, setSynopsisFile] = useState<File | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    authorName: "",
    authorEmail: "",
    authorPhone: "",
    authorWhatsapp: "",
    title: "",
    genre: "",
    description: "",
    wordCount: "",
  })

  const genres = [
    "Poésie",
    "Roman",
    "Nouvelles",
    "Essai",
    "Biographie",
    "Conte",
    "Théâtre",
    "Développement personnel",
    "Autre",
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "manuscript" | "synopsis") => {
    if (e.target.files && e.target.files[0]) {
      if (type === "manuscript") {
        setManuscriptFile(e.target.files[0])
      } else {
        setSynopsisFile(e.target.files[0])
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!manuscriptFile) {
      toast({
        title: "Erreur",
        description: "Veuillez joindre votre manuscrit",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Upload manuscript file
      const manuscriptPath = `manuscripts/${Date.now()}-${manuscriptFile.name}`
      const { error: manuscriptUploadError } = await supabase.storage
        .from("manuscripts")
        .upload(manuscriptPath, manuscriptFile)

      if (manuscriptUploadError) throw manuscriptUploadError

      // Upload synopsis if provided
      let synopsisPath = null
      if (synopsisFile) {
        synopsisPath = `manuscripts/synopsis-${Date.now()}-${synopsisFile.name}`
        const { error: synopsisUploadError } = await supabase.storage
          .from("manuscripts")
          .upload(synopsisPath, synopsisFile)

        if (synopsisUploadError) throw synopsisUploadError
      }

      // Create manuscript record
      const { error: insertError } = await supabase.from("manuscripts").insert({
        author_name: formData.authorName,
        author_email: formData.authorEmail,
        author_phone: formData.authorPhone,
        author_whatsapp: formData.authorWhatsapp || formData.authorPhone,
        title: formData.title,
        genre: formData.genre,
        description: formData.description,
        word_count: formData.wordCount ? Number.parseInt(formData.wordCount) : null,
        manuscript_url: manuscriptPath,
        synopsis_url: synopsisPath,
        status: "pending",
      })

      if (insertError) throw insertError

      toast({
        title: "Manuscrit soumis!",
        description: "Votre manuscrit a été envoyé avec succès. Nous vous contacterons sous 7 à 14 jours.",
      })

      router.push("/manuscrits/success")
    } catch (error) {
      console.error("Error submitting manuscript:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="authorName">Nom complet *</Label>
          <Input
            id="authorName"
            required
            value={formData.authorName}
            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="authorEmail">Email *</Label>
          <Input
            id="authorEmail"
            type="email"
            required
            value={formData.authorEmail}
            onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="authorPhone">Téléphone *</Label>
          <Input
            id="authorPhone"
            type="tel"
            required
            placeholder="+226 XX XX XX XX"
            value={formData.authorPhone}
            onChange={(e) => setFormData({ ...formData, authorPhone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="authorWhatsapp">WhatsApp * (obligatoire)</Label>
          <Input
            id="authorWhatsapp"
            type="tel"
            required
            placeholder="+226 XX XX XX XX"
            value={formData.authorWhatsapp}
            onChange={(e) => setFormData({ ...formData, authorWhatsapp: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Titre du manuscrit *</Label>
        <Input
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="genre">Genre *</Label>
          <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
            <SelectTrigger id="genre">
              <SelectValue placeholder="Sélectionnez un genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="wordCount">Nombre de mots (approximatif)</Label>
          <Input
            id="wordCount"
            type="number"
            placeholder="Ex: 50000"
            value={formData.wordCount}
            onChange={(e) => setFormData({ ...formData, wordCount: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Synopsis / Description *</Label>
        <Textarea
          id="description"
          required
          rows={6}
          placeholder="Décrivez votre œuvre en quelques paragraphes..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="manuscript">Manuscrit * (PDF, DOC, DOCX)</Label>
        <div className="mt-2">
          <label
            htmlFor="manuscript"
            className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              {manuscriptFile ? (
                <p className="text-sm font-medium">{manuscriptFile.name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium">Cliquez pour télécharger</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX jusqu'à 50MB</p>
                </>
              )}
            </div>
          </label>
          <Input
            id="manuscript"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, "manuscript")}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="synopsis">Synopsis (optionnel, PDF)</Label>
        <div className="mt-2">
          <label
            htmlFor="synopsis"
            className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="text-center">
              {synopsisFile ? (
                <p className="text-sm font-medium">{synopsisFile.name}</p>
              ) : (
                <>
                  <p className="text-sm">Ajouter un synopsis séparé (optionnel)</p>
                  <p className="text-xs text-muted-foreground">PDF jusqu'à 10MB</p>
                </>
              )}
            </div>
          </label>
          <Input
            id="synopsis"
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, "synopsis")}
            className="hidden"
          />
        </div>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          En soumettant ce formulaire, vous acceptez que Les Éditions La Réforme examine votre manuscrit. Nous nous
          engageons à vous répondre sous 7 à 14 jours ouvrables.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Envoi en cours..." : "Soumettre mon manuscrit"}
      </Button>
    </form>
  )
}
