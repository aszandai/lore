"use client";

import { useState } from "react";
import MapLandingPage from "./MapLandingPage";
import CreateMapPage from "./CreateMapPage";
import MapDetailPage from "./MapDetailPage";

import type { WorldMap } from "./MapLandingPage";

export default function MapsPage() {
  const [view, setView] = useState<"landing" | "create" | "detail">("landing");
  const [selectedMap, setSelectedMap] = useState<WorldMap | null>(null);

  const handleSelectMap = (map: WorldMap) => {
    setSelectedMap(map);
    setView("detail");
  };

  const handleCreateMap = () => {
    setView("create");
  };

  const handleMapCreated = () => {
    setView("landing");
  };

  const handleBackToMaps = () => {
    setSelectedMap(null);
    setView("landing");
  };

  if (view === "create") {
    return (
      <CreateMapPage
        onMapCreated={handleMapCreated}
        onCancel={handleBackToMaps}
      />
    );
  }
  if (view === "detail" && selectedMap) {
    return <MapDetailPage map={selectedMap} onBack={handleBackToMaps} />;
  }
  // Default: landing page
  return (
    <MapLandingPage
      onSelectMap={handleSelectMap}
      onCreateMap={handleCreateMap}
    />
  );
}
