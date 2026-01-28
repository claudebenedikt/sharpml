import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const projectName = formData.get("projectName") as string || "Untitled Memory";

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    // Create a unique project ID
    const projectId = randomUUID().slice(0, 8);
    
    // Create directory for this project
    const projectDir = join(process.cwd(), "public", "uploads", projectId);
    await mkdir(projectDir, { recursive: true });

    // Save all uploaded files
    const savedFiles = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const filepath = join(projectDir, filename);
      await writeFile(filepath, buffer);
      savedFiles.push(filename);
    }

    // In a real app, you would:
    // 1. Queue a processing job (e.g., to a GPU server)
    // 2. Return the project ID for status polling
    // 3. Process the images into a .splat file
    // 4. Store the result and notify the user

    // For now, we return success with a demo splat
    return NextResponse.json({
      success: true,
      projectId,
      projectName,
      filesUploaded: savedFiles.length,
      // In production: status: "processing"
      // For demo: immediately ready with demo splat
      status: "ready",
      viewUrl: `/view/${projectId}`,
      message: "Your memory is being created! (Demo mode: using sample 3D scene)"
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
