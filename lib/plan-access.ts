import type { BillingStatus } from "@/lib/types/api"

export const PLAN_CIPHER = "cipher" as const
export const PLAN_PRO = "pro" as const

export function isPaidPlan(plan?: string | null) {
  return plan === PLAN_PRO || plan === PLAN_CIPHER
}

export function isCipherPlan(subscriptionPlan?: string | null) {
  return subscriptionPlan === PLAN_CIPHER
}

/** Pro and Cipher both include Phantom (Pro) benefits such as custom alias names. */
export function hasProBenefits(
  status?: Pick<
    BillingStatus,
    "plan" | "subscription_plan" | "can_block_senders" | "max_aliases"
  > | null,
) {
  if (!status) return false
  if (isPaidPlan(status.subscription_plan) || isPaidPlan(status.plan)) return true
  if (status.can_block_senders) return true
  if (status.max_aliases === null) return true
  return false
}

export function canCustomizeAliases(
  status?: Pick<
    BillingStatus,
    "plan" | "subscription_plan" | "can_block_senders" | "max_aliases"
  > | null,
) {
  return hasProBenefits(status)
}

export function canShareInbox(status?: Pick<BillingStatus, "can_share_inbox" | "subscription_plan"> | null) {
  if (!status) return false
  if (status.can_share_inbox) return true
  return isCipherPlan(status.subscription_plan)
}

export function canUseCustomDomains(
  status?: Pick<
    BillingStatus,
    "can_use_custom_domains" | "subscription_plan" | "billing_enabled"
  > | null,
) {
  if (!status) return false
  if (status.billing_enabled === false) return true
  if (status.can_use_custom_domains) return true
  return isCipherPlan(status.subscription_plan)
}

export function canUseApi(
  status?: Pick<BillingStatus, "can_use_api" | "subscription_plan"> | null,
) {
  if (!status) return false
  if (status.can_use_api) return true
  return isCipherPlan(status.subscription_plan)
}

export function canSendHtml(
  status?: Pick<BillingStatus, "can_send_html" | "subscription_plan"> | null,
) {
  if (!status) return false
  if (status.can_send_html) return true
  return isCipherPlan(status.subscription_plan)
}

export function canUseSecureLink(
  status?: Pick<BillingStatus, "can_use_secure_link" | "subscription_plan"> | null,
) {
  if (!status) return false
  if (status.can_use_secure_link) return true
  return isCipherPlan(status.subscription_plan)
}
