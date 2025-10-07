import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => ({}));
  const files = Array.isArray(data?.files) ? data.files : [];
  return Response.json({ ok: true, received: files.length });
}
