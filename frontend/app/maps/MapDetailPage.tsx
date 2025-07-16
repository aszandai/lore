"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { Save, Plus, Trash2 } from "lucide-react";
import { getApiUrl } from "@/utils/getApiUrl";

interface MapRegion {
  id: string;
  name: string;
  description: string;
  color: string;
  path: string;
}

interface WorldMap {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  regions: MapRegion[];
  createdAt: string;
}

const getImageUrl = (map: WorldMap & { image_url?: string }) => {
  return getApiUrl(map.image_url ?? map.imageUrl) ?? "/placeholder.svg";
};

export default function MapDetailPage({ map }: { map: WorldMap }) {
  const [selectedMap, setSelectedMap] = useState<WorldMap>(map);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [newRegion, setNewRegion] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
  });
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  const handleSVGClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drawingMode || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (currentPath === "") {
      setCurrentPath(`M ${x} ${y}`);
    } else {
      setCurrentPath((prev) => `${prev} L ${x} ${y}`);
    }
  };

  const finishDrawing = () => {
    if (currentPath && newRegion.name) {
      const region: MapRegion = {
        id: Date.now().toString(),
        name: newRegion.name,
        description: newRegion.description,
        color: newRegion.color,
        path: currentPath + " Z",
      };
      const updatedMap = {
        ...selectedMap,
        regions: [...selectedMap.regions, region],
      };
      setSelectedMap(updatedMap);
      setCurrentPath("");
      setNewRegion({ name: "", description: "", color: "#3b82f6" });
      setDrawingMode(false);
    }
  };

  const deleteRegion = (regionId: string) => {
    const updatedMap = {
      ...selectedMap,
      regions: selectedMap.regions.filter((r) => r.id !== regionId),
    };
    setSelectedMap(updatedMap);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b px-4 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{selectedMap.name}</h1>
            <p className="text-slate-600">{selectedMap.description}</p>
          </div>
          <div className="flex gap-2">
            {!drawingMode ? (
              <Button onClick={() => setDrawingMode(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Region
              </Button>
            ) : (
              <div className="flex gap-2 items-center">
                <Button onClick={finishDrawing} size="sm">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setDrawingMode(false);
                    setCurrentPath("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={() => router.push("/maps")}>
              Back to Maps
            </Button>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 p-4">
          <div className="relative inline-block">
            <img
              src={getImageUrl(selectedMap)}
              alt={selectedMap.name}
              className="max-w-full h-auto border rounded-lg shadow-lg"
            />
            <svg
              ref={svgRef}
              className="absolute top-0 left-0 w-full h-full cursor-crosshair"
              onClick={handleSVGClick}
              style={{ pointerEvents: drawingMode ? "auto" : "none" }}
            >
              {selectedMap.regions.map((region) => (
                <path
                  key={region.id}
                  d={region.path}
                  fill={
                    hoveredRegion === region.id
                      ? region.color
                      : `${region.color}80`
                  }
                  stroke={region.color}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  style={{ pointerEvents: "auto" }}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
              ))}
              {currentPath && (
                <path
                  d={currentPath}
                  fill="none"
                  stroke={newRegion.color}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
            </svg>
          </div>
        </div>
        <div className="w-80 bg-white border-l p-4">
          <h3 className="font-semibold mb-4">Regions</h3>
          {drawingMode && (
            <Card className="mb-4 border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Drawing Mode</CardTitle>
                <CardDescription className="text-xs">
                  Click on the map to create region boundaries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2 items-right">
                  <Input
                    placeholder="Region name"
                    value={newRegion.name}
                    onChange={(e) =>
                      setNewRegion({ ...newRegion, name: e.target.value })
                    }
                    className="w-32"
                  />
                  <input
                    type="color"
                    value={newRegion.color}
                    onChange={(e) =>
                      setNewRegion({ ...newRegion, color: e.target.value })
                    }
                    className="w-12 h-10 rounded border"
                  />
                </div>
                <Textarea
                  placeholder="Region description"
                  value={newRegion.description}
                  onChange={(e) =>
                    setNewRegion({ ...newRegion, description: e.target.value })
                  }
                  rows={2}
                />
              </CardContent>
            </Card>
          )}
          <div className="space-y-3">
            {selectedMap.regions.map((region) => (
              <Card
                key={region.id}
                className={`cursor-pointer transition-all ${
                  hoveredRegion === region.id ? "ring-2 ring-blue-400" : ""
                }`}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: region.color }}
                      />
                      <CardTitle className="text-sm">{region.name}</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteRegion(region.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                {region.description && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-slate-600">
                      {region.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
