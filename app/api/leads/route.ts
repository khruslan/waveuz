import { NextResponse } from "next/server";
import { leadPayloadSchema, sendLeadToTelegram } from "@/lib/leads";
import { sendLeadToAmoConnect } from "@/lib/amoconnect";

function fallbackUrlFromRequest(request: Request): string {
  try {
    const url = new URL(request.url);
    const origin = request.headers.get("origin") ?? `${url.protocol}//${url.host}`;
    return origin;
  } catch {
    return request.headers.get("origin") ?? "";
  }
}

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

  const fallbackUrl = fallbackUrlFromRequest(request);

  // Run both delivery channels in parallel. AmoConnect is the source of truth
  // for sales; Telegram is a redundant operator notification. We treat them as
  // best-effort and report success if at least AmoConnect lands.
  const [amoResult, telegramResult] = await Promise.allSettled([
    sendLeadToAmoConnect(parsed.data, fallbackUrl),
    sendLeadToTelegram(parsed.data)
  ]);

  const amoOk = amoResult.status === "fulfilled";
  const telegramOk = telegramResult.status === "fulfilled";

  if (!amoOk) {
    const message =
      amoResult.reason instanceof Error ? amoResult.reason.message : "AmoConnect delivery failed";
    if (process.env.NODE_ENV !== "test") {
      console.error("[leads] amoconnect failed", message);
    }
    return NextResponse.json(
      { ok: false, error: "amoconnect_error", message, telegram: telegramOk },
      { status: 502 }
    );
  }

  if (!telegramOk && process.env.NODE_ENV !== "test") {
    const message =
      telegramResult.reason instanceof Error
        ? telegramResult.reason.message
        : "Telegram notification failed";
    // Lead was delivered; only the operator notification is missing. Log and
    // proceed with success — we do not want to retry the form in the user's UI.
    console.warn("[leads] telegram side-channel failed", message);
  }

  return NextResponse.json({ ok: true, telegram: telegramOk });
}
