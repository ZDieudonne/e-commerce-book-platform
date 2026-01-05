import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  bookId: string
  bookTitle: string
  bookAuthor: string
  bookCover: string | null
  isPdf: boolean
  price: number
  quantity: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (bookId: string, isPdf: boolean) => void
  updateQuantity: (bookId: string, isPdf: boolean, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.bookId === item.bookId && i.isPdf === item.isPdf)

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.bookId === item.bookId && i.isPdf === item.isPdf ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            }
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          }
        })
      },
      removeItem: (bookId, isPdf) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.bookId === bookId && item.isPdf === isPdf)),
        }))
      },
      updateQuantity: (bookId, isPdf, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId, isPdf)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.bookId === bookId && item.isPdf === isPdf ? { ...item, quantity } : item,
          ),
        }))
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
