import { requireAuthor } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AuthorBooksPage() {
  const author = await requireAuthor()
  const supabase = await createClient()

  const { data: books } = await supabase
    .from("books")
    .select("*")
    .eq("author_id", author.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mes livres</h1>
        <p className="text-muted-foreground">Tous mes livres publiés sur la plateforme</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalogue</CardTitle>
        </CardHeader>
        <CardContent>
          {books && books.length > 0 ? (
            <div className="space-y-4">
              {books.map((book) => (
                <div key={book.id} className="flex gap-4 items-start border-b pb-4 last:border-0">
                  <div className="relative w-16 h-20 flex-shrink-0 bg-muted rounded">
                    {book.cover_image_url ? (
                      <Image
                        src={book.cover_image_url || "/placeholder.svg"}
                        alt={book.title}
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
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{book.title}</p>
                      {!book.is_active && <Badge variant="secondary">Désactivé</Badge>}
                      {book.is_featured && <Badge>En vedette</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{book.description.slice(0, 100)}...</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">Ventes: {book.sales_count || 0}</span>
                      <span className="text-muted-foreground">Vues: {book.views || 0}</span>
                      {book.stock_physical !== null && (
                        <span className="text-muted-foreground">Stock: {book.stock_physical}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      {book.price_physical && (
                        <p className="text-sm">Physique: {book.price_physical.toLocaleString()} FCFA</p>
                      )}
                      {book.price_pdf && <p className="text-sm">PDF: {book.price_pdf.toLocaleString()} FCFA</p>}
                    </div>
                    <Button asChild size="sm" variant="outline" className="bg-transparent">
                      <Link href={`/livres/${book.slug}`}>Voir sur le site</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun livre publié pour le moment</p>
              <p className="text-sm text-muted-foreground mt-2">Contactez l'administration pour ajouter vos livres</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
