import { getApiBase } from "@/lib/config"

export type UserSession = {
  accountId: string
  primaryAlias: string
  domain: string
  onboarded: true
}

export type SessionState =
  | UserSession
  | { authenticated: true; onboarded: false; accountId: string }
  | null

function canUseStorage() {
  return typeof window !== "undefined"
}

export async function fetchSession(): Promise<SessionState> {
  if (!canUseStorage()) return null
  const token = localStorage.getItem("aeri_session_token")
  if (!token) return null

  try {
    const response = await fetch(`${getApiBase()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) {
      localStorage.removeItem("aeri_session_token")
      return null
    }
    const account = await response.json() as {
      account_id: string
      primary_alias: string | null
      domain: string | null
    }
    const onboarded = Boolean(account.primary_alias && account.domain)
    if (onboarded && account.primary_alias && account.domain) {
      return {
        accountId: account.account_id,
        primaryAlias: account.primary_alias,
        domain: account.domain,
        onboarded: true,
      }
    }
    return { authenticated: true, onboarded: false, accountId: account.account_id }
  } catch {
    return null
  }
}

export async function establishSession(accountCode: string): Promise<void> {
  const response = await fetch(`${getApiBase()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_code: accountCode }),
  })

  if (!response.ok) {
    let body: unknown
    try { body = await response.json() } catch { body = undefined }
    throw new SessionError("Login failed", response.status, body)
  }

  const data = await response.json() as { access_token: string; expires_in: number }
  localStorage.setItem("aeri_session_token", data.access_token)
  localStorage.setItem("aerimail_account_code", accountCode)
}

export async function logoutSession(): Promise<void> {
  localStorage.removeItem("aeri_session_token")
  localStorage.removeItem("aerimail_account_code")
}

export function getStoredAccountCode(): string | null {
  if (!canUseStorage()) return null
  return localStorage.getItem("aerimail_account_code")
}

export function storeAccountCode(code: string) {
  if (canUseStorage()) localStorage.setItem("aerimail_account_code", code)
}

export class SessionError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message)
    this.name = "SessionError"
  }
}
