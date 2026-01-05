import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ManuscriptSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">Manuscrit reçu!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg mb-4">
              Merci d'avoir soumis votre manuscrit aux Éditions La Réforme. Nous avons bien reçu votre travail.
            </p>
            <p className="text-muted-foreground">
              Notre équipe éditoriale va examiner votre manuscrit avec attention. Vous recevrez une réponse par email et
              WhatsApp sous 7 à 14 jours ouvrables.
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Prochaines étapes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Nous examinons votre manuscrit</li>
              <li>• Vous recevez notre réponse par email et WhatsApp</li>
              <li>• Si accepté, nous discutons des détails de publication</li>
              <li>• Si refusé, nous vous expliquons les raisons</li>
            </ul>
          </div>

          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm">
              <strong>Besoin de nous contacter?</strong>
              <br />
              WhatsApp: +226 71 67 18 01
              <br />
              Email: lareforme27@gmail.com
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Retour à l'accueil</Link>
            </Button>
            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/catalogue">Explorer le catalogue</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
