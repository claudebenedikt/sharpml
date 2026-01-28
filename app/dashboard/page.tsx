"use client";

import { useState } from "react";
import Link from "next/link";

interface Splat {
  id: string;
  name: string;
  createdAt: string;
  thumbnail: string;
  views: number;
  status: "ready" | "processing" | "failed";
}

// Mock data for demo
const mockSplats: Splat[] = [
  {
    id: "demo",
    name: "Garden Scene",
    createdAt: "2025-01-27",
    thumbnail: "/api/placeholder/400/300",
    views: 127,
    status: "ready",
  },
  {
    id: "vacation",
    name: "Beach Sunset",
    createdAt: "2025-01-25",
    thumbnail: "/api/placeholder/400/300",
    views: 89,
    status: "ready",
  },
  {
    id: "processing",
    name: "Living Room",
    createdAt: "2025-01-27",
    thumbnail: "/api/placeholder/400/300",
    views: 0,
    status: "processing",
  },
];

export default function DashboardPage() {
  const [splats] = useState<Splat[]>(mockSplats);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSplats = splats.filter((splat) =>
    splat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyShareLink = (id: string) => {
    const url = `${window.location.origin}/view/${id}`;
    navigator.clipboard.writeText(url);
    alert("Share link copied to clipboard!");
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">SharpML</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
              Upgrade
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Splats</h1>
            <p className="text-gray-400">{splats.length} projects • Free plan (3/3 used this month)</p>
          </div>
          <Link href="/upload" className="btn-primary">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Splat
            </span>
          </Link>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search splats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          <select className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors">
            <option>All Status</option>
            <option>Ready</option>
            <option>Processing</option>
          </select>
          <select className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Most Viewed</option>
          </select>
        </div>

        {/* Splats grid */}
        {filteredSplats.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSplats.map((splat) => (
              <div key={splat.id} className="card overflow-hidden group">
                {/* Thumbnail */}
                <div className="aspect-video relative bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Status badge */}
                  {splat.status === "processing" && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                      Processing
                    </div>
                  )}
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link
                      href={`/view/${splat.id}`}
                      className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      title="View"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => copyShareLink(splat.id)}
                      className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      title="Share"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{splat.name}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{splat.createdAt}</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {splat.views}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No splats yet</h3>
            <p className="text-gray-400 mb-6">Create your first 3D memory!</p>
            <Link href="/upload" className="btn-primary">Create Your First Splat</Link>
          </div>
        )}

        {/* Usage stats */}
        <div className="mt-12 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Monthly Usage</h3>
            <Link href="/pricing" className="text-blue-400 hover:text-blue-300 text-sm">Upgrade for more →</Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Splats Created</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">3</span>
                <span className="text-gray-500 text-sm mb-1">/ 3</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-full"></div>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Storage Used</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">245</span>
                <span className="text-gray-500 text-sm mb-1">MB / 500 MB</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[49%]"></div>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Views</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">216</span>
                <span className="text-gray-500 text-sm mb-1">this month</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-green-500 w-[72%]"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
