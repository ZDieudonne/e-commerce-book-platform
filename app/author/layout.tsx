import type React from "react"
import { requireAuthor } from "@/lib/auth/get-user"
import { AuthorNav } from "@/components/author/author-nav"

export default async function AuthorLayout({ children }: { children: React.ReactNode }) {
  await requireAuthor()

  return (
    <div className="flex min-h-screen">
      <AuthorNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
