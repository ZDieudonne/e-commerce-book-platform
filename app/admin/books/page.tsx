import { requireAdmin } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default async function AdminBooksPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: books } = await supabase.from("books").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Livres</h1>
          <p className="text-muted-foreground">Gérer tous les livres du catalogue</p>
        </div>
        <Button asChild>
          <Link href="/admin/books/new">Ajouter un livre</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les livres</CardTitle>
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
                    <p className="text-sm text-muted-foreground">{book.author_name}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      {book.price_physical && <span>Physique: {book.price_physical.toLocaleString()} FCFA</span>}
                      {book.price_pdf && <span>PDF: {book.price_pdf.toLocaleString()} FCFA</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="bg-transparent">
                      <Link href={`/livres/${book.slug}`}>Voir</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/admin/books/${book.id}/edit`}>Éditer</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Aucun livre</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
