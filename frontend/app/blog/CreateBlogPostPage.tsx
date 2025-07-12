"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPost } from "./BlogLandingPage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CreateBlogPostPage({
  post,
  onSave,
  onCancel,
}: {
  post?: BlogPost | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    tags: post?.tags ? post.tags.join(", ") : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const postPayload = {
      title: formData.title,
      content: formData.content,
      tags: tagsArray,
    };
    let response;
    if (post) {
      response = await fetch(`${API_URL}/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });
    } else {
      response = await fetch(`${API_URL}/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });
    }
    if (response.ok) {
      onSave();
      setFormData({ title: "", content: "", tags: "" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{post ? "Edit Post" : "Create New Post"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Post title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <Textarea
                placeholder="Write your campaign story..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={10}
                required
              />
              <Input
                placeholder="Tags (comma separated): adventure, npc, location..."
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button type="submit">
                  {post ? "Update Post" : "Publish Post"}
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
