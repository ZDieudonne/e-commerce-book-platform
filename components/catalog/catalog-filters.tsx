"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

type Category = {
  id: string
  name: string
  slug: string
}

type Collection = {
  id: string
  name: string
  slug: string
}

export function CatalogFilters({
  categories,
  collections,
}: {
  categories: Category[]
  collections: Collection[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === "all") {
      params.delete("category")
    } else {
      params.set("category", slug)
    }
    params.delete("collection")
    router.push(`/catalogue?${params.toString()}`)
  }

  const handleCollectionChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === "all") {
      params.delete("collection")
    } else {
      params.set("collection", slug)
    }
    params.delete("category")
    router.push(`/catalogue?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.push(`/catalogue?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setSearch("")
    router.push("/catalogue")
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <Input placeholder="Rechercher un livre..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type="submit" className="w-full">
              Rechercher
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={searchParams.get("collection") || "all"} onValueChange={handleCollectionChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="collection-all" />
              <Label htmlFor="collection-all">Toutes les collections</Label>
            </div>
            {collections.map((collection) => (
              <div key={collection.id} className="flex items-center space-x-2">
                <RadioGroupItem value={collection.slug} id={`collection-${collection.slug}`} />
                <Label htmlFor={`collection-${collection.slug}`}>{collection.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={searchParams.get("category") || "all"} onValueChange={handleCategoryChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="category-all" />
              <Label htmlFor="category-all">Toutes les catégories</Label>
            </div>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.slug} id={`category-${category.slug}`} />
                <Label htmlFor={`category-${category.slug}`}>{category.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {(searchParams.get("category") || searchParams.get("collection") || searchParams.get("search")) && (
        <Button variant="outline" onClick={handleClearFilters} className="w-full bg-transparent">
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  )
}
