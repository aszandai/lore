"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Users, Crown, Sword, Shield } from "lucide-react";

export interface Character {
  id: string;
  name: string;
  type: "npc" | "ally" | "enemy" | "neutral";
  location: string;
  description: string;
  notes: string;
  tags: string[];
  createdAt: string;
}

const characterTypes = {
  npc: { label: "NPC", icon: Users, color: "bg-blue-500" },
  ally: { label: "Ally", icon: Shield, color: "bg-green-500" },
  enemy: { label: "Enemy", icon: Sword, color: "bg-red-500" },
  neutral: { label: "Neutral", icon: Crown, color: "bg-yellow-500" },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CharactersLandingPage({
  onCreate,
  onEdit,
}: {
  onCreate: () => void;
  onEdit: (character: Character) => void;
}) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/characters`)
      .then((res) => res.json())
      .then((data) => setCharacters(data))
      .catch(() => setCharacters([]));
  }, []);

  const saveCharacters = (newCharacters: Character[]) => {
    setCharacters(newCharacters);
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/characters/${id}`, { method: "DELETE" });
    const updatedCharacters = await fetch(`${API_URL}/characters`).then((res) =>
      res.json()
    );
    saveCharacters(updatedCharacters);
  };

  const filteredCharacters = characters.filter((character) => {
    const matchesType = filterType === "all" || character.type === filterType;
    const matchesSearch =
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Characters & NPCs
            </h1>
            <p className="text-slate-600 mt-2">
              Manage your campaign's cast of characters
            </p>
          </div>
          <Button onClick={onCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Character
          </Button>
        </div>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <p className="text-slate-500 text-lg">
                  {searchTerm || filterType !== "all"
                    ? "No characters match your filters."
                    : "No characters yet."}
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
              const TypeIcon = characterTypes[character.type].icon;
              return (
                <Card
                  key={character.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`p-1 rounded ${
                              characterTypes[character.type].color
                            }`}
                          >
                            <TypeIcon className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg">
                            {character.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm">
                          📍 {character.location}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(character)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(character.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700 mb-3 line-clamp-3">
                      {character.description}
                    </p>
                    {character.notes && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-slate-500 mb-1">
                          Campaign Notes:
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {character.notes}
                        </p>
                      </div>
                    )}
                    {character.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {character.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
