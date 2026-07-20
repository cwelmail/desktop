export const ALIAS_PERMISSIONS = ["view", "blacklist", "send"] as const

export type AliasPermission = (typeof ALIAS_PERMISSIONS)[number]

export const PERMISSION_OPTIONS: {
  id: AliasPermission
  label: string
  shortLabel: string
  description: string
  icon: string
}[] = [
  {
    id: "view",
    label: "View mail",
    shortLabel: "View",
    description: "Read, star, archive, and delete messages in this inbox.",
    icon: "ph:eye",
  },
  {
    id: "blacklist",
    label: "Block senders",
    shortLabel: "Block",
    description: "Block addresses that sent mail to this alias.",
    icon: "ph:prohibit",
  },
  {
    id: "send",
    label: "Send mail",
    shortLabel: "Send",
    description: "Compose and reply from this alias (uses owner's Pro plan).",
    icon: "ph:paper-plane-tilt",
  },
]

export type AliasAccessMeta = {
  isOwner?: boolean
  permissions?: string[]
}

export function canSendFromAlias(
  alias: AliasAccessMeta,
  ownerCanSend: boolean,
): boolean {
  if (alias.isOwner !== false) return ownerCanSend
  return alias.permissions?.includes("send") ?? false
}

export function canBlacklistOnAlias(
  alias: AliasAccessMeta,
  ownerCanBlock: boolean,
): boolean {
  if (alias.isOwner !== false) return ownerCanBlock
  return alias.permissions?.includes("blacklist") ?? false
}

export function sendableAliases<T extends AliasAccessMeta & { handle: string }>(
  aliases: T[],
  ownerCanSend: boolean,
): T[] {
  return aliases.filter((alias) => canSendFromAlias(alias, ownerCanSend))
}
