# PROJECT_BRIEF — WardrobeAI

Evidence from: `WardrobeAI_PRD.docx`, `README.md`, `wardrobeai/` (all `src/`, `package.json`, lockfiles, `vite.config.ts`, `index.html`, `tsconfig*`, `eslint.config.js`). Looked for and **not found**: Python/FastAPI, SQL/migrations/Alembic, Docker, `.env*`, Capacitor, tests, composer.json, shadcn/ui, Zustand, React Query.

---

## 1. OVERVIEW

- **Name:** WardrobeAI (`wardrobeai` package `0.0.0`).
- **Purpose:** Camera-first, AI-assisted digital wardrobe: photograph garments, extract metadata, suggest/generate outfits, plan wear, manage closet stats — reducing decision fatigue and duplicate buys (`WardrobeAI_PRD.docx` §1–2).
- **Who for:** Style-conscious professionals, intentional shoppers, fashion enthusiasts (PRD §4).
- **Problem:** Manual tagging apps are tedious; people forget what they own; outfit choice is hard; tag/product data isn’t digitized (PRD §2).
- **Current status: partial UI prototype — ~15–20% of PRD.** Working SPA screens with in-memory CRUD over mock data. No backend, DB, auth, real AI, camera/OCR, persistence, payments, or deploy. PRD stack (Next.js 14 + Capacitor + FastAPI + Postgres) is **not** what the repo implements. Brutal honesty: Phase 0 foundation from PRD §9 is largely missing; what exists is a front-end mock of later UX.

---

## 2. TECH STACK

| Layer | Actual in repo | PRD target (not implemented) |
| --- | --- | --- |
| App | Vite 7.3.1 + React 19.2.4 + TypeScript 5.9.3 SPA under `wardrobeai/` | Next.js 14 App Router + Capacitor 6 |
| Routing | `react-router-dom` 7.13.1 | Next App Router |
| UI | Tailwind via **CDN** (`index.html` → `cdn.tailwindcss.com`); `lucide-react` 0.575.0; Inter font | Tailwind + shadcn/ui; Zustand + React Query |
| State | React Context (`WardrobeContext.tsx`) + `useState` seeded from `mockData.ts` | Server state + client cache |
| Backend | **None** (no `*.py`, no API routes) | Python FastAPI, Celery, Redis |
| DB | **None** (no migrations/schema) | PostgreSQL + SQLAlchemy + Alembic |
| Auth | **None** | JWT + OAuth2 (Google, Apple) |
| Storage / AI | **None** | S3/MinIO; Gemini / GPT-4o / CLIP; BYOK |
| Hosting | **Unclear** — no Docker, Railway, Fly, or CI config found | Docker Compose / Railway / Fly.io |

**Package managers:** both `package-lock.json` and `pnpm-lock.yaml` present — dual lockfiles; which is canonical is unclear.

**Dev libs (declared):** ESLint 9, `@vitejs/plugin-react`, autoprefixer/postcss/tailwindcss in `package.json` but **no** `tailwind.config.*` / `postcss.config.*` and **no** `@tailwind` directives in CSS — build-time Tailwind unused; runtime CDN used instead.

**composer.json:** not present.

---

## 3. HOW IT WORKS

### Architecture (plain words)

Single Vite React SPA. `main.tsx` → `App.tsx` wraps `WardrobeProvider` + `BrowserRouter`. `Layout` (sidebar + outlet) hosts pages. All domain data lives in React state initialized from `src/data/mockData.ts`; refresh loses changes. No network layer.

```
wardrobeai/
  index.html          # Tailwind CDN + title
  src/
    App.tsx           # routes
    context/WardrobeContext.tsx
    data/mockData.ts
    types/index.ts
    pages/            # Dashboard, Wardrobe, Outfits, AISuggestions, Planner, Profile
    components/layout/{Layout,Header,Sidebar}.tsx
    components/wardrobe/{ClothingCard,ClothingItemModal}.tsx
```

### Core user flows (as coded)

1. **Browse dashboard** — stats from in-memory items/outfits/plans; static AI banner; “Style Tip” from counts (`Dashboard.tsx`).
2. **Manage wardrobe** — filter/search grid|list; open modal to add/edit item fields; favorite/delete via card (`Wardrobe.tsx`, `ClothingItemModal.tsx`). Photo: UI says “Upload photo (coming soon)” — no file input.
3. **Build outfits** — pick clothing IDs, occasions, seasons; favorite/delete (`Outfits.tsx`).
4. **“AI” suggestions** — pick occasion + hardcoded weather; client `generateAIOutfits` cycles arrays; fake `styleScore` via `Math.random()`; canned reason strings; optional save as outfit (`AISuggestions.tsx`).
5. **Plan calendar** — click day → assign outfit/occasion/notes/weather string (`Planner.tsx`).
6. **Edit profile** — name/location/styles/colors/occasions in memory; stats derived from items (`Profile.tsx`). Settings toggles are display-only (no `onClick`).

