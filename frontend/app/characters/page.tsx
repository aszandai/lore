"use client";

import { useState } from "react";
import CharactersLandingPage from "./CharactersLandingPage";
import CreateCharacterPage from "./CreateCharacterPage";
import CharacterDetailPage from "./CharacterDetailPage";
import type { Character } from "./CharactersLandingPage";

export default function CharactersPage() {
  const [view, setView] = useState<"landing" | "create" | "edit" | "detail">(
    "landing"
  );
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null
  );
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const handleCreate = () => {
    setEditingCharacter(null);
    setView("create");
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setView("edit");
  };

  const handleSave = () => {
    setEditingCharacter(null);
    setView("landing");
  };

  const handleCancel = () => {
    setEditingCharacter(null);
    setView("landing");
  };

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setView("detail");
  };

  const handleBackToLanding = () => {
    setSelectedCharacter(null);
    setView("landing");
  };

  if (view === "create") {
    return <CreateCharacterPage onSave={handleSave} onCancel={handleCancel} />;
  }
  if (view === "edit" && editingCharacter) {
    return (
      <CreateCharacterPage
        character={editingCharacter}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }
  if (view === "detail" && selectedCharacter) {
    return (
      <CharacterDetailPage
        character={selectedCharacter}
        onBack={handleBackToLanding}
      />
    );
  }
  // Default: landing page
  return <CharactersLandingPage onCreate={handleCreate} onEdit={handleEdit} />;
}
