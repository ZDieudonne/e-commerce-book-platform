import { BookCard } from "@/components/books/book-card"

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

export function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
