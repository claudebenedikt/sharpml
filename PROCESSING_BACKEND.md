# SharpML Processing Backend

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                     Mac mini M4 (Processing Server)              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   Upload API    │───▶│  Job Queue      │───▶│  Processor   │ │
│  │  (Next.js API)  │    │  (BullMQ/Redis) │    │  (Worker)    │ │
│  └─────────────────┘    └─────────────────┘    └──────┬───────┘ │
│          │                                            │         │
│          │                                            ▼         │
│          │                                   ┌────────────────┐ │
│          │                                   │    COLMAP      │ │
│          │                                   │ (SfM Pipeline) │ │
│          │                                   └───────┬────────┘ │
│          │                                           │          │
│          ▼                                           ▼          │
│  ┌─────────────────┐                     ┌───────────────────┐  │
│  │  /uploads/{id}  │                     │   Cloud GPU API   │  │
│  │  (temp storage) │                     │   (for training)  │  │
│  └─────────────────┘                     └───────────────────┘  │
│                                                     │           │
│                                                     ▼           │
│                                          ┌───────────────────┐  │
│                                          │  /splats/{id}.splat │
│                                          │  (output storage) │  │
│                                          └───────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Security Measures

### 1. Input Validation
- **File type whitelist**: Only accept JPEG, PNG, HEIC
- **File size limits**: Max 20MB per image, 500MB total per job
- **Image count limits**: 5-100 images per job
- **Magic byte verification**: Verify file signatures, not just extensions
- **Dimension limits**: Reject images over 8000x8000px
- **EXIF stripping**: Remove all metadata before processing

### 2. Sandboxed Processing
- **Separate user**: Processing runs under `_sharpml` user (no shell, limited permissions)
- **chroot jail**: COLMAP runs in isolated filesystem
- **Resource limits**: cgroups for CPU/memory/disk quotas
- **Timeout**: Kill jobs that exceed 30 minutes
- **No network**: Processing containers have no outbound network access

### 3. API Security
- **Rate limiting**: 10 uploads/hour per IP, 50/day per account
- **Authentication**: JWT tokens for authenticated requests
- **CORS**: Only allow requests from sharpml.com
- **Upload validation**: Reject malformed multipart requests
- **No directory traversal**: Sanitize all file paths

### 4. Storage Security
- **Temporary files**: Auto-deleted after 24 hours
- **Isolated directories**: Each job gets UUID-based directory
- **No symlinks**: Reject symlink creation in upload directories
- **Encryption at rest**: FileVault on Mac mini

### 5. Output Security
- **Content-Type enforcement**: Serve .splat files with correct MIME type
- **Signed URLs**: Time-limited access tokens for downloads
- **No indexing**: Uploaded/output directories not web-accessible directly

## Processing Pipeline

### Phase 1: Upload & Validation
```
1. Receive multipart upload
2. Validate JWT token (or check free tier quota)
3. Create job directory: /data/jobs/{uuid}/
4. For each file:
   - Verify magic bytes match extension
   - Check dimensions and file size
   - Strip EXIF data
   - Save to /data/jobs/{uuid}/images/
5. Create job record in database
6. Add job to processing queue
7. Return job ID to client
```

### Phase 2: Structure from Motion (COLMAP)
```
1. Worker picks up job from queue
2. Switch to sandboxed user/environment
3. Run COLMAP:
   - Feature extraction
   - Feature matching
   - Sparse reconstruction
   - Dense reconstruction (optional)
4. Validate output (camera poses, point cloud)
5. Update job status: "sfm_complete"
```

### Phase 3: Gaussian Splatting Training
**Option A: Cloud GPU (Recommended for now)**
```
1. Package COLMAP output (cameras.bin, points3D.bin, images)
2. Upload to cloud GPU service (RunPod/Modal/Replicate)
3. Run Gaussian splatting training
4. Download resulting .splat file
5. Store in /data/splats/{uuid}.splat
```

**Option B: Local Metal-based (Future)**
```
1. Use Metal-accelerated gsplat (when available)
2. Run training locally on M4 GPU
3. Lower quality but no external dependency
```

### Phase 4: Delivery
```
1. Update job status: "complete"
2. Generate signed URL for .splat file
3. Send notification (email/webhook)
4. Clean up temporary files after 24h
```

## Installation Steps

### Prerequisites
```bash
# Install Homebrew dependencies
brew install cmake eigen boost freeimage glog gflags ceres-solver qt@5 glew cgal

# Install COLMAP
brew install colmap

# Install Redis for job queue
brew install redis
brew services start redis

# Create processing user
sudo dscl . -create /Users/_sharpml
sudo dscl . -create /Users/_sharpml UserShell /usr/bin/false
sudo dscl . -create /Users/_sharpml UniqueID 505
sudo dscl . -create /Users/_sharpml PrimaryGroupID 20
```

### Directory Structure
```
/Users/clawd/sharpml-data/
├── jobs/           # Temporary job directories
│   └── {uuid}/
│       ├── images/
│       ├── colmap/
│       └── output/
├── splats/         # Final .splat files
│   └── {uuid}.splat
└── logs/           # Processing logs
```

### Environment Variables
```bash
# .env.local
SHARPML_DATA_DIR=/Users/clawd/sharpml-data
SHARPML_MAX_UPLOAD_MB=500
SHARPML_MAX_IMAGES=100
SHARPML_JOB_TIMEOUT_MS=1800000
REDIS_URL=redis://localhost:6379

# Cloud GPU (when needed)
RUNPOD_API_KEY=xxx
REPLICATE_API_TOKEN=xxx
```

## Cloud GPU Options

| Service | Cost | Latency | Notes |
|---------|------|---------|-------|
| **RunPod** | ~$0.50/job | 5-10 min | Serverless GPU, A100 available |
| **Modal** | ~$0.30/job | 3-5 min | Python-native, good DX |
| **Replicate** | ~$0.40/job | 5-15 min | Simple API, pre-built models |
| **Vast.ai** | ~$0.20/job | 10-20 min | Cheapest, less reliable |

**Recommended**: Start with Replicate (simplest API), migrate to RunPod for volume.

## Monitoring & Alerts

- **Job failures**: Alert if >10% of jobs fail
- **Queue depth**: Alert if queue > 50 jobs
- **Processing time**: Alert if avg > 15 minutes
- **Disk space**: Alert if < 50GB free
- **Memory usage**: Alert if > 12GB used

## Backup & Recovery

- **Database**: Daily backups of job metadata
- **Splats**: S3 backup after 24 hours
- **Logs**: 30-day retention

## Cost Estimation

| Volume | Cloud GPU Cost | Storage | Total/mo |
|--------|---------------|---------|----------|
| 100/mo | $40 | $5 | ~$45 |
| 500/mo | $200 | $15 | ~$215 |
| 2000/mo | $700 | $50 | ~$750 |

At $5/memory, break-even is ~10 memories/month with cloud GPU.

---

## Next Steps

1. [ ] Install COLMAP on Mac mini
2. [ ] Set up Redis and job queue
3. [ ] Create sandboxed processing user
4. [ ] Build worker process
5. [ ] Integrate cloud GPU API (Replicate)
6. [ ] Add monitoring/alerting
7. [ ] Security audit
