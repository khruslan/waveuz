import type { UtmParams } from "@/lib/types";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content"
] as const;

const STORAGE_KEYS = {
  utm: "wl-utm",
  uid: "amo_visitor_uid"
} as const;

function readSessionUtm(): UtmParams | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.utm);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as UtmParams) : undefined;
  } catch {
    return undefined;
  }
}

function writeSessionUtm(utm: UtmParams): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEYS.utm, JSON.stringify(utm));
  } catch {
    // sessionStorage blocked — silently ignore; UTM capture is best-effort.
  }
}

/**
 * Read UTM params from the current URL on mount. If any are present, persist
 * them in sessionStorage so they survive client-side navigation within the
 * landing page. If none are present, return whatever was captured earlier in
 * the session.
 */
export function captureUtm(search?: string): UtmParams | undefined {
  if (typeof window === "undefined") return undefined;
  const query = search ?? window.location.search;
  const params = new URLSearchParams(query);
  const collected: UtmParams = {};
  let foundAny = false;

  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      collected[key] = value;
      foundAny = true;
    }
  }

  if (foundAny) {
    writeSessionUtm(collected);
    return collected;
  }

  return readSessionUtm();
}

export function getAmoVisitorUid(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(STORAGE_KEYS.uid);
    if (existing) return existing;
    const generated =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `wl-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(STORAGE_KEYS.uid, generated);
    return generated;
  } catch {
    return "";
  }
}
