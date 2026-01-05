"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function AuthorProfileForm({ author, profile }: { author: any; profile: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    displayName: author?.display_name || "",
    bio: author?.bio || "",
    website: author?.website || "",
    whatsapp: profile?.whatsapp || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update author info
      const { error: authorError } = await supabase
        .from("authors")
        .update({
          display_name: formData.displayName,
          bio: formData.bio,
          website: formData.website,
        })
        .eq("id", profile.id)

      if (authorError) throw authorError

      // Update profile WhatsApp
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          whatsapp: formData.whatsapp,
        })
        .eq("id", profile.id)

      if (profileError) throw profileError

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="displayName">Nom d'affichage *</Label>
        <Input
          id="displayName"
          required
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="bio">Biographie</Label>
        <Textarea
          id="bio"
          rows={5}
          placeholder="Présentez-vous aux lecteurs..."
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="website">Site web</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://..."
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input
          id="whatsapp"
          type="tel"
          placeholder="+226 XX XX XX XX"
          value={formData.whatsapp}
          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Ce numéro sera affiché sur vos pages de livres pour permettre aux lecteurs de vous contacter
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
    </form>
  )
}
