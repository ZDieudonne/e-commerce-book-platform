import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ManuscriptForm } from "@/components/manuscripts/manuscript-form"
import { Check } from "lucide-react"

export default function ManuscriptsPage() {
  const steps = [
    "Remplissez le formulaire avec vos informations",
    "Joignez votre manuscrit (PDF, Word, etc.)",
    "Notre équipe examine votre soumission sous 7 à 14 jours",
    "Vous recevez une réponse par email et WhatsApp",
  ]

  const requirements = [
    "Manuscrit complet en français",
    "Document lisible (PDF recommandé)",
    "Synopsis d'une page maximum",
    "Numéro WhatsApp obligatoire pour le suivi",
  ]

  return (
    <div className="min-h-screen py-12 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Soumettre un manuscrit</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
          Partagez votre talent avec nous. Les Éditions La Réforme est toujours à la recherche de nouvelles voix
          littéraires africaines.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Comment ça marche?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prérequis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {requirements.map((req, index) => (
                <li key={index} className="flex gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulaire de soumission</CardTitle>
        </CardHeader>
        <CardContent>
          <ManuscriptForm />
        </CardContent>
      </Card>

      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Questions?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Contactez-nous directement sur WhatsApp pour toute question concernant votre soumission.
        </p>
        <a
          href="https://wa.me/22671671801?text=Bonjour, j'ai une question concernant la soumission de manuscrit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline underline-offset-4"
        >
          Nous contacter sur WhatsApp
        </a>
      </div>
    </div>
  )
}
