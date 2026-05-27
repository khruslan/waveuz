import type { LeadPayload } from "@/lib/types";

const DEFAULT_ENDPOINT = "https://amoconnect.ru/amo-ragrouporg/api/slug/wavelabsuz";

function endpoint(): string {
  return process.env.AMOCONNECT_URL?.trim() || DEFAULT_ENDPOINT;
}

function detectContactKind(contact: string): "email" | "phone" {
  return contact.includes("@") ? "email" : "phone";
}

export function buildAmoConnectBody(
  payload: LeadPayload,
  fallbackUrl: string
): Record<string, unknown> {
  const url = payload.pageUrl?.trim() || fallbackUrl;
  const body: Record<string, unknown> = {
    url,
    name: payload.name,
    lead_name: `WaveLabs · ${payload.source}`,
    lead_comment: payload.estimate
      ? `${payload.message}\n\nEstimate: ${payload.estimate}`
      : payload.message
  };

  if (detectContactKind(payload.contact) === "email") {
    body.email = payload.contact;
  } else {
    body.phone = payload.contact;
  }

  if (payload.amoVisitorUid) {
    body.amo_visitor_uid = payload.amoVisitorUid;
  }

  if (payload.utm && Object.values(payload.utm).some(Boolean)) {
    body.utm = payload.utm;
  }

  return body;
}

export async function sendLeadToAmoConnect(
  payload: LeadPayload,
  fallbackUrl: string
): Promise<void> {
  const body = buildAmoConnectBody(payload, fallbackUrl);

  const response = await fetch(endpoint(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`AmoConnect API failed with ${response.status}: ${text.slice(0, 200)}`);
  }
}