### Data model (client TypeScript only — no DB tables)

Entities in `types/index.ts` (not persisted):

- **ClothingItem** — id, name, category, color, seasons[], occasions[], brand?, size?, imageUrl?, imageColor?, tags[], timesWorn, lastWorn?, purchaseDate?, price?, notes?, isFavorite, createdAt.
- **Outfit** — id, name, items[] (clothing IDs), occasions[], seasons[], rating?, notes?, lastWorn?, timesWorn, isFavorite, createdAt, aiGenerated?.
- **OutfitPlan** — id, date, outfitId?, customItems?, occasion?, notes?, weather?.
- **UserProfile** — name, avatar?, style[], bodyType?, preferredColors[], preferredOccasions[], location?.

Relationships: Outfit.items → ClothingItem.id; OutfitPlan.outfitId → Outfit.id. No `user_id`, embeddings, care_instructions, collections, or wear-log table (PRD §12 schema not implemented).

Seed: 15 clothing items, 5 outfits, 3 plans (dates Jan–Feb 2024), profile “Alex Johnson” (`mockData.ts`).

### Key routes / pages

| Path | Page | Evidence |
| --- | --- | --- |
| `/` | Dashboard | `App.tsx` |
| `/wardrobe` | Wardrobe CRUD UI | |
| `/outfits` | Outfits CRUD UI | |
| `/ai-suggestions` | Fake AI stylist | |
| `/planner` | Calendar planner | |
| `/profile` | Profile + faux settings | |

**No HTTP API endpoints.** Backend routes: N/A.

---

## 4. FEATURES

### Done and working (in-browser, session-only)

- Responsive shell: sidebar nav, mobile drawer (`Sidebar.tsx`, `Layout.tsx`).
- Wardrobe list with category/season/occasion/color/favorites filters + text search (`Wardrobe.tsx`).
- Manual clothing add/edit (text fields); favorite/delete; delete also strips item IDs from outfits (`WardrobeContext.tsx`).
- Outfit create/edit/favorite/delete (`Outfits.tsx`).
- Heuristic outfit “suggestions” + save to outfits (`AISuggestions.tsx`).
- Month calendar plan create/update/delete (`Planner.tsx`).
- Profile edit + derived wardrobe stats (value, cost/wear, color distribution) (`Profile.tsx`).
- Vite app scripts: `dev` / `build` / `lint` / `preview` (`package.json`).

### Partially built (what’s missing)

- **Photos:** placeholder only (`ClothingItemModal.tsx` “coming soon”); `imageUrl` type unused for capture.
- **AI:** no model/API; random scores; fixed copy; no mood/anchor item (PRD §6.3).
- **Dashboard CTAs:** “View Suggestions” / “View all” are `<button>`s with no navigation (`Dashboard.tsx`).
- **Weather:** manual pick or free-text; temps hardcoded; no geolocation API.
- **Filters:** no brand / last-worn / unworn sort controls on wardrobe (PRD §6.5).
- **Selection API:** `selectedItems` / `toggleSelectItem` / `clearSelection` exposed but unused by pages (no bulk ops).
- **App Settings / Upgrade Now:** non-functional UI (`Profile.tsx`, `Sidebar.tsx`).
- **Wear logging:** `timesWorn`/`lastWorn` displayed/editable as fields; no “Mark as Worn” flow that increments on wear.
- **Tailwind production path:** CDN-only; package Tailwind unused — production/CSP implications.

### Planned in PRD, not started

- Camera capture + vision attribute extraction + CLIP embeddings (PRD §6.1).
- Real smart pairing engine / flat-lay from real images (§6.2–6.3).
- QR/barcode + product lookup; label OCR + care flags (§6.4).
- Collections, semantic search, multi-select donate/sold (§6.5).
- Wear history calendar, streaks, weekly/monthly reports, push (§6.6).
- BYOK AI settings, encrypted keys, provider abstraction (§6.7, §5.3).
- Auth (JWT/OAuth), Postgres, Redis/Celery, S3/MinIO, FastAPI proxy (§5, §8).
- Capacitor iOS/Android, offline sync (§7, Phase 6).
- Payments / “AI Pro” — only marketing copy in sidebar; no billing.

