import { requireAuth } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AccountOrdersPage() {
  const user = await requireAuth()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

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
    <div className="min-h-screen py-8 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{order.order_number}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="font-bold mt-1">{order.total.toLocaleString()} FCFA</p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/commande/${order.id}`}>Détails</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Vous n'avez pas encore passé de commande</p>
            <Button asChild>
              <Link href="/catalogue">Explorer le catalogue</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
