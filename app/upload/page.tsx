"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStage, setProcessStage] = useState("");
  const [memoryName, setMemoryName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/")
    );
    
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type.startsWith("image/")
      );
      addFiles(selectedFiles);
    }
  }, []);

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));
    
    setFiles((prev) => [...prev, ...uploadedFiles]);
    setError(null);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleProcess = async () => {
    if (files.length < 1) {
      setError("Please upload at least 1 photo");
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Upload files
    setProcessStage("Uploading your photos...");
    setProcessProgress(10);

    const formData = new FormData();
    formData.append("projectName", memoryName || "My Memory");
    files.forEach((f) => {
      formData.append("files", f.file);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      
      // Simulate processing stages
      setProcessProgress(30);
      setProcessStage("Analyzing your photos...");
      await new Promise((r) => setTimeout(r, 1500));
      
      setProcessProgress(50);
      setProcessStage("Finding common points...");
      await new Promise((r) => setTimeout(r, 1500));
      
      setProcessProgress(70);
      setProcessStage("Building 3D structure...");
      await new Promise((r) => setTimeout(r, 1500));
      
      setProcessProgress(90);
      setProcessStage("Adding finishing touches...");
      await new Promise((r) => setTimeout(r, 1000));
      
      setProcessProgress(100);
      setProcessStage("Your memory is ready!");
      await new Promise((r) => setTimeout(r, 500));

      // Redirect to view page
      router.push(result.viewUrl || "/view/demo");

    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsProcessing(false);
      setProcessProgress(0);
    }
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
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
            My Memories →
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {!isProcessing ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-3">Create a Memory</h1>
              <p className="text-gray-400">
                Upload photos of a place or moment you want to preserve. 
                Walk around and capture it from different angles.
              </p>
            </div>

            {/* Memory name input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Name this memory <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="text"
                value={memoryName}
                onChange={(e) => setMemoryName(e.target.value)}
                placeholder="e.g., Grandma's Kitchen, Our Wedding Venue..."
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-800 focus:border-amber-500/50 focus:outline-none transition-colors placeholder:text-gray-600"
              />
            </div>

            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`card p-10 text-center cursor-pointer transition-all border-dashed ${
                isDragging
                  ? "border-amber-500 bg-amber-500/5"
                  : "hover:border-gray-700"
              }`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="w-14 h-14 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <p className="text-lg font-medium mb-1">
                {isDragging ? "Drop your photos" : "Drop photos here"}
              </p>
              <p className="text-gray-500 text-sm mb-3">or click to browse</p>
              <p className="text-gray-600 text-xs">
                JPG, PNG, HEIC • 15-50 photos recommended
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Uploaded files grid */}
            {files.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-400">{files.length} photos selected</p>
                  <button
                    onClick={() => setFiles([])}
                    className="text-sm text-gray-500 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {files.map((file) => (
                    <div key={file.id} className="relative group aspect-square">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {/* Add more button */}
                  <div
                    onClick={() => document.getElementById("file-input")?.click()}
                    className="aspect-square border border-dashed border-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Process button */}
            {files.length > 0 && (
              <div className="mt-8 text-center">
                <button 
                  onClick={handleProcess} 
                  className="btn-primary text-lg px-10 py-4"
                  disabled={files.length < 1}
                >
                  Create Memory →
                </button>
                {files.length >= 1 && files.length < 15 && (
                  <p className="text-gray-500 text-sm mt-2">
                    Tip: More photos from different angles gives better results
                  </p>
                )}
              </div>
            )}

            {/* Tips */}
            <div className="mt-10 card p-5 bg-gray-900/30">
              <h3 className="font-medium mb-3 text-sm text-gray-300">Tips for great results</h3>
              <ul className="text-gray-500 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Walk slowly around the space, taking a photo every few steps
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Cover all angles — corners, floors, ceilings if relevant
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Keep lighting consistent (all indoor or all outdoor)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 mt-0.5">•</span>
                  <span className="text-gray-600">Avoid blurry photos or moving objects</span>
                </li>
              </ul>
            </div>
          </>
        ) : (
          /* Processing state */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-2 border-gray-800"></div>
              <div
                className="absolute inset-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"
                style={{ animationDuration: "1.5s" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-amber-500">{processProgress}%</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Creating Your Memory</h2>
            <p className="text-gray-400 mb-6">{processStage}</p>
            
            <div className="w-full max-w-sm mx-auto h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
                style={{ width: `${processProgress}%` }}
              ></div>
            </div>
            
            <p className="text-gray-600 text-sm mt-8">
              This usually takes 2-5 minutes. You can close this tab — we'll email you when it's ready.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
