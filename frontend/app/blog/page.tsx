"use client";

import { useState } from "react";
import BlogLandingPage from "./BlogLandingPage";
import CreateBlogPostPage from "./CreateBlogPostPage";
import type { BlogPost } from "./BlogLandingPage";

export default function BlogPage() {
  const [view, setView] = useState<"landing" | "create" | "edit" | "detail">(
    "landing"
  );
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleCreate = () => {
    setEditingPost(null);
    setView("create");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setView("edit");
  };

  const handleSave = () => {
    setEditingPost(null);
    setView("landing");
  };

  const handleCancel = () => {
    setEditingPost(null);
    setView("landing");
  };

  if (view === "create") {
    return <CreateBlogPostPage onSave={handleSave} onCancel={handleCancel} />;
  }
  if (view === "edit" && editingPost) {
    return (
      <CreateBlogPostPage
        post={editingPost}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return <BlogLandingPage onCreate={handleCreate} onEdit={handleEdit} />;
}
