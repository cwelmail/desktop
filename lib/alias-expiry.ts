export type AliasExpiry = "1h" | "6h" | "24h" | "3d" | "7d" | "30d" | "never"

export type AliasExpiryOption = {
  value: AliasExpiry
  label: string
  shortLabel: string
  icon: string
}

export const ALIAS_EXPIRY_OPTIONS: AliasExpiryOption[] = [
  { value: "1h", label: "1 hour", shortLabel: "1h", icon: "ph:clock" },
  { value: "6h", label: "6 hours", shortLabel: "6h", icon: "ph:clock-countdown" },
  { value: "24h", label: "24 hours", shortLabel: "24h", icon: "ph:sun-horizon" },
  { value: "3d", label: "3 days", shortLabel: "3d", icon: "ph:calendar-blank" },
  { value: "7d", label: "7 days", shortLabel: "7d", icon: "ph:calendar" },
  { value: "30d", label: "30 days", shortLabel: "30d", icon: "ph:calendar-check" },
  { value: "never", label: "Never", shortLabel: "∞", icon: "ph:infinity" },
]

export const TEMPORARY_ALIAS_EXPIRY_OPTIONS = ALIAS_EXPIRY_OPTIONS.filter(
  (option) => option.value !== "never",
)

export const DEFAULT_TEMPORARY_EXPIRY: AliasExpiry = "24h"
