"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

interface SplatViewerProps {
  splatUrl: string;
  className?: string;
  autoRotate?: boolean;
  showControls?: boolean;
}

export default function SplatViewer({
  splatUrl,
  className = "",
  autoRotate = false,
  showControls = true,
}: SplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<GaussianSplats3D.Viewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Create viewer with tasteful constraints
    const viewer = new GaussianSplats3D.Viewer({
      cameraUp: [0, -1, 0],
      initialCameraPosition: [0, 0, 8],
      initialCameraLookAt: [0, 0, 0],
      sharedMemoryForWorkers: false,
      dynamicScene: false,
      // Prevent zoom that breaks the illusion
      useBuiltInControls: true,
      rootElement: container,
    });

    viewerRef.current = viewer;

    // Configure orbit controls with constraints
    const setupControls = () => {
      const controls = viewer.controls;
      if (controls) {
        // CRITICAL: Zoom limits to prevent breaking the illusion
        controls.minDistance = 2.0;  // Can't get too close
        controls.maxDistance = 20.0; // Can't go too far
        
        // Smooth, premium feel
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        // Limit vertical rotation to prevent disorientation
        controls.minPolarAngle = Math.PI * 0.1;
        controls.maxPolarAngle = Math.PI * 0.9;
        
        // Auto-rotate if enabled
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.5;
        
        // Pan limits
        controls.enablePan = true;
        controls.panSpeed = 0.5;
      }
    };

    // Load the splat file
    viewer
      .addSplatScene(splatUrl, {
        splatAlphaRemovalThreshold: 5,
        showLoadingUI: false,
        progressiveLoad: true,
        onProgress: (progress: number) => {
          setLoadProgress(Math.round(progress * 100));
        },
      })
      .then(() => {
        setIsLoading(false);
        setupControls();
        viewer.start();
      })
      .catch((err: Error) => {
        console.error("Failed to load splat:", err);
        setError("Failed to load 3D scene");
        setIsLoading(false);
      });

    // Cleanup
    return () => {
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }
    };
  }, [splatUrl, autoRotate]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Reset view
  const resetView = () => {
    const controls = viewerRef.current?.controls;
    if (controls) {
      controls.reset();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-900 rounded-xl overflow-hidden ${className}`}
      style={{ minHeight: "400px" }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
          <div className="w-16 h-16 mb-4 relative">
            <div className="absolute inset-0 rounded-full border-2 border-gray-700"></div>
            <div
              className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"
              style={{ animationDuration: "1s" }}
            ></div>
          </div>
          <p className="text-gray-400 mb-2">Loading 3D Scene...</p>
          <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{loadProgress}%</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
          <div className="w-16 h-16 mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Controls overlay */}
      {showControls && !isLoading && !error && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
          <button
            onClick={resetView}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
            title="Reset View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Instructions overlay */}
      {!isLoading && !error && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-500 z-20">
          <p>Drag to rotate • Scroll to zoom • Shift+drag to pan</p>
        </div>
      )}
    </div>
  );
}
