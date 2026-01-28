/**
 * Job Queue Client
 * 
 * Connects to Redis and provides methods to add/query jobs.
 */

import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const QUEUE_NAME = 'sharpml-processing';

// Lazy connection - only connect when needed
let connection: IORedis | null = null;
let queue: Queue | null = null;

function getConnection(): IORedis {
  if (!connection) {
    connection = new IORedis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null,
    });
  }
  return connection;
}

function getQueue(): Queue {
  if (!queue) {
    queue = new Queue(QUEUE_NAME, {
      connection: getConnection(),
    });
  }
  return queue;
}

export interface JobData {
  id: string;
  name: string;
  inputDir: string;
  userId?: string;
  createdAt: number;
}

export interface JobResult {
  success: boolean;
  splatUrl?: string;
  processedImages?: number;
  error?: string;
}

/**
 * Add a new processing job to the queue
 */
export async function addJob(data: JobData): Promise<string> {
  const q = getQueue();
  const job = await q.add('process', data, {
    jobId: data.id,
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
      count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
      age: 86400, // Keep failed jobs for 24 hours
    },
  });
  return job.id || data.id;
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string): Promise<{
  status: 'queued' | 'processing' | 'complete' | 'failed' | 'not_found';
  progress?: number;
  result?: JobResult;
  error?: string;
}> {
  const q = getQueue();
  const job = await q.getJob(jobId);
  
  if (!job) {
    return { status: 'not_found' };
  }

  const state = await job.getState();
  const progress = job.progress as number || 0;

  switch (state) {
    case 'completed':
      return { 
        status: 'complete', 
        progress: 100, 
        result: job.returnvalue as JobResult 
      };
    case 'failed':
      return { 
        status: 'failed', 
        progress, 
        error: job.failedReason || 'Unknown error' 
      };
    case 'active':
      return { status: 'processing', progress };
    case 'waiting':
    case 'delayed':
      return { status: 'queued', progress: 0 };
    default:
      return { status: 'queued', progress: 0 };
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats() {
  const q = getQueue();
  const [waiting, active, completed, failed] = await Promise.all([
    q.getWaitingCount(),
    q.getActiveCount(),
    q.getCompletedCount(),
    q.getFailedCount(),
  ]);
  return { waiting, active, completed, failed };
}
