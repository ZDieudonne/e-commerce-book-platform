import { requireAdmin } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ManuscriptActions } from "@/components/admin/manuscript-actions"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default async function AdminManuscriptDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = await createClient()

  const { data: manuscript } = await supabase.from("manuscripts").select("*").eq("id", id).single()

  if (!manuscript) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "under_review":
        return "bg-blue-500"
      case "accepted":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "En attente",
      under_review: "En cours de révision",
      accepted: "Accepté",
      rejected: "Refusé",
    }
    return labels[status] || status
  }

  // Get download URLs
  const { data: manuscriptUrl } = supabase.storage.from("manuscripts").getPublicUrl(manuscript.manuscript_url)

  let synopsisUrl = null
  if (manuscript.synopsis_url) {
    const { data } = supabase.storage.from("manuscripts").getPublicUrl(manuscript.synopsis_url)
    synopsisUrl = data
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">{manuscript.title}</h1>
        <Badge className={getStatusColor(manuscript.status)}>{getStatusLabel(manuscript.status)}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations auteur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Nom</p>
              <p className="text-sm text-muted-foreground">{manuscript.author_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{manuscript.author_email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Téléphone</p>
              <p className="text-sm text-muted-foreground">{manuscript.author_phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium">WhatsApp</p>
              <p className="text-sm text-muted-foreground">{manuscript.author_whatsapp}</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent" asChild>
                <a
                  href={`https://wa.me/${manuscript.author_whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contacter sur WhatsApp
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Détails du manuscrit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Genre</p>
              <p className="text-sm text-muted-foreground">{manuscript.genre}</p>
            </div>
            {manuscript.word_count && (
              <div>
                <p className="text-sm font-medium">Nombre de mots</p>
                <p className="text-sm text-muted-foreground">{manuscript.word_count.toLocaleString()}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Soumis le</p>
              <p className="text-sm text-muted-foreground">
                {new Date(manuscript.created_at).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Synopsis / Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{manuscript.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="outline" className="w-full bg-transparent">
            <a href={manuscriptUrl.publicUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Télécharger le manuscrit
            </a>
          </Button>
          {synopsisUrl && (
            <Button asChild variant="outline" className="w-full bg-transparent">
              <a href={synopsisUrl.publicUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Télécharger le synopsis
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {manuscript.admin_notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes administrateur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{manuscript.admin_notes}</p>
          </CardContent>
        </Card>
      )}

      <ManuscriptActions manuscriptId={manuscript.id} currentStatus={manuscript.status} />
    </div>
  )
}
