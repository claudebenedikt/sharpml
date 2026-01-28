/**
 * Serve processed splat files
 * 
 * For local development: reads from local data directory
 * For production: should serve from cloud storage (TODO)
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join } from "path";

const DATA_DIR = process.env.DATA_DIR || '/Users/clawd/sharpml-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Sanitize ID to prevent path traversal
    const sanitizedId = id.replace(/[^a-zA-Z0-9-]/g, '');
    if (sanitizedId !== id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check for splat file in splats directory (where worker copies final output)
    const splatPath = join(DATA_DIR, 'splats', `${sanitizedId}.splat`);
    
    try {
      await stat(splatPath);
    } catch {
      // File doesn't exist - job might still be processing
      return NextResponse.json(
        { error: "Splat not ready or not found" }, 
        { status: 404 }
      );
    }

    // Read and serve the file
    const fileBuffer = await readFile(splatPath);
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `inline; filename="${sanitizedId}.splat"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error("Error serving splat:", error);
    return NextResponse.json(
      { error: "Failed to load splat" },
      { status: 500 }
    );
  }
}
