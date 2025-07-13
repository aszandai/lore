"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Upload, Eye, Trash2 } from "lucide-react";

export interface MapRegion {
  id: string;
  name: string;
  description: string;
  color: string;
  path: string;
}

export interface WorldMap {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  regions: MapRegion[];
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const getImageUrl = (map: WorldMap & { image_url?: string }) => {
  const url = map.image_url ?? map.imageUrl;
  if (!url) return "/placeholder.svg";
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
};

export default function MapLandingPage({
  onSelectMap,
  onCreateMap,
}: {
  onSelectMap: (map: WorldMap) => void;
  onCreateMap: () => void;
}) {
  const [maps, setMaps] = useState<WorldMap[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/maps`)
      .then((res) => res.json())
      .then((data) =>
        setMaps(
          data.map((map: any) => ({ ...map, regions: map.regions || [] }))
        )
      )
      .catch(() => setMaps([]));
  }, []);

  const saveMaps = (newMaps: WorldMap[]) => {
    const validMaps = (newMaps || [])
      .filter((map) => map && typeof map === "object")
      .map((map: any) => ({ ...map, regions: map.regions || [] }));
    setMaps(validMaps);
  };

  const handleDeleteMap = async (id: string) => {
    await fetch(`${API_URL}/maps/${id}`, { method: "DELETE" });
    const updatedMaps = await fetch(`${API_URL}/maps`).then((res) =>
      res.json()
    );
    saveMaps(updatedMaps);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">World Maps</h1>
            <p className="text-slate-600 mt-2">
              Upload and create your fantasy world maps
            </p>
          </div>
          <Button onClick={onCreateMap} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Map
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maps?.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <p className="text-slate-500 text-lg">No world maps yet.</p>
                <p className="text-slate-400 mt-2">
                  Upload your first fantasy world map to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            maps.map((map) => (
              <Card
                key={map.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={getImageUrl(map)}
                    alt={map.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">
                      {map.regions.length || 0} regions
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{map.name}</CardTitle>
                  <CardDescription>{map.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onSelectMap(map)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Explore
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteMap(map.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
