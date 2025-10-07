# Security Overview

This document outlines security-relevant aspects of the frontend.

Threat Model (frontend scope):
- XSS via user content: mitigated with client-side input sanitization and escaping. Avoid dangerouslySetInnerHTML.
- Token leakage: no tokens stored in localStorage beyond minimal preferences; rely on HTTP-only secure cookies for auth (backend).
- CSRF: include CSRF token helper (stub) for future integration; server should validate.
- Clickjacking: backend should set appropriate headers (X-Frame-Options/Frame-Options).
- Transport: require HTTPS.

Practices implemented:
- lib/security.ts: sanitizeInput, safeStorage abstraction, getCsrfToken stub.
- lib/api.ts: centralized fetch with retries, JSON content-type, no-store caching.
- UI components avoid inline event HTML and unsafe markup.
- Accessibility and keyboard navigation to reduce spoofing risk.

Recommendations:
- Use server-managed sessions with SameSite=strict cookies.
- Add CSP (Content Security Policy) in production.
- Implement rate-limiting and input validation on backend APIs.
- Add SRI for third-party assets if any (none used currently).

Replace with your organization’s formal security review before production.
