import { NextRequest } from "next/server";

export const dynamic = "force-static";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => ({}));
  const message = String(data?.message ?? "").slice(0, 4000);
  const reply =
    message.length > 0
      ? `Let's think this through. What key principle from your materials relates to: "${message}"?`
      : "Please ask a question to begin.";
  return Response.json({ reply });
}
