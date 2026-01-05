import { requireAdmin } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ShoppingCart, Users, FileText } from "lucide-react"

export default async function AdminDashboardPage() {
  await requireAdmin()
  const supabase = await createClient()

  // Fetch stats
  const { count: booksCount } = await supabase.from("books").select("*", { count: "exact", head: true })

  const { count: ordersCount } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: manuscriptsCount } = await supabase
    .from("manuscripts")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    { title: "Livres", value: booksCount || 0, icon: BookOpen, href: "/admin/books" },
    { title: "Commandes", value: ordersCount || 0, icon: ShoppingCart, href: "/admin/orders" },
    { title: "Utilisateurs", value: usersCount || 0, icon: Users, href: "/admin/users" },
    { title: "Manuscrits en attente", value: manuscriptsCount || 0, icon: FileText, href: "/admin/manuscripts" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre plateforme</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total.toLocaleString()} FCFA</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.status.replace("_", " ")}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune commande récente</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
