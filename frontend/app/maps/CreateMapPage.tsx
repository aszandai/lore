"use client";

import { useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window === "undefined"
    ? "http://backend:5000"
    : "http://localhost:5000");

export default function CreateMapPage({
  onMapCreated,
  onCancel,
}: {
  onMapCreated: () => void;
  onCancel: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageFile: null as File | null,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, imageFile: file });
    }
  };

  const handleCreateMap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageFile) return;

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("image", formData.imageFile);

    const response = await fetch(`${API_URL}/maps`, {
      method: "POST",
      body: form,
    });

    if (response.ok) {
      onMapCreated();
      setFormData({ name: "", description: "", imageFile: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload New Map</CardTitle>
            <CardDescription>
              Upload an image of your fantasy world map and make it interactive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateMap} className="space-y-4">
              <Input
                placeholder="Map name (e.g., 'Kingdom of Aethermoor')"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Textarea
                placeholder="Map description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={!formData.imageFile}>
                  Create Interactive Map
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
