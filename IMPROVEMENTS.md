# Improvement Ideas

These are **not** part of the PRD and are **not** implemented by the ship-readiness work. They are here so a later pass can pick them up. Effort is relative (S/M/L). Impact is Low / Med / High.

## Architecture

| Title | Why it matters | Effort | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| Split the suggestion engine into a pure library both tests and a future worker can import | The pairing rules are the product. Keeping them free of FastAPI and SQL makes them easy to score against a golden set of wardrobes. | S | High | do now if the engine is not already isolated; otherwise later |
| PostgreSQL + pgvector once a real embedding model is chosen | The PRD's similarity story is a vector index. A JSON fingerprint will not stay fast past a few thousand garments per user. | M | High | later, after decision D2 is revisited |
| Outbox table for wear events | Wear logging is the feature that feeds stats, streaks, and reports. An outbox avoids half-updated counters when a request dies mid-write. | S | Med | later |
| Import / export a wardrobe as a zip of JSON plus images | Users who bring their own keys will also want to leave. A documented export is the practical answer to lock-in and to backups. | M | High | later |
| Per-user soft delete and a trash window | Hard deletes of photos are surprising. Thirty days of undo covers mistakes without keeping data forever. | S | Med | later |

## Developer experience

| Title | Why it matters | Effort | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| One package manager, enforced | The repo has both `package-lock.json` and `pnpm-lock.yaml`. Pick npm (already used to install) and fail CI if the other lockfile returns. | S | Med | do now during the cleanup, then stop touching it |
| Pre-commit: Ruff, ESLint, and a secret scan | The current lint errors landed because nothing runs them before commit. | S | High | later |
| Type-aware ESLint (`recommendedTypeChecked`) | The Vite README already describes this and the repo did not turn it on. It catches the `any` holes that slipped into the planner. | S | Med | later |
| Makefile or a single `justfile` for api, web, test, and migrate | Two runtimes will otherwise live as a paragraph in the README that drifts. | S | Med | later |
| EditorConfig and a format check in CI | The frontend is mostly consistent by hand. A formatter removes review noise. | S | Low | later |

## Observability

| Title | Why it matters | Effort | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| Request id on every log line and error body | When a vision call fails, support needs to tie the UI toast to the server log without asking the user to paste a stack trace. | S | High | do now if the API is being written anyway; the incremental cost is small |
| Metrics for analysis latency, provider errors, and suggestion acceptance | The PRD's success metrics (time to add, suggestion opens, accuracy) are otherwise unmeasurable. | M | High | later |
| OpenTelemetry traces around provider calls | Timeouts and retries are invisible in plain logs once more than one provider exists. | M | Med | later |
| Error tracking (Sentry or equivalent), off by default | A self-hosted app should not phone home unless the operator sets a DSN. | S | Med | later |
| Health check that distinguishes "database down" from "process up" | A load balancer that only checks the port will keep sending traffic at a wedged file lock. | S | High | do now as part of the required health endpoint; deeper dependency checks can grow later |

## CI/CD and deployment

| Title | Why it matters | Effort | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| GitHub Actions: backend tests, frontend lint, typecheck, unit tests | There is no `.github/workflows` today. Regressions will return the moment this pass ends. | S | High | later |
| Playwriter or Playwright smoke of register → add item → suggest → mark worn | The highest-risk bugs are wiring bugs between the form and the API, which unit tests miss. | M | High | later |
| Image build in CI, even if this environment has no Docker | The Dockerfile will rot if nothing builds it. | S | Med | later |
| Migrations as a release step, not on process boot | Auto-migrating on startup is convenient and dangerous with two replicas. | S | Med | later |
| Backup note for the SQLite file and the media directory | A single-node deploy loses the closet if the disk goes and nobody said where the files are. | S | High | later |

## Security beyond the baseline

