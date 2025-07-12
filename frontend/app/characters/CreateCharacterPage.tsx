"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Character } from "./CharactersLandingPage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CreateCharacterPage({
  character,
  onSave,
  onCancel,
}: {
  character?: Character | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: character?.name || "",
    type: character?.type || "npc",
    location: character?.location || "",
    description: character?.description || "",
    notes: character?.notes || "",
    tags: character?.tags ? character.tags.join(", ") : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const characterPayload = {
      ...formData,
      tags: tagsArray,
    };
    let response;
    if (character) {
      response = await fetch(`${API_URL}/characters/${character.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(characterPayload),
      });
    } else {
      response = await fetch(`${API_URL}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(characterPayload),
      });
    }
    if (response.ok) {
      onSave();
      setFormData({
        name: "",
        type: "npc",
        location: "",
        description: "",
        notes: "",
        tags: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {character ? "Edit Character" : "Add New Character"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Character name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Select
                  value={formData.type}
                  onValueChange={(value: Character["type"]) =>
                    setFormData({ ...formData, type: value })
                  }
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
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <Textarea
                placeholder="Character description and background..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                required
              />
              <Textarea
                placeholder="Campaign notes and interactions..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
              <Input
                placeholder="Tags (comma separated): merchant, quest-giver, noble..."
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button type="submit">
                  {character ? "Update Character" : "Add Character"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
