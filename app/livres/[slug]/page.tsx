import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { BookReviews } from "@/components/books/book-reviews"
import { WhatsAppButton } from "@/components/whatsapp-button"

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data: books } = await supabase.from("books").select("slug").eq("is_active", true)

  return books?.map((book) => ({ slug: book.slug })) || []
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: book } = await supabase
    .from("books")
    .select(
      `
      *,
      authors(display_name, bio, id),
      categories(name, slug)
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!book) {
    notFound()
  }

  let authorWhatsapp = null
  if (book.authors?.id) {
    const { data: profile } = await supabase.from("profiles").select("whatsapp").eq("id", book.authors.id).single()

    authorWhatsapp = profile?.whatsapp
  }

  // Increment views
  await supabase
    .from("books")
    .update({ views: (book.views || 0) + 1 })
    .eq("id", book.id)

  return (
    <div className="min-h-screen py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Book Cover */}
        <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span>Pas d'image</span>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold mb-2 text-balance">{book.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">par {book.author_name}</p>

          <div className="flex flex-col gap-4 mb-6">
            {book.price_physical && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Livre physique</p>
                      <p className="text-sm text-muted-foreground">
                        {book.stock_physical > 0 ? `${book.stock_physical} en stock` : "Épuisé"}
                      </p>
                    </div>
                    <p className="text-2xl font-bold">{book.price_physical.toLocaleString()} FCFA</p>
                  </div>
                  {book.stock_physical > 0 && (
                    <AddToCartButton bookId={book.id} bookType="physical" price={book.price_physical} />
                  )}
                </CardContent>
              </Card>
            )}

            {book.is_pdf_available && book.price_pdf && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Version PDF</p>
                      <p className="text-sm text-muted-foreground">Téléchargement immédiat après validation</p>
                    </div>
                    <p className="text-2xl font-bold">{book.price_pdf.toLocaleString()} FCFA</p>
                  </div>
                  <AddToCartButton bookId={book.id} bookType="pdf" price={book.price_pdf} />
                </CardContent>
              </Card>
            )}
          </div>

          <Separator className="my-6" />

          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{book.description}</p>
          </div>

          {book.authors && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="text-lg font-semibold mb-2">À propos de l'auteur</h3>
                <p className="text-sm font-medium mb-2">{book.authors.display_name}</p>
                {book.authors.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{book.authors.bio}</p>
                )}
                {authorWhatsapp && (
                  <Button variant="outline" className="mt-4 bg-transparent" asChild>
                    <a
                      href={`https://wa.me/${authorWhatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contacter l'auteur sur WhatsApp
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <BookReviews bookId={book.id} />
      <WhatsAppButton />
    </div>
  )
}
