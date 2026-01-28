# SharpML Processing Architecture

## Overview

SharpML converts user photos into 3D Gaussian splats using Apple's ml-sharp model.

**Key Constraint:** ml-sharp requires MPS (Metal Performance Shaders), which only works 
natively on macOS — not in Docker Linux containers.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Mac mini M4                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────────────────────┐ │
│  │  Next.js    │      │   Redis     │      │      Worker Process         │ │
│  │  Web App    │─────▶│   Queue     │─────▶│                             │ │
│  │  (port 3000)│      │ (port 6379) │      │  ┌─────────────────────┐   │ │
│  └─────────────┘      └─────────────┘      │  │  1. Validate Input  │   │ │
│        │                                    │  │  (magic bytes, size)│   │ │
│        │                                    │  └──────────┬──────────┘   │ │
│        ▼                                    │             │              │ │
│  ┌─────────────┐                           │  ┌──────────▼──────────┐   │ │
│  │  /uploads   │                           │  │  2. ml-sharp        │   │ │
│  │  (temp)     │◀──────────────────────────│  │  (native, MPS)      │   │ │
│  └─────────────┘                           │  │  predict → .ply     │   │ │
│                                            │  └──────────┬──────────┘   │ │
│  ┌─────────────┐                           │             │              │ │
│  │  /splats    │                           │  ┌──────────▼──────────┐   │ │
│  │  (output)   │◀──────────────────────────│  │  3. Convert         │   │ │
│  └─────────────┘                           │  │  .ply → .splat      │   │ │
│        │                                    │  └──────────┬──────────┘   │ │
│        ▼                                    │             │              │ │
│  ┌─────────────┐                           │  ┌──────────▼──────────┐   │ │
│  │  Web Viewer │                           │  │  4. Cleanup         │   │ │
│  │  (Three.js) │                           │  │  (temp files)       │   │ │
│  └─────────────┘                           │  └─────────────────────┘   │ │
│                                            └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Security Model

Since ml-sharp must run natively (for MPS), we use process-level isolation:

### 1. Input Validation (Before Processing)
- Magic byte verification (not just file extension)
- File size limits: 20MB/file, 500MB total
- Image dimension limits: 8000x8000 max
- Filename sanitization (prevent path traversal)
- EXIF stripping (privacy)

### 2. Process Isolation
- Separate OS user (`_sharpml`) with minimal permissions
- Processing runs under this user via `sudo -u _sharpml`
- Timeout enforcement (kill after 5 minutes per image)
- Resource limits via `ulimit` (memory, CPU time, file descriptors)

### 3. Filesystem Isolation
- Each job gets unique directory: `/data/jobs/{uuid}/`
- Worker only has access to job-specific directories
- Output directory is separate from input
- Temp files auto-deleted after processing

### 4. Output Validation
- Verify output is valid PLY/splat format
- Size limits on output files
- Scan for embedded scripts (paranoid mode)

## Directory Structure

```
/Users/clawd/sharpml-data/
├── jobs/                    # Temporary job directories
│   └── {uuid}/
│       ├── input/           # Uploaded images (validated)
│       ├── output/          # ml-sharp output (.ply)
│       └── final/           # Converted .splat
├── splats/                  # Final public splat files
│   └── {uuid}.splat
├── logs/                    # Processing logs
│   └── {uuid}.log
└── queue/                   # Redis persistence (optional)
```

## Processing Flow

### Step 1: Upload (Next.js API)
```
POST /api/upload
- Receive multipart form data
- Validate each file (magic bytes, size, dimensions)
- Generate job UUID
- Save to /data/jobs/{uuid}/input/
- Add job to Redis queue
- Return job ID to client
```

### Step 2: Queue (Redis + BullMQ)
```
Job data:
{
  id: "abc123",
  inputDir: "/data/jobs/abc123/input",
  outputDir: "/data/jobs/abc123/output", 
  status: "queued",
  createdAt: timestamp,
  userId: "user_xxx" (optional)
}
```

### Step 3: Process (Worker)
```
1. Pull job from queue
2. Validate input directory exists
3. Run ml-sharp:
   - cd /Users/clawd/clawd/ml-sharp
   - source .venv/bin/activate
   - timeout 300 sharp predict -i {inputDir} -o {outputDir}
4. Check for output .ply file
5. Convert .ply to .splat (for web viewer)
6. Move .splat to /data/splats/{uuid}.splat
7. Update job status to "complete"
8. Clean up temp directories
```

### Step 4: Delivery
```
GET /api/status/{id}
- Return job status, progress, and splat URL when complete

GET /splats/{uuid}.splat  
- Serve the final splat file (static)
```

## Error Handling

| Error | Action | User Message |
|-------|--------|--------------|
| Invalid file type | Reject immediately | "Please upload JPEG, PNG, or HEIC images" |
| File too large | Reject immediately | "Images must be under 20MB each" |
| Processing timeout | Kill process, mark failed | "Processing took too long. Try fewer images." |
| ml-sharp crash | Log error, mark failed | "Processing failed. Please try again." |
| Output missing | Mark failed | "Could not generate 3D model. Try different angles." |

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Upload validation | <1s | Pure I/O + validation |
| ml-sharp prediction | <5s/image | M4 with MPS |
| PLY → splat conversion | <2s | CPU-bound |
| Total time (10 images) | <60s | End-to-end |

## Monitoring

- Job queue depth (Redis)
- Processing time histogram
- Error rate by type
- Disk space usage
- Memory usage during processing

## Future Improvements

1. **Batch processing**: Process multiple jobs in parallel (M4 has headroom)
2. **Priority queue**: Paid users get faster processing
3. **Caching**: Skip processing for identical image sets (hash-based)
4. **Progressive delivery**: Return low-res splat quickly, high-res later
