import { requireAuth } from "@/lib/auth/get-user"
import { redirect } from "next/navigation"

export default async function AccountPage() {
  const user = await requireAuth()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen py-8 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mon compte</h1>
      <p>Bienvenue, {user.email}</p>
    </div>
  )
}
