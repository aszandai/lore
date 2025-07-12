"use client";

import type { BlogPost } from "./BlogLandingPage";

export default function BlogPostDetailPage({
  post,
  onBack,
}: {
  post: BlogPost;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{post.title}</h1>
        <p className="text-slate-600 mb-2">{post.content}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-slate-200 rounded px-2 py-1 text-xs">
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-slate-300 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}
