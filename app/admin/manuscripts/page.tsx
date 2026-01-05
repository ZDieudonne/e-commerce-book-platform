import { requireAdmin } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminManuscriptsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: manuscripts } = await supabase.from("manuscripts").select("*").order("created_at", { ascending: false })

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manuscrits</h1>
        <p className="text-muted-foreground">Gérer les soumissions de manuscrits</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les manuscrits</CardTitle>
        </CardHeader>
        <CardContent>
          {manuscripts && manuscripts.length > 0 ? (
            <div className="space-y-4">
              {manuscripts.map((manuscript) => (
                <div key={manuscript.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{manuscript.title}</p>
                      <Badge className={getStatusColor(manuscript.status)}>{getStatusLabel(manuscript.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{manuscript.author_name}</p>
                    <p className="text-sm text-muted-foreground">{manuscript.genre}</p>
                    <p className="text-sm text-muted-foreground">
                      WhatsApp: {manuscript.author_whatsapp} | Email: {manuscript.author_email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Soumis le {new Date(manuscript.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/admin/manuscripts/${manuscript.id}`}>Détails</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Aucun manuscrit</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
