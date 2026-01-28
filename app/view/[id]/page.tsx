"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// Dynamic import to avoid SSR issues with Three.js
const SplatViewer = dynamic(() => import("@/components/SplatViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading memory...</p>
      </div>
    </div>
  ),
});

// Demo data
const demoMemories: Record<string, { name: string; author: string; date: string; description: string; category: string }> = {
  demo: {
    name: "Dad's Workshop",
    author: "Sarah M.",
    date: "January 2026",
    description: "The workshop where he spent countless hours building and fixing things. Every tool exactly where he left it.",
    category: "Memorial",
  },
};

export default function ViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const memory = demoMemories[id] || {
    name: "A Captured Moment",
    author: "Someone",
    date: "Unknown",
    description: "A place preserved in time.",
    category: "Memory",
  };

  const splatUrl = "/splats/demo.splat";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    const viewer = document.getElementById("viewer-container");
    if (!viewer) return;
    
    if (!document.fullscreenElement) {
      viewer.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Top bar - minimal */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between pointer-events-none">
        <Link 
          href="/" 
          className="flex items-center gap-2 pointer-events-auto opacity-70 hover:opacity-100 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="text-white font-semibold text-sm">SharpML</span>
        </Link>
        
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors opacity-70 hover:opacity-100"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              )}
            </svg>
          </button>
          <button
            onClick={() => setShowShare(true)}
            className="p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors opacity-70 hover:opacity-100"
            title="Share"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Viewer - full screen */}
      <div id="viewer-container" className="fixed inset-0">
        <SplatViewer
          splatUrl={splatUrl}
          className="w-full h-full"
          autoRotate={false}
          showControls={true}
        />
      </div>

      {/* Bottom info bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
        <div className="max-w-2xl mx-auto">
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/5 pointer-events-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                    {memory.category}
                  </span>
                </div>
                <h1 className="text-lg font-semibold text-white mb-1">{memory.name}</h1>
                <p className="text-gray-400 text-sm line-clamp-2">{memory.description}</p>
                <p className="text-gray-500 text-xs mt-2">
                  Created by {memory.author} · {memory.date}
                </p>
              </div>
              <Link 
                href="/upload" 
                className="shrink-0 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 transition-colors text-black font-medium text-sm"
              >
                Create Yours
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-gray-400 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Drag to rotate
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
            Scroll to zoom
          </span>
        </div>
      </div>

      {/* Share modal */}
      {showShare && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowShare(false)}>
          <div className="bg-gray-900 rounded-xl p-5 max-w-sm w-full border border-gray-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Share This Memory</h3>
              <button
                onClick={() => setShowShare(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">
              Anyone with this link can view this memory.
            </p>
            
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300"
              />
              <button
                onClick={copyLink}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-amber-500 hover:bg-amber-400 text-black'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
