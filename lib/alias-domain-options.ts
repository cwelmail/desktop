import type { CustomDomain } from "@/lib/types/api"

export type AliasDomainOption = {
  value: string
  label: string
  hint?: string
}

/** Active custom domains eligible for alias creation (pending domains excluded). */
export function activeCustomDomainOptions(domains: CustomDomain[]): AliasDomainOption[] {
  return domains
    .filter((entry) => !entry.is_builtin && entry.status === "active")
    .map((entry) => ({
      value: entry.domain,
      label: entry.domain,
      hint: entry.is_shared ? "Shared" : "Custom",
    }))
}
