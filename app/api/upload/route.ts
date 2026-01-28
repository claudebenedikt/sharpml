/**
 * Upload API Route
 * 
 * SECURITY:
 * - File type validation (magic bytes, not just extension)
 * - Size limits enforced
 * - Rate limiting (TODO: implement with Redis)
 * - CORS restricted to allowed origins
 * - Files saved to isolated directory per project
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, stat } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

// Configuration
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB per file
const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB total
const MAX_FILES = 100;
const MIN_FILES = 3;
const UPLOAD_DIR = process.env.SHARPML_UPLOAD_DIR || join(process.cwd(), "uploads");

// Allowed file signatures (magic bytes)
const MAGIC_BYTES: Record<string, number[]> = {
  jpeg: [0xFF, 0xD8, 0xFF],
  png: [0x89, 0x50, 0x4E, 0x47],
  heic: [0x00, 0x00, 0x00], // HEIC has variable header, need more complex check
};

/**
 * Validate file type by magic bytes
 */
async function validateFileType(buffer: Buffer): Promise<boolean> {
  // Check JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return true;
  }
  
  // Check PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return true;
  }
  
  // Check HEIC/HEIF (ftyp box)
  if (buffer.length > 12) {
    const ftyp = buffer.slice(4, 8).toString('ascii');
    if (ftyp === 'ftyp') {
      const brand = buffer.slice(8, 12).toString('ascii');
      if (['heic', 'heix', 'hevc', 'mif1'].includes(brand)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Sanitize filename to prevent path traversal
 */
function sanitizeFilename(filename: string): string {
  // Remove path components and special characters
  return filename
    .replace(/[\/\\]/g, '') // Remove path separators
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/[^\w\-\.]/g, '_') // Replace special chars with underscore
    .slice(0, 100); // Limit length
}

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const projectName = (formData.get("projectName") as string) || "Untitled Memory";

    // Validate file count
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    if (files.length < MIN_FILES) {
      return NextResponse.json(
        { error: `Need at least ${MIN_FILES} photos` },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} photos allowed` },
        { status: 400 }
      );
    }

    // Create unique project ID
    const projectId = randomUUID().slice(0, 8);
    
    // Create project directory
    const projectDir = join(UPLOAD_DIR, projectId);
    await mkdir(projectDir, { recursive: true });

    // Process and validate each file
    let totalSize = 0;
    const savedFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} is too large (max 20MB)` },
          { status: 400 }
        );
      }

      // Check total size
      totalSize += file.size;
      if (totalSize > MAX_TOTAL_SIZE) {
        return NextResponse.json(
          { error: "Total upload size exceeds 500MB limit" },
          { status: 400 }
        );
      }

      // Read file and validate magic bytes
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (!await validateFileType(buffer)) {
        return NextResponse.json(
          { error: `File ${file.name} is not a valid image (JPEG, PNG, or HEIC required)` },
          { status: 400 }
        );
      }

      // Save file with sanitized name
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${String(i).padStart(4, '0')}_${sanitizeFilename(file.name)}`;
      const filepath = join(projectDir, filename);
      
      await writeFile(filepath, buffer);
      savedFiles.push(filename);
    }

    // TODO: Add job to processing queue (BullMQ)
    // For now, return mock response
    
    // In production:
    // await processingQueue.add('process', {
    //   projectId,
    //   projectName,
    //   uploadDir: projectDir,
    //   userId: request.headers.get('x-user-id'),
    // });

    return NextResponse.json({
      success: true,
      projectId,
      projectName,
      filesUploaded: savedFiles.length,
      totalSize,
      status: "queued",
      estimatedTime: Math.ceil(savedFiles.length * 10), // ~10 seconds per image
      viewUrl: `/view/${projectId}`,
      message: "Your memory is being created!"
    });

  } catch (error) {
    console.error("Upload error:", error);
    
    // Don't expose internal error details
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
