# WardrobeAI Audit

Audit date: 2026-10-10. Evidence is from reading the repository and from commands run in this environment. Nothing below is assumed to work only because a file exists.

## 1. Executive Summary

WardrobeAI is specified as a camera-first, bring-your-own-key wardrobe product (auth, PostgreSQL, FastAPI, pluggable vision/text models, outfit intelligence). The repository contains a Vite + React 19 + TypeScript single-page prototype whose screens edit in-memory mock data and forget it on refresh. `npm run build` (`tsc -b && vite build`) succeeds. `npm run lint` fails with 4 errors. There is no test script, no API, no database, no auth, and no deploy config. Overall completion against the PRD is **16.9%**.

## 2. Completion Score

**16.9%** (25.0 earned / 148.0 possible).

Method: each requirement has one weight and one status multiplier. `earned = weight × multiplier`. `Complete = 1`, `Partial = 0.5`, `Missing = 0`, `Broken = 0`. Overall = sum(earned) / sum(weight). Partial credit is only for behavior that actually runs in the current code, not for a screen that merely resembles the feature.

Weights:

- **3 — core product behavior** a user must be able to do for the PRD feature to be real (capture, wardrobe, outfits, wear logging, suggestions, persistence, auth).
- **2 — production baseline** (validation, security controls, tests, docs, data layer, operability).
- **1 — platform and scale NFRs** that need native stores, load rigs, or services this repo does not wire up.

Partial items (14 × weight 3 × 0.5 = 21), plus no secrets in the tree (weight 2 × 1 = 2), plus a production bundle that builds but is not production-safe (weight 2 × 0.5 = 1), plus two unverified accessibility/responsive partials (weight 1 × 0.5 × 2 = 1). Total earned **25**. Possible **32×3 + 18×2 + 16×1 = 148**.

Area scores use each requirement's primary area. Areas overlap, so they are not averaged into the overall number.

| Area | Earned | Possible | Score | Why |
| --- | ---: | ---: | ---: | --- |
| Frontend | 22 | 65 | 34% | Screens and in-memory CRUD exist. Photos, wear logging, real suggestions, and working navigation actions do not. |
| Backend | 0 | 38 | 0% | No server process, routes, or services. |
| Database | 0 | 5 | 0% | No schema, migrations, or durable store. |
| Auth | 0 | 8 | 0% | No users, sessions, or authorization. |
| Integrations | 0 | 21 | 0% | No vision, barcode, weather, storage, or push provider. |
| Tests | 0 | 2 | 0% | No test runner and no tests. |
| Docs | 0 | 4 | 0% | Root README is a title. Nested README is the Vite template. |
| DevOps | 1 | 5 | 20% | `vite build` emits a bundle. No container, health check, or measured cold start. |
| Security | 2 | 13 | 15% | No secrets committed. No validation, headers, rate limit, or encryption. |

## 3. Requirements Traceability Table

Source shorthand: `PRD §n` is `WardrobeAI_PRD.docx`. Status reflects the code **before** the ship-readiness work in later commits.

