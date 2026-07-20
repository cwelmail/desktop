const UTC_SPACE_RE = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})(?::(\d{2}))? UTC$/

export function parseMessageTimestamp(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const legacy = UTC_SPACE_RE.exec(trimmed)
  if (legacy) {
    const [, year, month, day, hour, minute, second] = legacy
    return Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second ?? 0))
  }
  const parsed = Date.parse(trimmed)
  return Number.isNaN(parsed) ? null : parsed
}

export function formatWhen(value: string) {
  const ms = parseMessageTimestamp(value)
  if (ms === null) return value
  return new Date(ms).toLocaleString()
}

export function formatMessageListTime(value: string, now = Date.now()) {
  const ms = parseMessageTimestamp(value)
  if (ms === null) return value
  const date = new Date(ms)
  const diffMs = now - ms
  const oneMinute = 60_000
  const oneDay = 86_400_000
  if (diffMs >= 0 && diffMs < oneMinute) return "Just now"
  if (diffMs >= 0 && diffMs < 60 * oneMinute) {
    const minutes = Math.max(1, Math.floor(diffMs / oneMinute))
    return `${minutes}m`
  }
  const today = new Date(now)
  const sameDay = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()
  if (sameDay) return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  const yesterday = new Date(now - oneDay)
  const isYesterday = date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate()
  if (isYesterday) return "Yesterday"
  if (date.getFullYear() === today.getFullYear()) return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}
