import { NextResponse } from "next/server";
import { leadPayloadSchema, sendLeadToTelegram } from "@/lib/leads";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_error", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await sendLeadToTelegram(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lead delivery failed";
    const status = message.includes("environment") ? 503 : 502;
    return NextResponse.json({ ok: false, error: "telegram_error", message }, { status });
  }
}
