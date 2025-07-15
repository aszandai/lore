"use client";
import { useState } from "react";
import MapLandingPage from "./MapLandingPage";
import CreateMapPage from "./CreateMapPage";

export default function MapsPage() {
  const [view, setView] = useState<"landing" | "create">("landing");

  const handleCreateMap = () => setView("create");
  const handleMapCreated = () => setView("landing");
  const handleBackToMaps = () => setView("landing");

  if (view === "create") {
    return (
      <CreateMapPage
        onMapCreated={handleMapCreated}
        onCancel={handleBackToMaps}
      />
    );
  }

  return <MapLandingPage onCreateMap={handleCreateMap} />;
}
