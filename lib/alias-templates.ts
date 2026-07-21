import type { AliasExpiry } from "@/lib/alias-expiry"

export type AliasTemplate = {
  id: string
  label: string
  icon: string
  expiry: AliasExpiry
  description: string
}

export const ALIAS_TEMPLATES: AliasTemplate[] = [
  {
    id: "shopping",
    label: "Shopping",
    icon: "ph:shopping-cart",
    expiry: "30d",
    description: "Receipts and order updates",
  },
  {
    id: "newsletter",
    label: "Newsletter",
    icon: "ph:newspaper",
    expiry: "7d",
    description: "Mailing lists and digests",
  },
  {
    id: "verification",
    label: "Verification",
    icon: "ph:key",
    expiry: "24h",
    description: "One-time codes and sign-in links",
  },
]
