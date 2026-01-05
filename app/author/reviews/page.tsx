import { requireAuthor } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function AuthorReviewsPage() {
  const author = await requireAuthor()
  const supabase = await createClient()

  // Get all books by this author
  const { data: books } = await supabase.from("books").select("id").eq("author_id", author.id)

  const bookIds = books?.map((book) => book.id) || []

  // Get all reviews for these books
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      books!inner(title)
    `,
    )
    .in("book_id", bookIds)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Avis des lecteurs</h1>
        <p className="text-muted-foreground">Tous les avis laissés sur mes livres</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les avis</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{review.user_name}</p>
                        {review.is_approved ? (
                          <Badge className="bg-green-500">Approuvé</Badge>
                        ) : (
                          <Badge variant="secondary">En attente</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Sur: {review.books.title}</p>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? "fill-primary text-primary" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun avis pour le moment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
