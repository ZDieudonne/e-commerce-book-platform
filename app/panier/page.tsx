"use client"

import { useCartStore } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const total = useCartStore((state) => state.getTotal())

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">Commencez par ajouter des livres à votre panier</p>
          <Button asChild>
            <Link href="/catalogue">Explorer le catalogue</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Panier</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.bookId}-${item.isPdf}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-32 flex-shrink-0 bg-muted rounded">
                    {item.bookCover ? (
                      <Image
                        src={item.bookCover || "/placeholder.svg"}
                        alt={item.bookTitle}
                        fill
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        Pas d'image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{item.bookTitle}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.bookAuthor}</p>
                      <p className="text-sm font-medium">{item.isPdf ? "Version PDF" : "Livre physique"}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {!item.isPdf && (
                          <>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.bookId, item.isPdf, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.bookId, item.isPdf, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-bold">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item.bookId, item.isPdf)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{total.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-sm">Calculée à la prochaine étape</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">Passer la commande</Link>
              </Button>

              <Button variant="outline" asChild className="w-full mt-2 bg-transparent">
                <Link href="/catalogue">Continuer mes achats</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
