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
