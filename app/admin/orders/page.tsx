import { requireAdmin } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminOrdersPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

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

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").charAt(0).toUpperCase() + status.slice(1).replace("_", " ")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Commandes</h1>
          <p className="text-muted-foreground">Gérer toutes les commandes</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les commandes</CardTitle>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{order.order_number}</p>
                      <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-bold">{order.total.toLocaleString()} FCFA</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {order.payment_method.replace("_", " ")}
                      </p>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/admin/orders/${order.id}`}>Détails</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune commande</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