| ID | Requirement | Source | Status | Evidence | Remaining work |
| --- | --- | --- | --- | --- | --- |
| REQ-001 | Capture a garment photo from camera or file and attach it to an item | PRD §6.1 | 🟡 Partial | `ClothingItemModal.tsx` shows "Upload photo (coming soon)" and does not read a file | Real file/camera input, preview, upload |
| REQ-002 | Extract type, colors, pattern, material, fit, season, and occasion from the photo | PRD §6.1 | ❌ Missing | No analyzer. Attributes are typed by hand | Local color/pattern analysis plus optional vision provider |
| REQ-003 | Show a pre-filled Add Item form the user can correct before save | PRD §6.1 | 🟡 Partial | Manual form in `ClothingItemModal.tsx` saves to React state only | Prefill from analysis, then save durably |
| REQ-004 | Fingerprint each garment and support similarity and duplicate detection | PRD §6.1, open Q3 | ❌ Missing | No embedding field is stored or queried | Honest image fingerprint and similar-item query. CLIP itself is a decision, see §11 |
| REQ-005 | Suggest complementary items when viewing a garment | PRD §6.2 | ❌ Missing | No item detail route. `selectedItems` in context is unused | Pairing endpoint and item detail UI |
| REQ-006 | Rank pairings with color theory, style coherence, occasion, wear history, and season | PRD §6.2 | ❌ Missing | `AISuggestions.tsx` rotates arrays by index | Deterministic scorer |
| REQ-007 | Show a visual preview, a match score, and a written rationale | PRD §6.2, §6.3 | 🟡 Partial | Preview is emoji tiles. `styleScore` is `Math.random()`. Reasons are a fixed string list | Scores and copy derived from the rules that fired |
| REQ-008 | Get Dressed accepts occasion, weather, mood, and an anchor item | PRD §6.3 | 🟡 Partial | Occasion buttons and four hardcoded weather cards. No mood, no anchor, temperatures are literals | Those inputs passed to the engine; weather can be fetched |
| REQ-009 | Return three outfit options per request | PRD §6.3 | 🟡 Partial | Loop builds up to four combinations and drops those with fewer than two items | Stable top-3 with diversity |
| REQ-010 | Flat-lay composition of the actual garments, rendered on the client | PRD §6.3 | 🟡 Partial | Colored emoji blocks, no photos | Compose stored images (or swatches when no photo) |
| REQ-011 | Mark as worn logs the date and updates wear count and last worn | PRD §6.3 | ❌ Missing | `timesWorn` / `lastWorn` are only displayed | Wear log plus idempotent increment |
| REQ-012 | Surface items not worn, including nothing in six months | PRD §6.3, §6.5 | 🟡 Partial | Profile counts `timesWorn === 0` on mock data | Query by `last_worn` and an unworn filter |
| REQ-013 | Scan QR, EAN-13, and UPC | PRD §6.4 path A | ❌ Missing | No scanner dependency or UI | Browser scanner plus typed-code fallback |
| REQ-014 | Look up the code or product URL and pre-fill the add form | PRD §6.4 | ❌ Missing | No lookup client | SSRF-safe fetch and JSON-LD/OpenGraph parse |
| REQ-015 | Photograph a label, OCR it, and store care flags | PRD §6.4 path B | ❌ Missing | Notes field is free text | Vision OCR when a provider key exists; no fabricated OCR |
| REQ-016 | Filter the wardrobe by category, color, season, occasion, brand, last worn, and unworn | PRD §6.5 | 🟡 Partial | `Wardrobe.tsx` filters category, season, occasion, color, favorites, substring | Brand, last-worn, unworn; filters must survive reload |
| REQ-017 | Sort by date added, last worn, most used, and name | PRD §6.5 | ❌ Missing | Recently added and most worn exist only as dashboard slices | Sort control on the wardrobe |
| REQ-018 | Natural-language search such as "blue casual tops" | PRD §6.5 | ❌ Missing | Substring match on name, brand, tags | Parser over the real attributes |
| REQ-019 | Multi-select to delete, add to a collection, or mark donated/sold | PRD §6.5 | ❌ Missing | `selectedItems` is never read by a page | Bulk actions and a status field |
| REQ-020 | User-defined collections | PRD §6.5 | ❌ Missing | No collection type | Collection CRUD and membership |
| REQ-021 | Stats: totals, cost per wear, most and least worn, category breakdown | PRD §6.5 | 🟡 Partial | Dashboard and Profile compute some of this from mock state. Least-worn is absent. "+3 new" is hardcoded | Compute from stored prices and wear logs |
| REQ-022 | Calendar of what was worn each day | PRD §6.6 | 🟡 Partial | `Planner.tsx` plans a future outfit. Sample plans are dated January 2024, so relative to 2026-10-10 the upcoming list is empty | Wear history on the calendar |
| REQ-023 | Filter wear history by date range, item, or occasion | PRD §6.6 | ❌ Missing | No wear-log model | History query and UI |
| REQ-024 | Streaks toward wearing the wardrobe | PRD §6.6 | ❌ Missing | Not implemented | Consecutive-day and coverage stats |
| REQ-025 | Weekly and monthly wear reports in app or via push | PRD §6.6 | ❌ Missing | Not implemented | In-app report. Push is REQ-060 |
| REQ-026 | BYOK settings: Gemini, OpenAI, independent vision vs text defaults, test connection, custom base URL, usage estimate | PRD §6.7, §5.3 | ❌ Missing | Profile "App Settings" toggles are hardcoded and `onClick`-less | Settings API and screen |
| REQ-027 | API keys encrypted at rest with AES-256, never logged, decrypted only for inference | PRD §6.7, §7 | ❌ Missing | No key store | AES-256-GCM and log redaction |
| REQ-028 | Create, edit, favorite, and delete outfits | PRD §6.3, existing UI | 🟡 Partial | `Outfits.tsx` and context mutate memory. Refresh wipes them. Delete has no confirm | Persist and authorize per user |
| REQ-029 | Create, edit, favorite, and delete clothing items | PRD §6.5, Phase 0 | 🟡 Partial | Same in-memory pattern. Delete removes the id from outfits but not from plans | Persist, images, referential cleanup |
| REQ-030 | Profile name, location, styles, preferred colors and occasions | PRD §4, existing UI | 🟡 Partial | `Profile.tsx` edits memory only | Persist on the user record |
| REQ-031 | Dashboard summarizes the wardrobe and links to the next action | Existing `Dashboard.tsx`, PRD §6.5 | 🟡 Partial | Stats render from context. "View Suggestions" and "View all" have no navigation. Favorites percent divides by `totalItems` with no zero guard | Working links, real copy, empty-safe math |
| REQ-032 | Authenticated users; each wardrobe is private | PRD §5.2, §12 `user_id` | ❌ Missing | Single global mock profile "Alex Johnson" | Register, login, logout, session |
| REQ-033 | Wardrobe data survives reload and is shared across the user's sessions | PRD §5, open Q1 | ❌ Missing | `useState(mock…)` in `WardrobeContext.tsx` | Database plus client cache |
| REQ-034 | PostgreSQL via SQLAlchemy and Alembic | PRD §5.2, §8 | ❌ Missing | No Python, no migrations | SQLAlchemy + Alembic. Engine must also run on SQLite here because PostgreSQL is not installed. See §11 |
| REQ-035 | Backend API proxies AI calls so keys stay server-side | PRD §5 | ❌ Missing | No backend | FastAPI |
| REQ-036 | Garment images stored privately and not used for training without consent | PRD §7 | ❌ Missing | No image bytes are stored. No consent flag | Private media route and a default-off consent flag |
| REQ-037 | Server-side validation of every mutating payload | PRD §7, ship bar | ❌ Missing | A few HTML `required` attributes | Pydantic models |
| REQ-038 | Rate limiting, CORS, and security headers | PRD §7 OWASP | ❌ Missing | No server | Middleware |
| REQ-039 | No secrets committed | PRD §7 | ✅ Complete | Tree has no `.env` and no key literals. Verified by reading the repo | Keep it that way; add `.env.example` |
| REQ-040 | Consistent error responses with no stack traces | Ship bar, PRD §7 | ❌ Missing | No API | Error handler |
| REQ-041 | Structured logs without secrets | Ship bar | ❌ Missing | No logger | JSON logs, redaction |
| REQ-042 | Pagination and bounded list queries | PRD scale, ship bar | ❌ Missing | Client holds the whole mock array | Page params and indexes |
| REQ-043 | Automated tests for core logic and endpoints | Ship bar | ❌ Missing | `package.json` has no `test` script. `npm test` exits 1 with "Missing script: test" | Pytest and Vitest |
| REQ-044 | Current API documentation | Ship bar | ❌ Missing | No OpenAPI document | FastAPI schema |
| REQ-045 | README covers setup, env, run, test, and deploy | Ship bar | ❌ Missing | `/README.md` is `WardrobeAI-`. `wardrobeai/README.md` is the Vite template | Replace both with accurate docs |
| REQ-046 | Health check | Ship bar | ❌ Missing | No server | `GET /api/health` |
| REQ-047 | Clean production build | Ship bar | 🟡 Partial | `npm run build` exits 0 (1752 modules, JS 321 kB). Built CSS is 1.36 kB because utilities come from `https://cdn.tailwindcss.com` in `index.html`. Lint does not pass | Compile Tailwind. Fix lint |
| REQ-048 | Offline browsing of wardrobe and outfits, sync on reconnect | PRD §7 | ❌ Missing | No service worker, no cache | Cache last snapshot and queue writes |
| REQ-049 | Secure cookie or session defaults | PRD §7 | ❌ Missing | No session | HttpOnly, SameSite, Secure-in-production |
| REQ-050 | Object-level authorization on every wardrobe route | PRD §12 | ❌ Missing | No owners | `user_id` checks |
| REQ-051 | Image analysis under 5 seconds at p95 | PRD §7 | ❌ Missing | No pipeline to time | Local path must stay synchronous and bounded; remote calls time out |
| REQ-052 | Cold start under 3 seconds on mid-range phones | PRD §7 | ❌ Missing | Not measured. Dev shell returned HTTP 200 in this environment, which says nothing about phone cold start | Record the limit; do not claim it |
| REQ-053 | 10,000 concurrent users | PRD §7 | ❌ Missing | Single browser tab state | Not load-tested. Stateless API is the preparation, not the proof |
| REQ-054 | WCAG 2.1 AA | PRD §7 | 🟡 Partial | Some labels exist. Icon buttons lack accessible names. Contrast of muted text was not measured. No screen-reader pass | Names, focus, contrast, dialog semantics |
| REQ-055 | iOS 15+ and Android 10+ via Capacitor | PRD §5.1, §7, Phase 6 | ❌ Missing | No Capacitor project | Not started. See decision D1 |
| REQ-056 | OAuth2 login with Google and Apple | PRD §5.2, §8 | ❌ Missing | No OAuth client config | Blocked without client credentials. See D3 |
| REQ-057 | Redis and Celery for background inference | PRD §5.2, §8 | ❌ Missing | No worker | See D5. Capture stays request/response |
| REQ-058 | S3 or MinIO for images | PRD §5.2, §8 | ❌ Missing | No object storage | Local private files now; S3-compatible adapter when configured |
| REQ-059 | Docker Compose deployment | PRD §8 | ❌ Missing | No Dockerfile. `docker` is not installed in this environment (`docker: command not found`) | Compose file. Image build cannot be executed here |
| REQ-060 | Push notifications | PRD Phase 6, §6.6 | ❌ Missing | Header bell does nothing and always shows a pink dot | In-app reports only. Push needs FCM/APNs |
| REQ-061 | Explicit opt-in before any use of images for training or trend aggregation | PRD §7, open Q5 | ❌ Missing | No images and no consent | Default off, and no training pipeline exists |
| REQ-062 | Responsive web layout | PRD §7 | 🟡 Partial | Breakpoints in the layout components. Not exercised at a phone width in a browser during discovery | Check after the rebuild |
| REQ-063 | Vision provider and text provider chosen independently | PRD §6.7 | ❌ Missing | No providers | Two settings fields |
| REQ-064 | Donated or sold status, hidden from the active closet | PRD §6.5 | ❌ Missing | No status field | Status on the item and a filter |
| REQ-065 | Weather from geolocation or typed input | PRD §6.3 | ❌ Missing | Four static weather cards | Open-Meteo via the backend, plus manual entry |
| REQ-066 | User-configurable product lookup endpoint | PRD §6.4 | ❌ Missing | No lookup | Template URL on AI/settings |

