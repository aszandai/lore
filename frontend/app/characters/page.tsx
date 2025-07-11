"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Users, Crown, Sword, Shield } from "lucide-react"

interface Character {
  id: string
  name: string
  type: "npc" | "ally" | "enemy" | "neutral"
  location: string
  description: string
  notes: string
  tags: string[]
  createdAt: string
}

const characterTypes = {
  npc: { label: "NPC", icon: Users, color: "bg-blue-500" },
  ally: { label: "Ally", icon: Shield, color: "bg-green-500" },
  enemy: { label: "Enemy", icon: Sword, color: "bg-red-500" },
  neutral: { label: "Neutral", icon: Crown, color: "bg-yellow-500" },
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    type: "npc" as Character["type"],
    location: "",
    description: "",
    notes: "",
    tags: "",
  })

  useEffect(() => {
    const savedCharacters = localStorage.getItem("campaign-characters")
    if (savedCharacters) {
      setCharacters(JSON.parse(savedCharacters))
    }
  }, [])

  const saveCharacters = (newCharacters: Character[]) => {
    setCharacters(newCharacters)
    localStorage.setItem("campaign-characters", JSON.stringify(newCharacters))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const now = new Date().toISOString()
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (editingCharacter) {
      const updatedCharacters = characters.map((char) =>
        char.id === editingCharacter.id
          ? {
              ...char,
              ...formData,
              tags: tagsArray,
            }
          : char,
      )
      saveCharacters(updatedCharacters)
      setEditingCharacter(null)
    } else {
      const newCharacter: Character = {
        id: Date.now().toString(),
        ...formData,
        tags: tagsArray,
        createdAt: now,
      }
      saveCharacters([newCharacter, ...characters])
    }

    setFormData({
      name: "",
      type: "npc",
      location: "",
      description: "",
      notes: "",
      tags: "",
    })
    setIsCreating(false)
  }

  const handleEdit = (character: Character) => {
    setEditingCharacter(character)
    setFormData({
      name: character.name,
      type: character.type,
      location: character.location,
      description: character.description,
      notes: character.notes,
      tags: character.tags.join(", "),
    })
    setIsCreating(true)
  }

  const handleDelete = (id: string) => {
    const updatedCharacters = characters.filter((char) => char.id !== id)
    saveCharacters(updatedCharacters)
  }

  const filteredCharacters = characters.filter((character) => {
    const matchesType = filterType === "all" || character.type === filterType
    const matchesSearch =
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Characters & NPCs</h1>
            <p className="text-slate-600 mt-2">Manage your campaign's cast of characters</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Character
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="npc">NPCs</SelectItem>
              <SelectItem value="ally">Allies</SelectItem>
              <SelectItem value="enemy">Enemies</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingCharacter ? "Edit Character" : "Add New Character"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Character name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Select
                    value={formData.type}
                    onValueChange={(value: Character["type"]) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="npc">NPC</SelectItem>
                      <SelectItem value="ally">Ally</SelectItem>
                      <SelectItem value="enemy">Enemy</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Location (e.g., 'Tavern in Waterdeep', 'Royal Palace')"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <Textarea
                  placeholder="Character description and background..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
                <Textarea
                  placeholder="Campaign notes and interactions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
                <Input
                  placeholder="Tags (comma separated): merchant, quest-giver, noble..."
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button type="submit">{editingCharacter ? "Update Character" : "Add Character"}</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setEditingCharacter(null)
                      setFormData({
                        name: "",
                        type: "npc",
                        location: "",
                        description: "",
                        notes: "",
                        tags: "",
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <p className="text-slate-500 text-lg">
                  {searchTerm || filterType !== "all" ? "No characters match your filters." : "No characters yet."}
                </p>
                <p className="text-slate-400 mt-2">
                  {searchTerm || filterType !== "all"
                    ? "Try adjusting your search or filters."
                    : "Start building your campaign's cast of characters!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredCharacters.map((character) => {
              const TypeIcon = characterTypes[character.type].icon
              return (
                <Card key={character.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1 rounded ${characterTypes[character.type].color}`}>
                            <TypeIcon className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg">{character.name}</CardTitle>
                        </div>
                        <CardDescription className="text-sm">📍 {character.location}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(character)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(character.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700 mb-3 line-clamp-3">{character.description}</p>
                    {character.notes && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-slate-500 mb-1">Campaign Notes:</p>
                        <p className="text-xs text-slate-600 line-clamp-2">{character.notes}</p>
                      </div>
                    )}
                    {character.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {character.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
