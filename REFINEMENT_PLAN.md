# SharpML Refinement Plan

**Date:** 2026-01-28
**Goal:** Make SharpML actually useful and relevant as a microsaas

---

## Current State Analysis

### What Exists
- Next.js landing page with polished dark theme
- Basic page structure: landing, upload, dashboard, view, pricing, login
- Technical focus: "Gaussian splats", "AI processing", "3D reconstruction"
- Generic SaaS pricing ($0/12/39)

### Problems
1. **Too technical** — "Gaussian splats" means nothing to consumers
2. **No emotional hook** — selling features, not feelings
3. **No differentiation** — looks like every other AI tool landing page
4. **No real backend** — just placeholders
5. **Unclear use case** — who is this actually for?

---

## Competitive Landscape

### Direct Competitors
| Product | Focus | Pricing | Insight |
|---------|-------|---------|---------|
| **Luma AI** | Pivoted to AI video generation | Free tier + API | They abandoned consumer 3D capture |
| **Polycam** | B2B professionals (real estate, construction) | $12-70/mo | Enterprise focus, not memories |
| **Immersity (LeiaPixel)** | Hardware + depth video | B2B | Selling to OEMs, not consumers |

### Gap in Market
Nobody is doing **emotional, consumer-focused 3D memories** well. The tech players went B2B. There's an opportunity for a premium consumer product focused on **meaningful moments**, not technical features.

---

## Positioning Pivot

### From
> "Transform Photos into 3D Memories using Gaussian Splatting"

### To
> "Freeze Time. Walk Through Your Memories."

### New Tagline Options
- "Step back into your favorite moments"
- "Your memories, alive again"
- "More than a photo. A moment you can revisit."
- "The photo album that lets you step inside"

### Target Emotional Moments
1. **Weddings** — First dance, ceremony, venue
2. **Babies/Kids** — First steps, birthdays, milestones
3. **Memorials** — Departed loved ones, final visits
4. **Travel** — "That sunset in Santorini"
5. **Homes** — Before you move, childhood home

### Why This Works
- Photos feel flat → 3D feels alive
- Videos are passive → 3D is interactive (YOU control perspective)
- Physical presence matters → This recreates spatial memory
- Grief market is underserved → People pay for connection to the departed

---

## Feature Refinement

### Remove
- ❌ Technical jargon ("Gaussian splats", "neural network")
- ❌ Generic "AI" language
- ❌ Business/team tier (focus on consumer first)

### Add
- ✅ "Memory types" (Wedding, Baby, Memorial, Travel, Home)
- ✅ Guided capture instructions ("walk slowly around the scene")
- ✅ "Memory Frame" — physical display device integration (future)
- ✅ Gift cards / gifting flow ("Give the gift of a memory")
- ✅ Background music/ambient audio option
- ✅ Date/caption overlay in viewer

### Refine
- 🔄 "Splat" → "Memory" or "Moment"
- 🔄 "Processing" → "Bringing to life"
- 🔄 "Upload" → "Capture" (even if still uploading)
- 🔄 Pricing → Simple: Free (1 memory) / Premium ($9/mo unlimited)

---

## Revenue Model Analysis

### Current (Generic SaaS)
- Free: 3 splats/month
- Pro: $12/mo unlimited
- Team: $39/mo

### Proposed (Emotional Value)
**Option A: Per-Memory Pricing**
- Free: 1 memory (forever, as hook)
- Single Memory: $4.99 (one-time)
- Memory Pack: $19.99 (5 memories)
- Unlimited: $9.99/mo

**Option B: Occasion-Based**
- Wedding Package: $49 (10 memories + premium viewer + sharing)
- Baby's First Year: $29 (12 memories, one per month)
- Memorial: $19 (1 memory + forever hosting + private sharing)

**Option C: Freemium + Premium Viewer**
- Free: Unlimited memories (watermarked, 7-day hosting)
- Premium: $5.99/mo (no watermark, forever hosting, custom domains)

### Recommendation
Start with **Option A** — simple, aligns with emotional purchase moments (people buy when they have a special photo, not monthly).

---

## Landing Page Rewrite

### Hero Section
**Before:**
> "Transform Photos into 3D Memories"
> "Upload your photos and watch them come alive as stunning, interactive 3D Gaussian splats."

**After:**
> "Step Back Into Your Favorite Moments"
> "Turn your photos into living memories you can walk through. No VR headset needed."

### How It Works (Simplified)
1. **Choose your moment** — Upload 10-30 photos of something you want to remember
2. **We bring it to life** — Our technology reconstructs the scene in 3D
3. **Revisit anytime** — Walk through your memory from any angle, share with loved ones

### Social Proof Ideas
- "I can visit my grandmother's kitchen again" — Memorial use case
- "It's like stepping back into our wedding day" — Wedding use case  
- "My kids love exploring their baby photos" — Family use case

### CTA Changes
- "Get Started" → "Create Your First Memory"
- "View Demo" → "Step Into a Memory"

---

## Technical Improvements Needed

### Backend (Priority)
1. **Actual processing** — Integrate nerfstudio or Polycam API for real splat generation
2. **Storage** — S3/R2 for .splat files
3. **Auth** — Simple email + magic link (no passwords)
4. **Payments** — Stripe integration

### Frontend (Polish)
1. **Viewer constraints** — Already in PROJECT.md, implement properly
2. **Mobile experience** — Touch controls, responsive viewer
3. **Onboarding** — Guided first-memory flow
4. **Loading states** — Beautiful progress during "bringing to life"

### Nice-to-Have
- Background music/ambient audio
- Date stamp overlay
- Caption/story text
- Gift flow
- Physical frame integration (Raspberry Pi + screen)

---

## Implementation Priority

### Phase 1: Positioning (This Week)
- [ ] Rewrite landing page copy (emotional, not technical)
- [ ] Simplify pricing (Option A)
- [ ] Add memory type categories
- [ ] Update all "splat" language to "memory"

### Phase 2: Core Product (Next)
- [ ] Implement real processing (start with Polycam API)
- [ ] Add auth (magic link)
- [ ] Add payments (Stripe)
- [ ] Improve viewer UX

### Phase 3: Growth
- [ ] Gift cards / gifting flow
- [ ] Memorial-specific landing page
- [ ] Wedding photographer partnerships
- [ ] Physical "Memory Frame" display

---

## Success Metrics

- **Activation:** % of visitors who create first memory
- **Conversion:** % who pay for second memory
- **Retention:** Return visits to view memories
- **Virality:** Shares per memory created
- **NPS:** Would you recommend to someone preserving a memory?

---

## Key Insight

**The technology is a means, not the product.**

People don't want "Gaussian splats" — they want to feel close to moments and people they love. SharpML should feel like a memory product that happens to use advanced technology, not a tech product that happens to work on memories.

Think: **Ancestry.com for spatial memories**, not "3D photo converter".
