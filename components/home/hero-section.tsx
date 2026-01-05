import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-background py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Découvrez la richesse de la littérature africaine
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
            Les Éditions La Réforme vous propose une sélection de livres authentiques célébrant la culture, les voix et
            les histoires d'Afrique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/catalogue">Explorer le catalogue</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/manuscrits">Soumettre un manuscrit</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
