# SharpML - Photo to 3D Splat Micro-SaaS

## Vision
A simple, polished micro-SaaS that transforms photos and memories into beautiful interactive 3D Gaussian splats. Premium feel, tasteful presentation, focused scope.

## Core User Flow
1. **Landing** → Beautiful marketing page, clear value prop
2. **Upload** → Drag-drop photos (or photo set for a memory/scene)
3. **Process** → Backend converts to Gaussian splat (placeholder/mock for MVP)
4. **View** → Interactive 3D viewer with tasteful constraints
5. **Share** → Shareable link to the splat
6. **Pay** → Subscription/credits for processing (placeholder)

## Key UX Principles
- **Prevent illusion-breaking**: Constrain zoom to prevent getting too close (splats look bad up close)
- **Smooth controls**: Orbit, pan with momentum, subtle boundaries
- **Premium feel**: Elegant UI, smooth animations, no jank
- **Mobile-friendly**: Touch controls, responsive design

## Tech Stack (Recommended)
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **3D Viewer**: Three.js with gaussian-splat-3d or @mkkellogg/gaussian-splats-3d
- **Backend**: Next.js API routes (serverless-ready)
- **Storage**: Local filesystem for MVP (S3/R2 placeholder)
- **Auth**: Simple email/password for MVP (placeholder)
- **Payments**: Stripe placeholders (no real integration yet)

## MVP Features (Build These)
- [ ] Landing page with hero, features, pricing sections
- [ ] Upload interface (drag-drop, progress indicator)
- [ ] Gallery dashboard (list user's splats)
- [ ] 3D Viewer component with:
  - Orbit controls
  - Zoom limits (min/max distance)
  - Smooth damping
  - Optional auto-rotate
  - Fullscreen mode
- [ ] Share page (public link to view a splat)
- [ ] Pricing page with placeholder plans
- [ ] Basic auth UI (login/signup forms, placeholder logic)

## Viewer Constraints (Critical)
```javascript
// Prevent zoom-in that breaks illusion
controls.minDistance = 2.0;  // Can't get too close
controls.maxDistance = 20.0; // Can't go too far

// Smooth, premium feel
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Optional: limit vertical rotation to prevent disorientation
controls.minPolarAngle = Math.PI * 0.1;
controls.maxPolarAngle = Math.PI * 0.9;
```

## File Structure
```
sharpml/
├── app/                    # Next.js app router
│   ├── page.tsx           # Landing page
│   ├── upload/page.tsx    # Upload interface
│   ├── dashboard/page.tsx # User's splats gallery
│   ├── view/[id]/page.tsx # Public viewer
│   ├── pricing/page.tsx   # Pricing plans
│   ├── login/page.tsx     # Auth pages
│   └── api/               # API routes
├── components/
│   ├── SplatViewer.tsx    # The 3D viewer component
│   ├── UploadDropzone.tsx
│   ├── SplatCard.tsx
│   └── ui/                # Shared UI components
├── lib/
│   ├── splat-processing.ts # Mock/placeholder processing
│   └── auth.ts            # Placeholder auth
├── public/
│   └── splats/            # Sample .splat files for demo
└── PROJECT.md             # This file
```

## Sample Splat Files
For MVP, include 1-2 sample .splat or .ply files to demonstrate the viewer.
Can download from: https://github.com/mkkellogg/GaussianSplats3D (has sample splats)

## Design Direction
- Dark theme (splats look better on dark backgrounds)
- Accent color: Electric blue or warm amber
- Typography: Clean, modern sans-serif (Inter, Geist)
- Minimal chrome around the viewer — let the splat be the hero
- Subtle gradient backgrounds, glass-morphism cards

## Placeholders Needed
1. **Processing**: Mock function that "processes" uploads (just returns success after delay)
2. **Storage**: Save to local `public/uploads/` for MVP
3. **Auth**: Simple useState-based auth state (no real backend)
4. **Payments**: Stripe Checkout placeholder (shows modal, doesn't charge)

## Success Criteria
- [ ] Can visit landing page and understand the product
- [ ] Can "upload" photos (mock processing)
- [ ] Can view a beautiful 3D splat with constrained controls
- [ ] Can share a public link
- [ ] Pricing page looks legit
- [ ] Feels premium and polished, not hacky

## Commands
```bash
# Setup
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false

# Install splat viewer
npm install @mkkellogg/gaussian-splats-3d three @types/three

# Dev
npm run dev

# Build
npm run build
```

## Notes
- Mac mini M4 has great GPU — could potentially do local splat generation later
- For real processing, look at: nerfstudio, gaussian-splatting, polycam API
- Keep scope tight for MVP — polish > features
