/**
 * Job Status API Route
 * 
 * Returns real-time status of processing jobs from Redis queue.
 */

import { NextRequest, NextResponse } from "next/server";
import { getJobStatus } from "@/lib/queue";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate ID format (alphanumeric, max 36 chars)
  if (!/^[a-zA-Z0-9\-]{1,36}$/.test(id)) {
    return NextResponse.json(
      { error: "Invalid job ID" },
      { status: 400 }
    );
  }

  try {
    const jobStatus = await getJobStatus(id);
    
    if (jobStatus.status === 'not_found') {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Map internal status to user-friendly response
    const response: Record<string, unknown> = {
      id,
      status: jobStatus.status,
      progress: jobStatus.progress || 0,
    };

    // Add stage description based on progress
    if (jobStatus.status === 'processing') {
      const progress = jobStatus.progress || 0;
      if (progress < 15) {
        response.stage = 'Validating images...';
      } else if (progress < 70) {
        response.stage = 'Generating 3D structure...';
      } else if (progress < 90) {
        response.stage = 'Finalizing...';
      } else {
        response.stage = 'Almost done...';
      }
    }

    if (jobStatus.status === 'complete' && jobStatus.result) {
      response.splatUrl = jobStatus.result.splatUrl;
      response.processedImages = jobStatus.result.processedImages;
      response.viewUrl = `/view/${id}`;
    }

    if (jobStatus.status === 'failed') {
      // Sanitize error message for user
      response.error = 'Processing failed. Please try again with different images.';
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Status API error:', error);
    
    return NextResponse.json(
      { error: "Failed to get job status" },
      { status: 500 }
    );
  }
}
