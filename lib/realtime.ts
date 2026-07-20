export type RealtimeEvent = "connected" | "inbox.changed" | "aliases.changed" | "domain.changed" | "billing.changed"

export function parseRealtimeMessage(raw: string): { event: RealtimeEvent; data: Record<string, unknown> } | null {
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.event !== "string") return null
    return { event: parsed.event as RealtimeEvent, data: parsed.data ?? {} }
  } catch {
    return null
  }
}
