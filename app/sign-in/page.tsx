"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Icon } from "@/components/icon"
import { AeriLogo } from "@/components/aeri-logo"
import {
  formatAccountCode,
  isValidAccountCode,
  normalizeAccountCode,
  PLACEHOLDER_LOGIN_KEY,
} from "@/lib/account-code"
import { establishSession, fetchSession, SessionError } from "@/lib/session"
import { cn } from "@/lib/utils"

export default function SignInPage() {
  const router = useRouter()
  const inputId = useId()
  const totpInputId = useId()
  const totpInputRef = useRef<HTMLInputElement>(null)
  const [checking, setChecking] = useState(true)
  const [digits, setDigits] = useState("")
  const [totpCode, setTotpCode] = useState("")
  const [showTotp, setShowTotp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formatted = digits ? formatAccountCode(digits) : ""
  const canSubmit = isValidAccountCode(digits) && !showTotp

  useEffect(() => {
    fetchSession().then((data) => {
      if (data?.onboarded) router.replace("/inbox")
      else if (data && !data.onboarded) router.replace("/onboarding")
      else setChecking(false)
    }).catch(() => setChecking(false))
  }, [router])

  useEffect(() => {
    if (showTotp) totpInputRef.current?.focus()
  }, [showTotp])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (showTotp) {
      if (!totpCode.trim() || loading) return
      setLoading(true)
      setError(null)
      try {
        await establishSession(formatAccountCode(digits), totpCode.trim())
        router.replace("/inbox")
      } catch (err) {
        setError(
          err instanceof SessionError && err.status === 401
            ? "Invalid authentication code. Try again."
            : err instanceof SessionError
              ? "Could not sign in. The server may be unreachable."
              : "Something went wrong. Try again.",
        )
        setTotpCode("")
      } finally {
        setLoading(false)
      }
      return
    }

    if (!canSubmit || loading) return
    setLoading(true)
    setError(null)
    try {
      const result = await establishSession(formatAccountCode(digits))
      if (result.totp_required) {
        setShowTotp(true)
        setLoading(false)
        return
      }
      router.replace("/inbox")
    } catch (err) {
      setError(
        err instanceof SessionError && err.status === 401
          ? "Invalid login key. Check the 24 digits and try again."
          : err instanceof SessionError
            ? "Could not sign in. The server may be unreachable."
            : "Something went wrong. Try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Icon icon="ph:spinner" className="size-5 animate-spin text-accent" />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-4">
          <AeriLogo className="h-7 w-auto text-foreground" />
          <div className="space-y-1.5 text-center">
            <h1 className="text-lg font-semibold tracking-tight">
              {showTotp ? "Two-factor authentication" : "Sign in"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {showTotp
                ? "Enter the 6-digit code from your authenticator app."
                : "Enter your 24-digit login key to continue."}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {showTotp ? (
            <input
              ref={totpInputRef}
              id={totpInputId}
              name="totp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={totpCode}
              onChange={(e) => {
                setError(null)
                setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }}
              placeholder="000000"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "signin-error" : undefined}
              className={cn(
                "w-full rounded-xl border bg-background/50 px-4 py-2.5 text-center font-mono text-lg tracking-[0.2em] text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-accent/35",
                error ? "border-destructive/50" : "border-border/70",
              )}
            />
          ) : (
            <input
              id={inputId}
              name="key"
              type="text"
              inputMode="numeric"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={formatted}
              onChange={(e) => {
                setError(null)
                setDigits(normalizeAccountCode(e.target.value))
              }}
              placeholder={PLACEHOLDER_LOGIN_KEY}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "signin-error" : undefined}
              className={cn(
                "w-full rounded-xl border bg-background/50 px-4 py-2.5 font-mono text-sm tracking-[0.12em] text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-accent/35",
                error ? "border-destructive/50" : "border-border/70",
              )}
            />
          )}
          {error ? (
            <p id="signin-error" className="text-xs text-destructive" role="alert">{error}</p>
          ) : showTotp ? (
            <p className="text-[11px] text-muted-foreground/75">Authenticator code</p>
          ) : (
            <p className="text-[11px] text-muted-foreground/75">{digits.length}/24 digits</p>
          )}
          <button
            type="submit"
            disabled={loading || (showTotp ? totpCode.length !== 6 : !canSubmit)}
            className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                {showTotp ? "Verifying…" : "Signing in…"}
              </span>
            ) : showTotp ? (
              "Verify"
            ) : (
              "Continue"
            )}
          </button>
          {showTotp && (
            <button
              type="button"
              onClick={() => {
                setShowTotp(false)
                setTotpCode("")
                setError(null)
              }}
              className="w-full text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Back to login key
            </button>
          )}
        </form>
      </div>
    </main>
  )
}
