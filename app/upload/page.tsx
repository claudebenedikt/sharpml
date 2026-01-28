"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UploadedFile {
  id: string;
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
  const [projectName, setProjectName] = useState("");

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
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));
    
    setFiles((prev) => [...prev, ...uploadedFiles]);
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
    if (files.length < 2) {
      alert("Please upload at least 2 photos for best results");
      return;
    }

    setIsProcessing(true);
    
    // Mock processing with progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setProcessProgress(i);
    }

    // Redirect to demo view after "processing"
    router.push("/view/demo");
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
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            My Splats →
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create a New Splat</h1>
          <p className="text-gray-400">Upload multiple photos of the same scene from different angles</p>
        </div>

        {/* Project name input */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="My Awesome Memory"
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`card p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-dashed hover:border-gray-600"
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
          
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <p className="text-lg font-medium mb-2">
            {isDragging ? "Drop your photos here" : "Drag & drop photos here"}
          </p>
          <p className="text-gray-400 text-sm mb-4">or click to browse</p>
          <p className="text-gray-500 text-xs">
            Supports JPG, PNG, HEIC • Min 3 photos recommended • Max 50MB per file
          </p>
        </div>

        {/* Uploaded files grid */}
        {files.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{files.length} Photos Selected</h2>
              <button
                onClick={() => setFiles([])}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
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
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 rounded-b-lg">
                    <p className="text-xs text-white truncate">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              ))}
              
              {/* Add more button */}
              <div
                onClick={() => document.getElementById("file-input")?.click()}
                className="aspect-square border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-600 transition-colors"
              >
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Process button */}
        {files.length > 0 && !isProcessing && (
          <div className="mt-8 text-center">
            <button onClick={handleProcess} className="btn-primary text-lg px-12 py-4">
              Create 3D Splat →
            </button>
            <p className="text-gray-500 text-sm mt-2">
              Processing typically takes 2-5 minutes
            </p>
          </div>
        )}

        {/* Processing state */}
        {isProcessing && (
          <div className="mt-8 card p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                style={{ animationDuration: "1s" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{processProgress}%</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Creating Your 3D Splat</h3>
            <p className="text-gray-400 mb-4">
              {processProgress < 30 && "Analyzing photos..."}
              {processProgress >= 30 && processProgress < 60 && "Reconstructing geometry..."}
              {processProgress >= 60 && processProgress < 90 && "Generating splats..."}
              {processProgress >= 90 && "Finalizing..."}
            </p>
            <div className="w-full max-w-md mx-auto h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${processProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-12 card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Tips for Best Results
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              Take photos from multiple angles (walk around the subject)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              Keep the subject centered in each photo
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              Use consistent lighting (avoid mixed indoor/outdoor)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">✗</span>
              Avoid blurry or motion-blurred images
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">✗</span>
              Avoid photos with moving objects in the scene
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
