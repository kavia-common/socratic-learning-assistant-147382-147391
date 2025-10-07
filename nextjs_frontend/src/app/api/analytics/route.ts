export const dynamic = "force-static";

export async function GET() {
  // Mock analytics
  return Response.json({ sessions: 12, questions: 87, insights: 23 });
}
