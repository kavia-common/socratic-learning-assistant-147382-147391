# Socratic Learning Assistant – Frontend

Ocean Professional themed Next.js App Router UI with privacy/security scaffolding.

## Tech
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Accessible, responsive components (no external UI lib required)

## Run locally
1. Copy `.env.example` to `.env.local` and set values.
2. Install dependencies and start dev server:
   - npm install
   - npm run dev
3. Open http://localhost:3000

## Environment variables
- NEXT_PUBLIC_API_BASE: Base path for API calls (default empty, UI uses internal `/api` routes)
- NEXT_PUBLIC_COOKIE_BANNER_ENABLED: "true" to show cookie banner
- NEXT_PUBLIC_CONSENT_REQUIRED: "true" to require consent modal

## Pages
- / (Chat) – ChatPanel with mock /api/chat
- /upload – UploadPanel with mock /api/upload
- /analytics – KPI cards reading /api/analytics
- /privacy – Privacy policy
- /security – Security practices overview

## Privacy & Security
- ConsentModal (GDPR-style)
- CookieBanner
- lib/security.ts: input sanitization, safeStorage wrapper, CSRF helper stub
- lib/api.ts: fetch wrapper with retries and error handling
- No secrets committed; read env via NEXT_PUBLIC_* only on client

## Development Notes
- Styling: Ocean Professional (primary #2563EB, secondary #F59E0B, error #EF4444, bg #f9fafb)
- A11y: focus-visible rings, aria labels, keyboard support
- API: keep all calls via /api; replace handlers with real backend proxy when available

See docs/PRIVACY.md and docs/SECURITY.md for details.
