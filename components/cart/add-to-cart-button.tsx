"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import { ShoppingCart, Check } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function AddToCartButton({
  bookId,
  bookType,
  price,
}: {
  bookId: string
  bookType: "physical" | "pdf"
  price: number
}) {
  const [book, setBook] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchBook = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("books")
        .select("title, author_name, cover_image_url")
        .eq("id", bookId)
        .single()
      setBook(data)
    }
    fetchBook()
  }, [bookId])

  const handleAddToCart = () => {
    if (!book) return

    setIsLoading(true)
    addItem({
      bookId,
      bookTitle: book.title,
      bookAuthor: book.author_name,
      bookCover: book.cover_image_url,
      isPdf: bookType === "pdf",
      price,
    })

    toast({
      title: "✅ Ajouté au panier",
      description: `${book.title} (${bookType === "pdf" ? "PDF" : "Livre physique"}) a été ajouté à votre panier.`,
      action: {
        label: "Voir le panier",
        onClick: () => router.push("/panier"),
      },
    })

    setIsAdded(true)
    setIsLoading(false)

    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  if (isAdded) {
    return (
      <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
        <Check className="h-4 w-4 mr-2" />
        Ajouté !
      </Button>
    )
  }

  return (
    <Button onClick={handleAddToCart} disabled={isLoading} className="w-full mt-4">
      <ShoppingCart className="h-4 w-4 mr-2" />
      Ajouter au panier
    </Button>
  )
}
