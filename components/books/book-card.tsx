import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

type Book = {
  id: string
  title: string
  slug: string
  author_name: string
  price_physical: number | null
  price_pdf: number | null
  cover_image_url: string | null
  description: string
}

export function BookCard({ book }: { book: Book }) {
  const minPrice = Math.min(...[book.price_physical, book.price_pdf].filter((p): p is number => p !== null))

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Link href={`/livres/${book.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-muted">
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span>Pas d'image</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4 flex-1">
        <Link href={`/livres/${book.slug}`}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:underline">{book.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">{book.author_name}</p>
        <p className="text-lg font-bold">{minPrice.toLocaleString()} FCFA</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/livres/${book.slug}`}>Voir détails</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
