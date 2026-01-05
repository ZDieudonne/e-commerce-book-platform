import { requireAuthor } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthorProfileForm } from "@/components/author/author-profile-form"

export default async function AuthorProfilePage() {
  const author = await requireAuthor()
  const supabase = await createClient()

  const { data: authorData } = await supabase.from("authors").select("*").eq("id", author.id).single()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
        <p className="text-muted-foreground">Gérer mes informations d'auteur</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations publiques</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthorProfileForm author={authorData} profile={author} />
        </CardContent>
      </Card>
    </div>
  )
}
