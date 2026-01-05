import Link from "next/link"
import { Facebook, Mail, Phone } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Les Éditions La Réforme</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Maison d'édition burkinabè dédiée à la promotion de la littérature africaine francophone.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="text-muted-foreground hover:text-foreground">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/manuscrits" className="text-muted-foreground hover:text-foreground">
                  Soumettre un manuscrit
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-muted-foreground hover:text-foreground">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cgv" className="text-muted-foreground hover:text-foreground">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-muted-foreground hover:text-foreground">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+226 71 67 18 01</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:lareforme27@gmail.com" className="hover:text-foreground">
                  lareforme27@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Facebook className="h-4 w-4" />
                <a
                  href="https://www.facebook.com/share/1B3xuWdWxy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Les Éditions La Réforme. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