| Title | Why it matters | Effort | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| Haveibeenpwned-style denylist for new passwords, or a zxcvbn score | Length rules still allow `passwordpassword`. | S | Med | later |
| Step-up confirmation before revealing or replacing an AI key | The settings screen is the most sensitive form in the product. | S | Med | later |
| Content-Security-Policy that forbids inline scripts | The current `index.html` is full of inline script. Once Tailwind is compiled, CSP can actually be strict. | S | High | later, immediately after the CDN script is gone |
| Optional WebAuthn for the same account | Password-only is the right v1 given missing OAuth credentials. Passkeys are the upgrade that does not need Google or Apple. | M | Med | later |
| Dependency review on pull requests | `react-router` already shipped high advisories inside the locked tree. | S | High | later |
| ClamAV or a simple image re-encode on upload | Re-encoding with Pillow strips odd payloads in SVGs and polyglot files. Refuse SVG. | S | Med | do now as part of upload handling if images are being added; a separate antivirus is skip for v1 |

## Performance and cost

| Title | Why it matters | Effort | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| Responsive image variants (thumb, card, full) | A closet of phone photos will dominate the bundle and the grid. | S | High | do now at upload time; it is cheaper than retrofitting |
| Cache weather by rounded lat/lon for an hour | Geolocation lookups will otherwise hit Open-Meteo on every Get Dressed visit. | S | Low | later |
| Cap suggestion work on wardrobe size | The pairing search is combinatorial. A beam search or per-category sample keeps p95 flat when someone has 400 tops. | M | Med | later |
| Self-host the font files | Google Fonts is a render-blocking third party and a privacy leak. | S | Med | do now while touching the document head |
| Token budgets per user per month | BYOK still needs a guard so a bug cannot loop a vision call. | S | High | later |

## Product and UX

| Title | Why it matters | Effort | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| Packing list from a date range on the planner | The PRD's "vacation" job is a collection plus a calendar. A generated packing list is the feature people actually travel with. | M | High | later |
| "What am I not wearing?" review mode | Sort by cost-per-wear descending and last worn, then offer donate. This is the purchase-decision promise in the problem statement, made concrete. | S | High | later, once wear logs exist the UI is small |
| Duplicate purchase warning at add time | Fingerprint distance under a threshold should interrupt the save with the existing item. That is the clutter problem in §2. | S | High | later |
| Outfit rating after wear, not only at creation | A rating captured the night of the wear is better training signal than a star widget in the builder. | S | Med | later |
| Color-blind-safe patterns on charts | Category bars that are only color will fail the same users the contrast work is trying to help. Add labels, which the dashboard already mostly has. | S | Med | later |
| Empty-closet guided first item | The first session is a camera, not a dashboard of zeros. A single full-screen capture step will do more for the "under 10 seconds" metric than another chart. | M | High | later |
| Keyboard shortcuts for favorite and worn | Power users logging a week of outfits from the laptop will not want six clicks per day. | S | Low | skip until someone asks |

## Patterns worth lifting to other projects

| Title | Why it matters | Effort | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| Provider interface with a tested local fallback | Any BYOK product needs "works with no key" behavior that is honest about what it cannot see. The garment analyzer is a clean example. | S | High | do now inside this codebase; extract later |
| SSRF guard as a single function used by every outbound URL | Product lookup, custom base URLs, and weather can all be pointed at `169.254.169.254` if each call site rolls its own client. | S | High | do now |
| Requirement id in the audit that CI can re-count | A hand-maintained percentage drifts the moment a row changes. A small table in the audit plus a script that recomputes earned/possible keeps the next audit honest. | S | Med | later |

## This audit-and-build workflow

| Title | Why it matters | Effort | Impact | Recommendation |
| --- | --- | --- | --- | --- |
| Freeze requirement ids before writing code, and update status in the same commit as the behavior | Otherwise the traceability table describes a plan, not the tree. | S | High | do now |
| Record the exact command and exit code next to every "verified" claim | The failure mode of this kind of pass is a green narrative over a red lint. | S | High | do now |
| Separate "not implemented, with reason" from "done" in the score | Counting a documented deferral as complete is how 40% becomes 85%. | S | High | do now |
| Browser pass for every flow that changes UI, written down with what was clicked | A production bundle exiting 0 does not mean the add-item modal saves. | M | High | do now for the flows this pass changes |
| Do not expand the PRD mid-build | The ideas in this file are tempting and they are how ship dates slip. Link them, do not build them. | S | High | do now |
