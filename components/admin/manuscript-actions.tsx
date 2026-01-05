"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function ManuscriptActions({ manuscriptId, currentStatus }: { manuscriptId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [adminNotes, setAdminNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleUpdateStatus = async () => {
    setIsLoading(true)

    try {
      const updates: any = { status }

      if (adminNotes) {
        updates.admin_notes = adminNotes
      }

      if (status !== currentStatus) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        updates.reviewed_by = user?.id
        updates.reviewed_at = new Date().toISOString()
      }

      const { error } = await supabase.from("manuscripts").update(updates).eq("id", manuscriptId)

      if (error) throw error

      toast({
        title: "Statut mis à jour",
        description: "Le statut du manuscrit a été mis à jour avec succès.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating manuscript:", error)
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
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="status">Statut du manuscrit</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="under_review">En cours de révision</SelectItem>
              <SelectItem value="accepted">Accepté</SelectItem>
              <SelectItem value="rejected">Refusé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes">Notes pour l'auteur</Label>
          <Textarea
            id="notes"
            rows={4}
            placeholder="Ajouter des commentaires ou des raisons de la décision..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
        </div>

        <Button onClick={handleUpdateStatus} disabled={isLoading} className="w-full">
          {isLoading ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </CardContent>
    </Card>
  )
}
