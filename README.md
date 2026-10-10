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
