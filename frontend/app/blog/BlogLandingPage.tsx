"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogLandingPage({
  onCreate,
  onEdit,
}: {
  onCreate: () => void;
  onEdit: (post: BlogPost) => void;
}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/blog`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(
          data.map((post: any) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            tags: post.tags,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
          }))
        );
      })
      .catch(() => setPosts([]));
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/blog/${id}`, { method: "DELETE" });
    const updatedPosts = await fetch(`${API_URL}/blog`).then((res) =>
      res.json()
    );
    setPosts(
      updatedPosts.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        tags: post.tags,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
      }))
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Campaign Blog</h1>
            <p className="text-slate-600 mt-2">
              Chronicle your adventures and world-building
            </p>
          </div>
          <Button onClick={onCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-slate-500 text-lg">No blog posts yet.</p>
                <p className="text-slate-400 mt-2">
                  Start chronicling your campaign adventures!
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.createdAt)}
                        </div>
                        {post.updatedAt !== post.createdAt && (
                          <span>(Updated {formatDate(post.updatedAt)})</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700">
                      {post.content}
                    </div>
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
