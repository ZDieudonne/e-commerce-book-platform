import { requireAuthor } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, DollarSign, ShoppingCart, Eye } from "lucide-react"

export default async function AuthorDashboardPage() {
  const author = await requireAuthor()
  const supabase = await createClient()

  // Get author details
  const { data: authorData } = await supabase.from("authors").select("*").eq("id", author.id).single()

  // Get author books
  const { data: books } = await supabase.from("books").select("*").eq("author_id", author.id)

  const totalBooks = books?.length || 0
  const totalSales = books?.reduce((sum, book) => sum + (book.sales_count || 0), 0) || 0
  const totalViews = books?.reduce((sum, book) => sum + (book.views || 0), 0) || 0
  const totalRevenue = authorData?.total_revenue || 0

  const stats = [
    { title: "Mes livres", value: totalBooks, icon: BookOpen },
    { title: "Ventes totales", value: totalSales, icon: ShoppingCart },
    { title: "Vues totales", value: totalViews, icon: Eye },
    { title: "Revenus", value: `${totalRevenue.toLocaleString()} FCFA`, icon: DollarSign },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Espace Auteur</h1>
        <p className="text-muted-foreground">Bienvenue, {authorData?.display_name || author.full_name}</p>
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
          <CardTitle>Mes livres</CardTitle>
        </CardHeader>
        <CardContent>
          {books && books.length > 0 ? (
            <div className="space-y-4">
              {books.map((book) => (
                <div key={book.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>{book.sales_count || 0} ventes</span>
                      <span>{book.views || 0} vues</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {book.price_physical && <p className="text-sm">{book.price_physical.toLocaleString()} FCFA</p>}
                    <p className="text-xs text-muted-foreground">{book.is_active ? "Actif" : "Désactivé"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun livre publié pour le moment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
