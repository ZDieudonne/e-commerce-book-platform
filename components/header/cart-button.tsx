"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function CartButton() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
  }, [itemCount])

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/panier">
        <ShoppingCart className={`h-5 w-5 ${isAnimating ? "animate-bounce" : ""}`} />
        {itemCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold ${isAnimating ? "animate-ping" : ""}`}
          >
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