Out of scope for v1, confirmed in PRD §11 and open question 2, and **not** counted above: in-app clothing checkout, follows/likes/public profiles, external trend feeds, smart mirrors, AR try-on, laundry booking. The sidebar "Upgrade Now" button and the "Social Sharing" toggle pretend otherwise. They are defects, not requirements.

## 4. Endpoint Inventory

There are **no HTTP endpoints**. `rg` over the repo finds no route handlers, and the app never calls `fetch`. The dev server (`npx vite --host 127.0.0.1 --port 5173`) returned HTTP 200 for `/`, `/wardrobe`, `/outfits`, `/ai-suggestions`, `/planner`, and `/profile` because Vite serves `index.html` for every path. That does not mean those screens were exercised.

The routes below are the API the PRD behaviors require. All are missing. Auth is therefore "none". Validation is "none". Tests are "none".

| Method | Path | Auth | Validation | Status | Tests |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/health` | public | n/a | missing | none |
| POST | `/api/auth/register` | public | n/a | missing | none |
| POST | `/api/auth/login` | public | n/a | missing | none |
| POST | `/api/auth/logout` | session | n/a | missing | none |
| POST | `/api/auth/refresh` | refresh cookie | n/a | missing | none |
| GET | `/api/auth/me` | session | n/a | missing | none |
| GET | `/api/profile` | session | n/a | missing | none |
| PATCH | `/api/profile` | session | n/a | missing | none |
| GET | `/api/items` | session | n/a | missing | none |
| POST | `/api/items` | session | n/a | missing | none |
| GET | `/api/items/{id}` | owner | n/a | missing | none |
| PATCH | `/api/items/{id}` | owner | n/a | missing | none |
| DELETE | `/api/items/{id}` | owner | n/a | missing | none |
| POST | `/api/items/{id}/favorite` | owner | n/a | missing | none |
| POST | `/api/items/{id}/worn` | owner | n/a | missing | none |
| GET | `/api/items/{id}/similar` | owner | n/a | missing | none |
| GET | `/api/items/{id}/pairings` | owner | n/a | missing | none |
| POST | `/api/items/bulk` | owner | n/a | missing | none |
| POST | `/api/items/analyze` | session | n/a | missing | none |
| GET | `/api/media/{id}` | owner | n/a | missing | none |
| GET | `/api/outfits` | session | n/a | missing | none |
| POST | `/api/outfits` | session | n/a | missing | none |
| PATCH | `/api/outfits/{id}` | owner | n/a | missing | none |
| DELETE | `/api/outfits/{id}` | owner | n/a | missing | none |
| POST | `/api/outfits/{id}/favorite` | owner | n/a | missing | none |
| POST | `/api/outfits/{id}/worn` | owner | n/a | missing | none |
| POST | `/api/suggestions` | session | n/a | missing | none |
| GET | `/api/plans` | session | n/a | missing | none |
| POST | `/api/plans` | session | n/a | missing | none |
| PATCH | `/api/plans/{id}` | owner | n/a | missing | none |
| DELETE | `/api/plans/{id}` | owner | n/a | missing | none |
| GET | `/api/wear` | session | n/a | missing | none |
| GET | `/api/reports/wear` | session | n/a | missing | none |
| GET | `/api/collections` | session | n/a | missing | none |
| POST | `/api/collections` | session | n/a | missing | none |
| PATCH | `/api/collections/{id}` | owner | n/a | missing | none |
| DELETE | `/api/collections/{id}` | owner | n/a | missing | none |
| POST | `/api/scan/product` | session | n/a | missing | none |
| POST | `/api/scan/label` | session | n/a | missing | none |
| GET | `/api/settings/ai` | session | n/a | missing | none |
| PUT | `/api/settings/ai` | session | n/a | missing | none |
| POST | `/api/settings/ai/test` | session | n/a | missing | none |
| GET | `/api/weather` | session | n/a | missing | none |
| GET | `/api/stats` | session | n/a | missing | none |

## 5. What's Done

Verified by reading the code and by the commands in §10:

- React 19 + TypeScript + Vite 7 + React Router 7 app with six routes: Dashboard, Wardrobe, Outfits, AI Stylist, Planner, Profile (`wardrobeai/src/App.tsx`).
- In-memory create, update, delete, and favorite for clothing items, outfits, and plans, plus profile edits (`WardrobeContext.tsx`). Lost on refresh.
- Wardrobe text search and filters for category, season, occasion, color, and favorites. Grid and list views. Empty copy.
- Outfit builder modal.
- Month calendar that can attach an existing outfit to a date.
- Dashboard and profile statistics derived from the in-memory arrays (totals, favorites, category bars, cost per wear, color counts).
- `npm run build` completes typecheck and the Vite bundle (exit 0).
- No secrets are stored in the repository (REQ-039).

Not verified in a browser: clicking through those flows. Discovery confirmed only that the dev server returns the SPA shell.

## 6. What's Left

### P0 — blocks shipping

1. Durable, per-user data for items, outfits, plans, and profile.
2. Authentication and object-level authorization.
3. Replace the mock store so the UI talks to that API, including loading, empty, and error states.
4. Photo capture, private image storage, and a real review-before-save flow.
5. Deterministic outfit engine (three options, pairings, scores, rationales) with no `Math.random()` scores.
6. Wear logging, last-worn, and the six-month neglect list.
7. Server-side validation, error shape, security headers, CORS, rate limits, encrypted BYOK storage.
8. Tests for the engine and the endpoints. Lint must pass. Tailwind must be compiled, not loaded from a CDN.
9. Accurate README, `.env.example`, OpenAPI, health check.

### P1 — production quality

1. Filters and sorts named in the PRD, natural-language search, collections, bulk donated/sold.
2. Item detail with pairings and similar items.
3. Calendar wear history, streaks, and in-app weekly/monthly reports.
4. Real Gemini and OpenAI clients, independent provider selection, test connection, custom OpenAI-compatible base URL, usage estimates.
5. Barcode/QR decode, SSRF-safe product lookup, label OCR only when a vision key is configured.
6. Offline read of the last snapshot and a write queue that flushes on reconnect.
7. Accessibility names, focus, dialog semantics, and contrast.
8. Alembic migrations that run on SQLite and PostgreSQL.

### P2 — polish

1. Geolocation weather through a backend proxy.
2. Mood and anchor-item inputs on Get Dressed.
3. Client flat-lay using real thumbnails.
4. Docker Compose and a production image definition.
5. Remove dead UI: fake upgrade CTA, fake notification dot, non-functional setting toggles, Vite boilerplate CSS.

### Will not be implemented in this pass (reason recorded, requirement stays open)

- REQ-055 Capacitor store binaries. No iOS/Android SDK signing path in this environment, and rewriting the working UI to Next.js is decision D1.
- REQ-056 Google and Apple OAuth. No client ids or secrets are available.
- REQ-052 and REQ-053. No device lab and no load rig, so a number would be fabricated.
- REQ-060 Push. No FCM/APNs project.
- REQ-057 Celery. See D5.
- True CLIP 512-d vectors. See D2.

## 7. Code Quality Findings

- The data layer is one React context seeded from `src/data/mockData.ts` (15 items, 5 outfits, 3 plans, a fictional user). That is demo content presented as the product.
- `generateId` uses `Math.random().toString(36).substr(2, 9)`. Collisions are unlikely and still sloppy, and `substr` is legacy.
- `AISuggestions.tsx` manufactures an 80–99 "match" with `Math.random()` and picks a rationale from a constant list. `generationCount` is a fake dependency used to reshuffle. This is the central piece of fake intelligence.
- `selectedItems` and `toggleSelectItem` are dead. `App.css` is the unused Vite starter stylesheet. `src/assets/react.svg` is unused. Several classes in `index.css` (`.shimmer`, `.gradient-text`, `.card-hover`) have no callers.
- `Planner.tsx` uses `any` twice (lint errors). `ClothingItemModal` copies props into state inside an effect (lint error). `WardrobeContext.tsx` exports a hook beside a component (react-refresh lint error).
- Category emoji maps, occasion color maps, and color hex maps are copy-pasted across six files.
- `@types/react-router-dom` `^5.3.3` does not match `react-router-dom` `^7.13.1`, which ships its own types.
- Both `package-lock.json` and `pnpm-lock.yaml` are committed. `npm ci` was used successfully against the npm lockfile. The pnpm lockfile is an unowned second source of truth.
- Tailwind, PostCSS, and Autoprefixer are dependencies, but there is no `tailwind.config` or `postcss.config`. Styling is a Tailwind CDN script in `index.html`, which is not a production setup and is a supply-chain dependency on a third-party host.
- `index.css` sets `transition` on `*`, so every element animates color, shadow, and transform. That fights `prefers-reduced-motion` and makes the UI feel sluggish.
- Delete actions fire immediately, with no confirm.
- Dashboard favorite ratio does not guard `totalItems === 0`.
- Header bell, sidebar upgrade, dashboard CTAs, and profile toggles are non-functional controls that look finished.
- No error boundary. No loading state, because nothing is loaded.

## 8. Security Findings

- There is no authentication. Anyone who can open the site shares one wardrobe, and that wardrobe is not even stored.
- There is no server, so there is also no validation, no CSRF story, no CORS policy, no security headers, and no rate limit. The future API has to add all of them; the SPA cannot be the security boundary.
- Images, once added, would need authorization on the media URL. An `<img>` tag cannot send an `Authorization` header, so a bearer token in `localStorage` would both be XSS-exposed and useless for images. Cookies are the right default (REQ-049).
- Product URL fetch (REQ-014) is an SSRF risk if it is implemented naively. Lookup must block link-local and private addresses, cap size, and time out.
- API keys must never be returned in full, logged, or written to the frontend bundle. The PRD's AES-256 requirement is unmet because the store does not exist.
- `npm audit --omit=dev` reports **2 high** findings, both via `react-router` / `react-router-dom` (installed range includes 7.13.1; the advisory range shown was `6.0.0 - 7.18.1`). Full tree audit reported 21 issues (2 low, 3 moderate, 16 high), most of them in dev tooling. No critical issues. These need an upgrade during implementation, then a re-audit.
- Tailwind's CDN script has no Subresource Integrity hash.
- Google Fonts is loaded at runtime from `fonts.googleapis.com` in both `index.html` and `index.css` (duplicate). That leaks the visitor's IP to Google and blocks first paint on that origin.
- Dependency versions use carets and the app version is `0.0.0`.

## 9. Performance and Scalability Findings

- The entire closet is held in React state. Fine for 15 mock rows, not for the "50+ items" persona once photos exist, and there is no pagination.
- No database, so no indexes, no N+1, and no query plan. Those become real the moment a schema exists: lists must be filtered in SQL and indexed by `user_id`.
- External render-blocking requests: Tailwind CDN, Google Fonts (twice).
- The universal `*` transition forces style recalculation on routine updates.
- AI suggestion generation is synchronous and trivial today. A real vision call has to have a timeout so one slow provider cannot hang the request (REQ-051).
- No cache headers, no thumbnail pipeline, no background job. Thumbnails should be generated at upload time so the grid does not download full photos.
- REQ-053 (10k concurrent) is not something this prototype can approach. A stateless API with a connection-pooled database is the architecture that could; it is not evidence of capacity.

## 10. Testing and Reliability Findings

Commands run on 2026-10-10 from `wardrobeai/` after `npm ci` (248 packages, exit 0):

| Command | Result |
| --- | --- |
| `npm run lint` | Exit 1. 4 errors, 1 warning. `react-hooks/set-state-in-effect` in `ClothingItemModal.tsx`, `react-refresh/only-export-components` in `WardrobeContext.tsx`, two `@typescript-eslint/no-explicit-any` in `Planner.tsx`, plus `react-hooks/exhaustive-deps` warning in `AISuggestions.tsx`. |
| `npm run build` | Exit 0. `tsc -b` passed. Vite 7.3.1 emitted `dist/index.html` 1.78 kB, `dist/assets/index-Dcu0t4n3.css` 1.36 kB, `dist/assets/index-D4jKxGSD.js` 321.29 kB. |
| `npm test` | Exit 1. `Missing script: "test"`. |
| Dev server | HTTP 200, 1938 bytes, for `/`. Response contains `cdn.tailwindcss.com`. Client routes also 200 as SPA fallback. |
| `npm audit --omit=dev` | 2 high, in `react-router-dom`. |
| Toolchain | Node v22.14.0, npm 10.9.9, Python 3.12.3. `docker` and `psql` are not installed. |

No unit, integration, end-to-end, or accessibility tests exist. No CI workflow (no `.github/`). No logging. No global error UI. Failed deletes and future network errors have nowhere to go.

Sample planner dates (`2024-01-29` through `2024-02-01`) are in the past relative to the audit date, so the "Upcoming" panel is empty even though mock plans exist. That is a broken demo, confirmed by reading `mockData.ts` against today's date.

## 11. Risks and Assumptions

Decisions taken so implementation can continue. The breaking option in each pair is the one **not** implemented.

### D1 — Do not rewrite the UI to Next.js + Capacitor

- Option A: rebuild the frontend as Next.js 14 App Router and wrap it in Capacitor 6, as PRD §5 and §8 specify.
- Option B: keep the existing Vite + React 19 + TypeScript + Tailwind UI, and add the FastAPI backend the PRD requires for auth, storage, and server-side keys. Ship responsive web plus a PWA cache.
- Recommendation: **B**. Option A throws away a working UI and still cannot produce App Store or Play binaries here. REQ-055 stays open.

### D2 — Do not fake CLIP

- Option A: store random 512-d vectors and call them CLIP.
- Option B: run `clip-vit-large-patch14` locally. No GPU in this environment, and PRD open question 3 is unresolved (server GPU vs hosted API).
- Option C: compute a real color-and-structure fingerprint from the uploaded image and rank similar items with cosine similarity. Label it as a fingerprint, not CLIP.
- Recommendation: **C**.

### D3 — Email and password sessions, not OAuth, until credentials exist

- Option A: block all auth work on Google and Apple client ids.
- Option B: JWT access cookie plus rotating refresh cookie, passwords hashed with bcrypt.
- Recommendation: **B**. REQ-056 stays open and is not stubbed with a fake Google button.

### D4 — Batch sync, not WebSockets

PRD open question 1. Recommendation: the API is the source of truth; the client caches the last snapshot and replays a write queue. Real-time multi-device sync is later.

### D5 — No Celery for the capture flow

The add-item UX needs the analysis result in the same request so the form can be corrected before save. A queue plus polling is a worse product and a second runtime. Recommendation: synchronous analysis with a hard timeout. Redis/Celery (REQ-057) stays unimplemented.

### D6 — SQLite by default, PostgreSQL when `DATABASE_URL` says so

PostgreSQL is specified, and neither Docker nor `psql` is installed here, so a Postgres-only app could not be run or tested. Recommendation: SQLAlchemy and Alembic, SQLite as the default file database, PostgreSQL when the URL scheme is postgres. Types stay portable (no Postgres-only column types in the initial migration).

### D7 — Local private files, S3 when configured

Same constraint as D6. The storage interface writes to a local directory unless S3 settings are present. REQ-058 is partial once the adapter exists, and MinIO was not executed.

### Other assumptions

- Social sharing and the upgrade paywall are out of scope (PRD §11), so those controls should be removed rather than wired up.
- A local vision fallback may fill **color and pattern only**. Guessing brand, material, or category from pixels without a model would be fake data. Category stays a user choice unless a configured vision provider returns it.
- Open-Meteo is a reasonable no-key weather source for REQ-065. If it is unreachable, manual weather still works.
- Barcode lookup will not invent product rows. A decoded code with no catalog match returns the code and leaves the form for the user.
- "Free tier" (open question 4) is irrelevant to a self-hosted single deploy. No billing is added.
- Trend aggregation (open question 5) stays off. The consent flag defaults to false and nothing reads it for training.

## 12. Execution Plan

Ordered. Sizes are relative effort (S/M/L), not calendar time.

1. **S** — Commit this audit and `IMPROVEMENTS.md` before code changes.
2. **L** — FastAPI app: config, SQLite/Postgres engine, models, Alembic, error shape, logging, security headers, CORS, rate limit, health.
3. **L** — Auth, profile, items, outfits, plans, wear logs, collections, stats, suggestions engine, media, analyze, scan, settings, weather.
4. **M** — Pytest coverage for auth failures, validation, ownership, engine, search, local analyze, scan SSRF guards.
5. **L** — Point the React app at the API. Auth screens, photo flow, real suggestions, wardrobe tools, calendar history, settings, offline cache. Delete mock-as-product and dead controls.
6. **M** — Compile Tailwind, fix lint, Vitest for pure helpers, accessibility pass.
7. **S** — README, `.env.example`, Dockerfile, compose file, OpenAPI check.
8. **S** — Re-run build, lint, typecheck, and tests. Update this table and the score. Add the ship report.

---

## Ship Readiness Report

Not started. This section is updated when implementation finishes.

- Finished:
- Remaining:
- How to run and deploy:
- Known limitations:
