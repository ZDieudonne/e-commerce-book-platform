import { requireAdmin } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderActions } from "@/components/admin/order-actions"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "bg-yellow-500"
      case "paid":
        return "bg-green-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-600"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Commande {order.order_number}</h1>
        <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ")}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Nom</p>
              <p className="text-sm text-muted-foreground">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Téléphone</p>
              <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
            </div>
            {order.customer_whatsapp && (
              <div>
                <p className="text-sm font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">{order.customer_whatsapp}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adresse de livraison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">{order.shipping_address.address}</p>
            <p className="text-sm">{order.shipping_address.city}</p>
            <p className="text-sm">{order.shipping_address.country}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles commandés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex gap-4 items-start">
                <div className="relative w-16 h-20 flex-shrink-0 bg-muted rounded">
                  {item.book_cover_url ? (
                    <Image
                      src={item.book_cover_url || "/placeholder.svg"}
                      alt={item.book_title}
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      Pas d'image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.book_title}</p>
                  <p className="text-sm text-muted-foreground">{item.book_author}</p>
                  <p className="text-sm">{item.is_pdf ? "Version PDF" : `Livre physique (x${item.quantity})`}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.subtotal.toLocaleString()} FCFA</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{order.subtotal.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Livraison</span>
              <span>{order.shipping_cost === 0 ? "Gratuite" : `${order.shipping_cost.toLocaleString()} FCFA`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{order.total.toLocaleString()} FCFA</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">Mode de paiement</p>
              <p className="text-sm text-muted-foreground capitalize">{order.payment_method.replace("_", " ")}</p>
            </div>
            {order.payment_reference && (
              <div>
                <p className="text-sm font-medium">Référence</p>
                <p className="text-sm text-muted-foreground">{order.payment_reference}</p>
              </div>
            )}
            {order.payment_validated_at && (
              <div>
                <p className="text-sm font-medium">Validé le</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.payment_validated_at).toLocaleString("fr-FR")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {order.customer_notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes du client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.customer_notes}</p>
          </CardContent>
        </Card>
      )}

      <OrderActions orderId={order.id} currentStatus={order.status} />
    </div>
  )
}
