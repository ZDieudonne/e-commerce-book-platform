"use client"

import { cn } from "@/lib/utils"
import {
  BookOpen,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  LayoutDashboard,
  Newspaper,
  Calendar,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/books", label: "Livres", icon: BookOpen },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/manuscripts", label: "Manuscrits", icon: FileText },
  { href: "/admin/reviews", label: "Avis", icon: MessageSquare },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/events", label: "Événements", icon: Calendar },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 border-r bg-muted/10 p-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold">Admin</h2>
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
