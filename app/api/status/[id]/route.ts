/**
 * Job Status API Route
 * 
 * Returns the current status of a processing job.
 * In production, this would query the job queue (BullMQ/Redis).
 */

import { NextRequest, NextResponse } from "next/server";

// Mock job statuses for demo
const mockJobs: Record<string, {
  status: 'queued' | 'processing' | 'complete' | 'failed';
  progress: number;
  stage?: string;
  splatUrl?: string;
  error?: string;
  createdAt: string;
}> = {
  demo: {
    status: 'complete',
    progress: 100,
    splatUrl: '/splats/demo.splat',
    createdAt: '2026-01-27T12:00:00Z',
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate ID format (UUID-like)
  if (!/^[a-zA-Z0-9\-]{1,36}$/.test(id)) {
    return NextResponse.json(
      { error: "Invalid job ID" },
      { status: 400 }
    );
  }

  // TODO: Query actual job status from BullMQ
  // const job = await processingQueue.getJob(id);
  
  // For demo, return mock data or simulated progress
  const job = mockJobs[id];
  
  if (job) {
    return NextResponse.json({
      id,
      ...job,
    });
  }

  // Simulate a job in progress
  // In production, this would return actual job status
  const createdTime = Date.now() - 60000; // Assume created 1 minute ago
  const elapsed = Date.now() - createdTime;
  const estimatedTotal = 300000; // 5 minutes
  const progress = Math.min(95, Math.floor((elapsed / estimatedTotal) * 100));

  return NextResponse.json({
    id,
    status: progress < 95 ? 'processing' : 'complete',
    progress,
    stage: progress < 30 ? 'Analyzing images...' :
           progress < 60 ? 'Building 3D structure...' :
           progress < 90 ? 'Refining details...' :
           'Finalizing...',
    createdAt: new Date(createdTime).toISOString(),
    splatUrl: progress >= 95 ? `/splats/demo.splat` : undefined,
  });
}
