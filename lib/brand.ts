export const BRAND_NAME = "aeri"
export const PRIMARY_DOMAIN = "aeri.rest"

export const BUILTIN_DOMAINS = [
  { value: "aeri.rest", label: "aeri.rest" },
  { value: "cwel.rest", label: "cwel.rest" },
  { value: "mail.cwel.rest", label: "mail.cwel.rest" },
  { value: "shadow.cwel.rest", label: "shadow.cwel.rest" },
] as const

export type BuiltinDomain = (typeof BUILTIN_DOMAINS)[number]["value"]
