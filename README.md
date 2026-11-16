# RestoTime AI — Frontend

Bilingual (Spanish by default, English on demand) guest portal and host dashboard for
**RestoTime AI**, a smart reservation and wait-time system for a Japanese omakase restaurant.

**Stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · lucide-react

## Quick start

```bash
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm run dev                        # http://localhost:3000
```

The backend (`restotime-ai-backend`) must be running and its `FRONTEND_URL` must include this
app's origin (CORS).

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (includes the OpenAPI contract conformance) |
| `npm run contract:generate` | Regenerate `src/domain/api-contract.ts` from the backend's OpenAPI (`CONTRACT_URL` to override) |

## Pages

| Route | Description |
|---|---|
| `/` | Landing: hero, live dining-room snapshot, AI features, chef's selection, spaces |
| `/menu` | Full bilingual menu with allergen filter and category tabs |
| `/reservations` | Smart booking form with live availability; the AI assigns the table |
| `/reservations/[code]` | Booking details and cancellation |
| `/waitlist` | AI wait estimate (Jikan Engine) and joining the waitlist |
| `/waitlist/[ticket]` | Live ticket: position, remaining time, AI re-estimate |
| `/concierge` | Virtual Itamae chat (sommelier & omakase concierge), `?reservation=` / `?ticket=` |
| `/login` | Staff access (demo accounts one click away) |
| `/dashboard` | 🔒 Staff (admin, host) — Host dashboard: KPIs, floor plan, waitlist, AI seat suggestions, WebSocket presence, Monte Carlo forecast, INP HUD |
| `/lab` | 🔒 Admin only — Tech lab: live INP, Event Loop and compositor demos, workers status, rendering patterns, communication |
| `/offline` | Fallback page served by the Service Worker |

## Architecture

```text
src/
├── app/                    Routes (thin server components) + globals.css design tokens
├── components/
│   ├── layout/             Navbar, LanguageSwitcher (ES | EN), Footer, PageHeader
│   ├── ui/                 Button, Card, Badge, Notice, form fields, AllergenPicker…
│   ├── decor/              Torii mark, ensō, vertical kanji, hanko divider (SVG)
│   ├── ai/                 WaitEstimateCard (AI prediction display)
│   └── home | menu | reservations | waitlist | concierge | dashboard
├── domain/models.ts        Domain types mirroring the backend DTOs
├── hooks/                  useResource, useLiveEvents, useRestaurantInfo, useErrorText
└── lib/
    ├── api/ApiClient.ts    Typed fetch client (+ ApiError), sends Accept-Language
    ├── i18n/               LanguageManager (observable store), LanguageProvider, dictionaries
    ├── format/Formatter.ts Currency / dates / times in the restaurant timezone
    └── services/           ServiceRegistry (composition root), RestaurantDirectory,
                            MenuCatalog, ReservationManager, WaitlistManager,
                            HostOperations, ConciergeSession, LiveEventStream
```

### Guests vs. staff

Guests use the public site without an account (their booking/ticket code is the credential).
Staff sign in at `/login`; `StaffSessionStore` keeps the JWT (validated with zod when read back
from `localStorage`, synced across tabs with the `storage` event and signed out exactly at expiry).
`StaffGate` hides staff pages on the client, but the real protection is the API (401/403).
`ApiClient` adds `Authorization: Bearer`, and the host WebSocket sends the token as a subprotocol.
The Service Worker never caches requests that carry an `Authorization` header.

| Demo account | Password | Access |
|---|---|---|
| `admin@kurenai.demo` | `Kurenai2026!` | Dashboard + Lab |
| `anfitrion@kurenai.demo` | `Kurenai2026!` | Dashboard |

### Internationalization

- `es.ts` is the source of truth; `en.ts` is typed as `Dictionary`, so a missing English key
  is a compile error.
- The server always renders Spanish; the stored choice (`localStorage`) is restored after
  hydration. `LanguageManager` is a tiny observable store consumed with `useSyncExternalStore`.
- `ApiClient` sends the active language in `Accept-Language`, so backend errors and every
  Gemini answer come back in the language the guest is using.

### Rendering patterns

SSG (`/`), ISR with `'use cache'` + `cacheLife('hours')` (`/menu`), streaming SSR inside `<Suspense>`
(`/reservations/[code]`) and CSR (`/dashboard`). See `src/lib/server/ServerApi.ts`.

### Workers

- `src/workers/forecast.worker.ts`: Web Worker for the Monte Carlo forecast (SharedArrayBuffer +
  Atomics when `crossOriginIsolated`; COOP/COEP headers are set in `next.config.ts`).
- `src/workers/live-events.shared-worker.ts`: Shared Worker that keeps one SSE connection for all tabs.
- `public/sw.js`: Service Worker (offline app shell and menu, stale-while-revalidate).

### Performance

`InteractionMonitor` measures INP with the Event Timing API (Input Delay + Processing + Presentation).

### Real time

`LiveEventStream` wraps `EventSource` on `GET /api/events` (Server-Sent Events). The dashboard,
the landing snapshot and waitlist tickets refresh as soon as tables, the queue or bookings change.

## Deployment (Vercel)

1. Import the repository in Vercel (framework preset: Next.js).
2. Add the environment variable `NEXT_PUBLIC_API_URL=https://<your-backend>/api`.
3. Deploy, then add the Vercel URL to the backend's `FRONTEND_URL`.
