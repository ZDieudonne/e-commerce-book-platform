import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items(*)
    `,
    )
    .eq("id", id)
    .single()

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen py-8 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Commande confirmée!</h1>
        <p className="text-muted-foreground">Merci pour votre commande. Numéro: {order.order_number}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Détails de la commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut</span>
              <span className="font-medium">En attente de paiement</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode de paiement</span>
              <span className="font-medium capitalize">{order.payment_method.replace("_", " ")}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Articles commandés</h3>
            <div className="space-y-2">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.book_title} {item.is_pdf ? "(PDF)" : `(x${item.quantity})`}
                  </span>
                  <span>{item.subtotal.toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{order.subtotal.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span>{order.shipping_cost === 0 ? "Gratuite" : `${order.shipping_cost.toLocaleString()} FCFA`}</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>{order.total.toLocaleString()} FCFA</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.payment_method === "mobile_money" && (
        <Card className="mb-6 border-primary">
          <CardHeader>
            <CardTitle>Effectuer le paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Pour finaliser votre commande, veuillez effectuer le paiement via Mobile Money:</p>
            <div className="space-y-2 mb-4">
              <p className="font-medium">Orange Money: +226 75.79.54.44</p>
              <p className="font-medium">Moov Money: +226 71 67 18 01</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Après le paiement, votre commande sera validée dans les plus brefs délais. Vous recevrez une confirmation
              par email.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link href="/account/orders">Voir mes commandes</Link>
        </Button>
        <Button variant="outline" asChild className="bg-transparent">
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  )
}
