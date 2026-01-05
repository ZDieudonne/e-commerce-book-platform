import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star } from "lucide-react"

export async function BookReviews({ bookId }: { bookId: string }) {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("book_id", bookId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  if (!reviews || reviews.length === 0) {
    return null
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <div className="mt-12">
      <Separator className="mb-8" />
      <h2 className="text-2xl font-bold mb-6">Avis des lecteurs</h2>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${star <= averageRating ? "fill-primary text-primary" : "text-muted"}`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{reviews.length} avis</p>
      </div>

      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">{review.user_name}</p>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? "fill-primary text-primary" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              {review.title && <p className="font-medium mb-1">{review.title}</p>}
              <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
