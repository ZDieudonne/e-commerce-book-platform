"use client"

import { cn } from "@/lib/utils"
import { BookOpen, LayoutDashboard, MessageSquare, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/author", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/author/books", label: "Mes livres", icon: BookOpen },
  { href: "/author/reviews", label: "Avis", icon: MessageSquare },
  { href: "/author/profile", label: "Mon profil", icon: User },
]

export function AuthorNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 border-r bg-muted/10 p-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold">Espace Auteur</h2>
        <p className="text-sm text-muted-foreground">Les Éditions La Réforme</p>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="mt-8 pt-8 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          Retour au site
        </Link>
      </div>
    </nav>
  )
}