---

## 5. WHAT IT NEEDS

### Env variables / secrets (names only)

**None defined in repo** (no `.env*`, no `import.meta.env` / `process.env` usage in `src/`). PRD-implied future names (not in code): provider API keys, DB URL, Redis, S3, JWT secrets, OAuth client IDs — **unclear exact names** until backend exists.

### External accounts / services required (for PRD product)

Google Gemini and/or OpenAI; Postgres; Redis; S3/MinIO; Apple/Google OAuth; optional Google Custom Search for product lookup; App Store / Play for Capacitor — **none wired**.

### Setup and run (frontend only)

```bash
cd wardrobeai
npm install   # or pnpm — dual lockfiles; unclear which is intended
npm run dev   # vite
# optional: npm run build | npm run lint | npm run preview
```

Migrate/seed: **N/A** — no DB. Seed is hardcoded mock arrays.

### Known bugs / stubs / gaps

- Image upload stub: “coming soon” (`ClothingItemModal.tsx`).
- Fake AI (`Math.random`, static `aiReasons`) (`AISuggestions.tsx`).
- Dead buttons: Dashboard CTAs; Profile setting toggles; Sidebar “Upgrade Now”.
- Hardcoded “+3 new” on dashboard stats (`Dashboard.tsx`).
- Favorites % divides by `totalItems` with no empty-wardrobe guard (`Dashboard.tsx`).
- Mock plan dates are 2024-01/02 — “upcoming” list empty relative to current calendar year (`mockData.ts` + `Planner.tsx`).
- No `TODO`/`FIXME` comment hits in `src/` (searched); stubs are UX copy instead.
- No tests; no `test` script in `package.json`.
- Root `README.md` is title only (`# WardrobeAI-`); nested README is stock Vite template.

### Launch blockers

Persistence, auth, real AI/camera, media storage, API, security (validation, CORS, key encryption), emails/push, payments, tests, deploy config, production CSS (replace CDN), docs for runbook.

---

## 6. NEXT STEPS

Priority order to finish toward a real MVP (cut to Phase 0–2 of PRD):

1. **Decide stack: keep Vite SPA vs rebuild to Next.js/Capacitor as PRD** — **S** decision / **L** if full rewrite. (Ambiguity blocks everything.)
2. **Add backend + Postgres schema for users, garments, outfits, plans, wear logs** (PRD §12) — **L**.
3. **Auth (email or OAuth) and per-user data scoping** — **L**.
4. **Persist SPA to API; replace mock context** — **M**.
5. **Real image upload (file first; camera later) + private object storage** — **M**.
6. **One vision provider (Gemini or OpenAI) for attribute prefill; drop CLIP for v1** — **L**.
7. **Honest outfit generator (deterministic rules + optional LLM rationale); remove random scores** — **M**.
8. **Mark-as-worn + calendar wear history** — **S–M**.
9. **Proper Tailwind build (remove CDN); README/runbook; basic e2e smoke tests** — **S**.
10. **Defer:** barcode/OCR, BYOK UI, Capacitor stores, collections/social, Redis/Celery until core loop works — cuts scope **L→M** for first ship.

**Cut to ship faster:** Skip Capacitor, CLIP, BYOK, tag scanner, push, social, multi-provider; ship web-only manual wardrobe + file photos + one AI provider + outfits/planner + auth.

---

## 7. RISKS / DECISIONS NEEDED

From PRD §10 (still open) **and** repo reality:

1. **Stack divergence:** Implement PRD (Next + FastAPI) or evolve current Vite SPA? Current code ≠ PRD architecture.
2. **Sync model:** realtime WebSockets vs batch (PRD Q1).
3. **CLIP / embeddings:** server GPU vs hosted API vs omit for v1 (PRD Q3).
4. **Free tier:** local-only vs limited cloud items (PRD Q4).
5. **Privacy / training consent / trend aggregation** (PRD Q5).
6. **Package manager:** npm vs pnpm (both lockfiles present).
7. **Product name in git:** root README title `WardrobeAI-` — intentional?
8. **Monetization:** “AI Pro / Upgrade” UI with no billing plan — keep, remove, or define Stripe later?
9. **Social sharing:** deferred to v2 in PRD — confirm still out of scope.

---

*Generated from repository read-only audit. No source code changed except this file.*
