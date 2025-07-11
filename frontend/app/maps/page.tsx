"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { Upload, Plus, Trash2, Eye, Save } from "lucide-react"

interface MapRegion {
  id: string
  name: string
  description: string
  color: string
  path: string
}

interface WorldMap {
  id: string
  name: string
  description: string
  imageUrl: string
  regions: MapRegion[]
  createdAt: string
}

export default function MapsPage() {
  const [maps, setMaps] = useState<WorldMap[]>([])
  const [selectedMap, setSelectedMap] = useState<WorldMap | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [drawingMode, setDrawingMode] = useState(false)
  const [currentPath, setCurrentPath] = useState<string>("")
  const [newRegion, setNewRegion] = useState({ name: "", description: "", color: "#3b82f6" })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageFile: null as File | null,
  })

  useEffect(() => {
    const savedMaps = localStorage.getItem("campaign-world-maps")
    if (savedMaps) {
      setMaps(JSON.parse(savedMaps))
    }
  }, [])

  const saveMaps = (newMaps: WorldMap[]) => {
    setMaps(newMaps)
    localStorage.setItem("campaign-world-maps", JSON.stringify(newMaps))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, imageFile: file })
    }
  }

  const handleCreateMap = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.imageFile) return

    const imageUrl = URL.createObjectURL(formData.imageFile)

    const newMap: WorldMap = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      imageUrl,
      regions: [],
      createdAt: new Date().toISOString(),
    }

    saveMaps([newMap, ...maps])
    setFormData({ name: "", description: "", imageFile: null })
    setIsCreating(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSVGClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!drawingMode || !svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (currentPath === "") {
      setCurrentPath(`M ${x} ${y}`)
    } else {
      setCurrentPath((prev) => `${prev} L ${x} ${y}`)
    }
  }

  const finishDrawing = () => {
    if (currentPath && newRegion.name) {
      const region: MapRegion = {
        id: Date.now().toString(),
        name: newRegion.name,
        description: newRegion.description,
        color: newRegion.color,
        path: currentPath + " Z",
      }

      if (selectedMap) {
        const updatedMap = {
          ...selectedMap,
          regions: [...selectedMap.regions, region],
        }
        const updatedMaps = maps.map((map) => (map.id === selectedMap.id ? updatedMap : map))
        saveMaps(updatedMaps)
        setSelectedMap(updatedMap)
      }

      setCurrentPath("")
      setNewRegion({ name: "", description: "", color: "#3b82f6" })
      setDrawingMode(false)
    }
  }

  const deleteRegion = (regionId: string) => {
    if (selectedMap) {
      const updatedMap = {
        ...selectedMap,
        regions: selectedMap.regions.filter((r) => r.id !== regionId),
      }
      const updatedMaps = maps.map((map) => (map.id === selectedMap.id ? updatedMap : map))
      saveMaps(updatedMaps)
      setSelectedMap(updatedMap)
    }
  }

  if (selectedMap) {
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
                  <Input
                    placeholder="Region name"
                    value={newRegion.name}
                    onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                    className="w-32"
                  />
                  <input
                    type="color"
                    value={newRegion.color}
                    onChange={(e) => setNewRegion({ ...newRegion, color: e.target.value })}
                    className="w-12 h-10 rounded border"
                  />
                  <Button onClick={finishDrawing} size="sm">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setDrawingMode(false)
                      setCurrentPath("")
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              )}
              <Button variant="outline" onClick={() => setSelectedMap(null)}>
                Back to Maps
              </Button>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1 p-4">
            <div className="relative inline-block">
              <img
                src={selectedMap.imageUrl || "/placeholder.svg"}
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
                    fill={hoveredRegion === region.id ? region.color : `${region.color}80`}
                    stroke={region.color}
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    style={{ pointerEvents: "auto" }}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  />
                ))}
                {currentPath && (
                  <path d={currentPath} fill="none" stroke={newRegion.color} strokeWidth="2" strokeDasharray="5,5" />
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
                  <CardDescription className="text-xs">Click on the map to create region boundaries</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Textarea
                    placeholder="Region description"
                    value={newRegion.description}
                    onChange={(e) => setNewRegion({ ...newRegion, description: e.target.value })}
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
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: region.color }} />
                        <CardTitle className="text-sm">{region.name}</CardTitle>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => deleteRegion(region.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  {region.description && (
                    <CardContent className="pt-0">
                      <p className="text-xs text-slate-600">{region.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">World Maps</h1>
            <p className="text-slate-600 mt-2">Upload and create interactive fantasy world maps</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Map
          </Button>
        </div>

        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload New World Map</CardTitle>
              <CardDescription>Upload an image of your fantasy world map to make it interactive</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMap} className="space-y-4">
                <Input
                  placeholder="Map name (e.g., 'Kingdom of Aethermoor')"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="Map description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setFormData({ name: "", description: "", imageFile: null })
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
          {maps.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <p className="text-slate-500 text-lg">No world maps yet.</p>
                <p className="text-slate-400 mt-2">Upload your first fantasy world map to get started!</p>
              </CardContent>
            </Card>
          ) : (
            maps.map((map) => (
              <Card key={map.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img src={map.imageUrl || "/placeholder.svg"} alt={map.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">{map.regions.length} regions</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{map.name}</CardTitle>
                  <CardDescription>{map.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setSelectedMap(map)} className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Explore
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const updatedMaps = maps.filter((m) => m.id !== map.id)
                        saveMaps(updatedMaps)
                      }}
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
  )
}
