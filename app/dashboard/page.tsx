"use client";

import { useState } from "react";
import Link from "next/link";

interface Memory {
  id: string;
  name: string;
  createdAt: string;
  views: number;
  status: "ready" | "processing" | "failed";
  category?: string;
}

// Mock data for demo
const mockMemories: Memory[] = [
  {
    id: "demo",
    name: "Dad's Workshop",
    createdAt: "Jan 27, 2026",
    views: 127,
    status: "ready",
    category: "Memorial",
  },
  {
    id: "vacation",
    name: "Hawaii Sunset",
    createdAt: "Jan 25, 2026",
    views: 89,
    status: "ready",
    category: "Travel",
  },
  {
    id: "processing",
    name: "Living Room",
    createdAt: "Jan 28, 2026",
    views: 0,
    status: "processing",
    category: "Home",
  },
];

export default function DashboardPage() {
  const [memories] = useState<Memory[]>(mockMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMemories = memories.filter((memory) =>
    memory.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyShareLink = (id: string) => {
    const url = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">SharpML</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
              Get More
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center cursor-pointer">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Your Memories</h1>
            <p className="text-gray-500 text-sm">{memories.length} memories created</p>
          </div>
          <Link href="/upload" className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Memory
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-900/50 border border-gray-800 focus:border-amber-500/50 focus:outline-none transition-colors text-sm placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Memories list */}
        {filteredMemories.length > 0 ? (
          <div className="space-y-3">
            {filteredMemories.map((memory) => (
              <div key={memory.id} className="card p-4 flex items-center gap-4 group hover:border-gray-700 transition-colors">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                  {memory.status === "processing" ? (
                    <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{memory.name}</h3>
                    {memory.status === "processing" && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs">
                        Processing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{memory.createdAt}</span>
                    {memory.category && (
                      <>
                        <span>·</span>
                        <span>{memory.category}</span>
                      </>
                    )}
                    {memory.status === "ready" && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {memory.views} views
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {memory.status === "ready" && (
                    <>
                      <Link
                        href={`/view/${memory.id}`}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        title="View"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => copyShareLink(memory.id)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors relative"
                        title="Copy share link"
                      >
                        {copiedId === memory.id ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No memories yet</h3>
            <p className="text-gray-500 mb-6 text-sm">Create your first memory to get started</p>
            <Link href="/upload" className="btn-primary">Create Your First Memory</Link>
          </div>
        )}

        {/* Quick stats */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{memories.filter(m => m.status === "ready").length}</p>
            <p className="text-gray-500 text-sm">Ready</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold">{memories.reduce((sum, m) => sum + m.views, 0)}</p>
            <p className="text-gray-500 text-sm">Total Views</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-green-500">∞</p>
            <p className="text-gray-500 text-sm">Storage Left</p>
          </div>
        </div>
      </main>
    </div>
  );
}
