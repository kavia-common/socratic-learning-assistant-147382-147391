export const dynamic = "force-static";

/**
 * PUBLIC_INTERFACE
 * GET /api/health
 * Simple health check endpoint to confirm the Next.js app is running.
 * Returns { ok: true, time: ISOString }.
 */
export async function GET() {
  return Response.json({ ok: true, time: new Date().toISOString() });
}
