export type MessageKind = "welcome" | "security" | "newsletter" | "verification" | "general"

export type DemoAttachment = {
  id: string
  filename: string
  contentType: string
  size: number
}

export type DemoMessage = {
  id: string
  from: string
  senderName?: string | null
  envelopeSender?: string | null
  to?: string | null
  subject: string
  preview: string
  body: string
  bodyHtml?: string | null
  receivedAt: string
  unread: boolean
  alias: string
  kind: MessageKind
  starred?: boolean
  direction?: "inbound" | "sent"
  deliveryStatus?: "pending" | "sent" | "failed" | null
  deleted?: boolean
  hasAttachments?: boolean
  messageIdHeader?: string | null
  referencesHeader?: string | null
  attachments?: DemoAttachment[]
}

export type DemoAlias = {
  id: string
  handle: string
  label: string
  icon: string
  unread: number
  expiresAt?: string | null
  shared?: boolean
  isOwner?: boolean
  permissions?: string[]
}

export type InboxView = "inbox" | "starred" | "archive" | "sent" | "trash"
export type ListDensity = "comfortable" | "compact"

const AVATAR_COLORS = [
  "bg-rose-500/80", "bg-violet-500/80", "bg-sky-500/80", "bg-emerald-500/80",
  "bg-amber-500/80", "bg-pink-500/80", "bg-indigo-500/80", "bg-teal-500/80",
  "bg-orange-500/80", "bg-cyan-500/80", "bg-fuchsia-500/80", "bg-lime-500/80",
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  return Math.abs(hash)
}

export function senderColor(from: string): string {
  return AVATAR_COLORS[hashString(from) % AVATAR_COLORS.length]
}

export function senderDisplayName(from: string, senderName?: string | null): string {
  if (senderName) return senderName
  const local = from.split("@")[0] ?? from
  return local.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 32)
}
