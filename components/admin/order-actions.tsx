"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function OrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleUpdateStatus = async () => {
    setIsLoading(true)

    try {
      const updates: any = { status }

      // If marking as paid, set payment validation info
      if (status === "paid" && currentStatus === "pending_payment") {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        updates.payment_validated_by = user?.id
        updates.payment_validated_at = new Date().toISOString()
      }

      const { error } = await supabase.from("orders").update(updates).eq("id", orderId)

      if (error) throw error

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour avec succès.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating order:", error)
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
          <Label htmlFor="status">Statut de la commande</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending_payment">En attente de paiement</SelectItem>
              <SelectItem value="paid">Payée</SelectItem>
              <SelectItem value="processing">En traitement</SelectItem>
              <SelectItem value="shipped">Expédiée</SelectItem>
              <SelectItem value="delivered">Livrée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleUpdateStatus} disabled={isLoading || status === currentStatus} className="w-full">
          {isLoading ? "Mise à jour..." : "Mettre à jour le statut"}
        </Button>
      </CardContent>
    </Card>
  )
}
