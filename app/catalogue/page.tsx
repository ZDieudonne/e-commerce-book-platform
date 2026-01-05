import { createClient } from "@/lib/supabase/server"
import { BookGrid } from "@/components/books/book-grid"
import { CatalogFilters } from "@/components/catalog/catalog-filters"

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; collection?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from("books").select("*").eq("is_active", true)

  if (params.search) {
    const searchTerm = `%${params.search}%`
    query = query.or(`title.ilike.${searchTerm},author_name.ilike.${searchTerm}`)
  }

  if (params.category) {
    const { data: category } = await supabase.from("categories").select("id").eq("slug", params.category).single()
    if (category) {
      query = query.eq("category_id", category.id)
    }
  }

  if (params.collection) {
    const { data: collection } = await supabase.from("collections").select("id").eq("slug", params.collection).single()
    if (collection) {
      query = query
        .select(
          `
        *,
        book_collections!inner(collection_id)
      `,
        )
        .eq("book_collections.collection_id", collection.id)
    }
  }

  const { data: books } = await query.order("created_at", { ascending: false })

  const { data: categories } = await supabase.from("categories").select("*").order("name")
  const { data: collections } = await supabase.from("collections").select("*").order("display_order")

  return (
    <div className="min-h-screen py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Catalogue</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <CatalogFilters categories={categories || []} collections={collections || []} />
        </aside>

        <main className="lg:col-span-3">
          {books && books.length > 0 ? (
            <BookGrid books={books} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun livre trouvé</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
