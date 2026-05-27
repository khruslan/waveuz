import { z } from "zod";
import type { LeadPayload } from "@/lib/types";

export const utmSchema = z
  .object({
    utm_source: z.string().trim().max(180).optional(),
    utm_medium: z.string().trim().max(180).optional(),
    utm_campaign: z.string().trim().max(180).optional(),
    utm_term: z.string().trim().max(180).optional(),
    utm_content: z.string().trim().max(180).optional()
  })
  .strict()
  .optional();

export const leadPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  contact: z.string().trim().min(3).max(180),
  message: z.string().trim().min(3).max(2_000),
  source: z.enum(["modal", "contact", "calculator"]),
  estimate: z.string().trim().max(500).optional(),
  amoVisitorUid: z.string().trim().max(120).optional(),
  utm: utmSchema,
  pageUrl: z.string().trim().max(500).optional()
});

export function escapeTelegramHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function formatTelegramMessage(payload: LeadPayload): string {
  const rows = [
    "<b>New WaveLabs lead</b>",
    "",
    `<b>Source:</b> ${escapeTelegramHtml(payload.source)}`,
    `<b>Name:</b> ${escapeTelegramHtml(payload.name)}`,
    `<b>Contact:</b> ${escapeTelegramHtml(payload.contact)}`,
    `<b>Project:</b> ${escapeTelegramHtml(payload.message)}`
  ];

  if (payload.estimate) {
    rows.push(`<b>Estimate:</b> ${escapeTelegramHtml(payload.estimate)}`);
  }

  return rows.join("\n");
}

export async function sendLeadToTelegram(payload: LeadPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram environment variables are not configured");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramMessage(payload),
      parse_mode: "HTML",
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    throw new Error(`Telegram API failed with ${response.status}`);
  }
}
