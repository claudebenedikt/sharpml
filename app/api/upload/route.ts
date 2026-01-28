/**
 * Upload API Route
 * 
 * SECURITY:
 * - File type validation via magic bytes (not just extension)
 * - Size limits enforced
 * - Path sanitization to prevent traversal
 * - Files saved to isolated directory per project
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, stat } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { addJob } from "@/lib/queue";

// Configuration
const CONFIG = {
  maxFileSize: 20 * 1024 * 1024,      // 20MB per file
  maxTotalSize: 500 * 1024 * 1024,    // 500MB total
  maxFiles: 100,
  minFiles: 1,                         // ml-sharp works with single images
  dataDir: process.env.DATA_DIR || '/Users/clawd/sharpml-data',
};

/**
 * Validate file type by checking magic bytes
 */
function validateMagicBytes(buffer: Buffer): { valid: boolean; type: string } {
  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { valid: true, type: 'jpeg' };
  }
  
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return { valid: true, type: 'png' };
  }
  
  // HEIC/HEIF: Check for ftyp box
  if (buffer.length > 12) {
    const ftyp = buffer.slice(4, 8).toString('ascii');
    if (ftyp === 'ftyp') {
      const brand = buffer.slice(8, 12).toString('ascii');
      if (['heic', 'heix', 'hevc', 'mif1'].includes(brand)) {
        return { valid: true, type: 'heic' };
      }
    }
  }
  
  return { valid: false, type: 'unknown' };
}

/**
 * Sanitize filename to prevent path traversal
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[\/\\]/g, '')           // Remove path separators
    .replace(/\.\./g, '')             // Remove parent refs
    .replace(/[^\w\-\.]/g, '_')       // Replace special chars
    .slice(0, 100);                   // Limit length
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
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

    if (files.length < CONFIG.minFiles) {
      return NextResponse.json(
        { error: `Need at least ${CONFIG.minFiles} photo` },
        { status: 400 }
      );
    }

    if (files.length > CONFIG.maxFiles) {
      return NextResponse.json(
        { error: `Maximum ${CONFIG.maxFiles} photos allowed` },
        { status: 400 }
      );
    }

    // Generate unique job ID
    const jobId = randomUUID().slice(0, 8);
    const jobDir = join(CONFIG.dataDir, 'jobs', jobId);
    const inputDir = join(jobDir, 'input');
    
    // Create job directory
    await mkdir(inputDir, { recursive: true });

    // Process and validate each file
    let totalSize = 0;
    const savedFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check individual file size
      if (file.size > CONFIG.maxFileSize) {
        return NextResponse.json(
          { error: `File "${file.name}" is too large (max 20MB)` },
          { status: 400 }
        );
      }

      // Check total size
      totalSize += file.size;
      if (totalSize > CONFIG.maxTotalSize) {
        return NextResponse.json(
          { error: "Total upload size exceeds 500MB limit" },
          { status: 400 }
        );
      }

      // Read file buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Validate magic bytes
      const { valid, type } = validateMagicBytes(buffer);
      if (!valid) {
        return NextResponse.json(
          { error: `File "${file.name}" is not a valid image (JPEG, PNG, or HEIC required)` },
          { status: 400 }
        );
      }

      // Save with sanitized name
      const ext = type === 'jpeg' ? 'jpg' : type;
      const filename = `${String(i).padStart(4, '0')}_${sanitizeFilename(file.name.replace(/\.[^/.]+$/, ''))}.${ext}`;
      const filepath = join(inputDir, filename);
      
      await writeFile(filepath, buffer);
      savedFiles.push(filename);
    }

    // Add job to processing queue
    await addJob({
      id: jobId,
      name: projectName,
      inputDir,
      createdAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      jobId,
      projectName,
      filesUploaded: savedFiles.length,
      totalSize,
      status: "queued",
      statusUrl: `/api/status/${jobId}`,
      viewUrl: `/view/${jobId}`,
      message: "Your memory is being created!",
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

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
