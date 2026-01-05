import { createClient } from "@/lib/supabase/server"
import { BookGrid } from "@/components/books/book-grid"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Collection = {
  id: string
  name: string
  slug: string
  description: string | null
}

export async function CollectionSection({ collection }: { collection: Collection }) {
  const supabase = await createClient()

  const { data: books } = await supabase
    .from("books")
    .select(
      `
      *,
      book_collections!inner(collection_id)
    `,
    )
    .eq("is_active", true)
    .eq("book_collections.collection_id", collection.id)
    .limit(8)

  if (!books || books.length === 0) return null

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">{collection.name}</h2>
          {collection.description && <p className="text-muted-foreground">{collection.description}</p>}
        </div>
        <Button variant="outline" asChild>
          <Link href={`/catalogue?collection=${collection.slug}`}>Voir tout</Link>
        </Button>
      </div>
      <BookGrid books={books} />
    </section>
  )
}
