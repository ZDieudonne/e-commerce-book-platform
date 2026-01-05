import { createClient } from "@/lib/supabase/server"
import { BookGrid } from "@/components/books/book-grid"
import { CollectionSection } from "@/components/home/collection-section"
import { HeroSection } from "@/components/home/hero-section"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured books
  const { data: featuredBooks } = await supabase
    .from("books")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(8)

  // Fetch collections with books
  const { data: collections } = await supabase.from("collections").select("*").order("display_order")

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Featured Books */}
      {featuredBooks && featuredBooks.length > 0 && (
        <section className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-8">Livres en vedette</h2>
          <BookGrid books={featuredBooks} />
        </section>
      )}

      {/* Collections */}
      {collections &&
        collections.map((collection) => <CollectionSection key={collection.id} collection={collection} />)}

      <WhatsAppButton />
    </div>
  )
}
