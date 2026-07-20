"use client"

import { useEffect, useId, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Icon } from "@/components/icon"
import {
  formatAccountCode,
  isValidAccountCode,
  normalizeAccountCode,
  PLACEHOLDER_LOGIN_KEY,
} from "@/lib/account-code"
import { BRAND_NAME } from "@/lib/brand"
import { establishSession, fetchSession, SessionError } from "@/lib/session"
import { cn } from "@/lib/utils"

const ease = [0.32, 0.72, 0, 1] as const
const morph = { duration: 0.45, ease } as const

export default function OnboardingPage() {
  const router = useRouter()
  const inputId = useId()
  const [digits, setDigits] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [entered, setEntered] = useState(false)
  const formatted = digits ? formatAccountCode(digits) : ""
  const canSubmit = isValidAccountCode(digits)

  useEffect(() => {
    fetchSession().then((session) => {
      if (session?.onboarded) { router.replace("/inbox"); return }
      if (session && "authenticated" in session && session.authenticated) { router.replace("/inbox"); return }
      window.setTimeout(() => setEntered(true), 40)
    })
  }, [router])

  function handleCodeChange(value: string) { setError(null); setDigits(normalizeAccountCode(value)) }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit || loading) return
    setLoading(true); setError(null)
    try { await establishSession(formatAccountCode(digits)); router.replace("/inbox") }
    catch (err) {
      setError(
        err instanceof SessionError && err.status === 401 ? "Invalid login key. Check the 24 digits and try again."
        : err instanceof SessionError ? "Could not sign in. The server may be unreachable."
        : "Something went wrong. Try again.",
      )
    } finally { setLoading(false) }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-10 text-foreground">
      <div className="grain pointer-events-none fixed inset-0 z-0 opacity-25" />
      <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 z-0 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        animate={{ opacity: entered ? [0.28, 0.44, 0.28] : 0, scale: entered ? [0.94, 1.02, 0.94] : 0.85 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle, color-mix(in oklch, var(--accent) 18%, transparent) 0%, transparent 70%)" }} />
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 20, scale: entered ? 1 : 0.98 }} transition={morph} className="relative z-10 w-full max-w-md">
        <div className="mb-8 inline-flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon icon="ph:shield-check-fill" className="size-4" /></span>
          <span className="text-lg font-semibold tracking-tight">{BRAND_NAME}</span>
        </div>
        <div className="mb-6">
          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">Welcome to <span className="font-serif-italic font-normal text-accent">{BRAND_NAME}</span></h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Enter your 24-digit login key to get started. No password, no email — just the key you saved when you created your account.</p>
        </div>
        <div className="rounded-[1.375rem] p-0.5 bg-background/30 ring-1 ring-border/70">
          <form onSubmit={handleSubmit} className="rounded-[1.25rem] border border-border/70 bg-card/90 p-5 shadow-[inset_0_1px_0_oklch(1_0_0/5%)] backdrop-blur-xl sm:p-6">
            <label htmlFor={inputId} className="text-xs font-medium text-muted-foreground">Login key</label>
            <div className={cn("mt-2 flex items-center gap-2 rounded-xl border bg-background/40 px-3 py-3 transition-[border-color,box-shadow] duration-200", error ? "border-destructive/50" : "border-border/70 focus-within:border-accent/35 focus-within:shadow-[inset_0_1px_0_oklch(1_0_0/6%),0_0_0_1px_color-mix(in_oklch,var(--accent)_12%,transparent)]")}>
              <Icon icon="ph:key" className="size-4 shrink-0 text-accent/80" />
              <input id={inputId} type="text" inputMode="numeric" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                value={formatted} onChange={(e) => handleCodeChange(e.target.value)} placeholder={PLACEHOLDER_LOGIN_KEY}
                className="min-w-0 flex-1 bg-transparent font-mono text-sm tracking-[0.12em] text-foreground outline-none placeholder:text-muted-foreground/40"
                aria-invalid={Boolean(error)} aria-describedby={error ? "onboard-error" : undefined} autoFocus />
            </div>
            {error ? <p id="onboard-error" className="mt-2 text-xs text-destructive" role="alert">{error}</p> : <p className="mt-2 text-[11px] text-muted-foreground/75">{digits.length}/24 digits</p>}
            <button type="submit" disabled={!canSubmit || loading}
              className={cn("mt-5 h-11 w-full rounded-full bg-accent text-accent-foreground", "shadow-[0_0_0_1px_color-mix(in_oklch,var(--accent)_35%,transparent),0_12px_32px_-16px_color-mix(in_oklch,var(--accent)_42%,transparent)]", "transition-[transform,opacity] duration-150 ease-out hover:bg-accent/90 active:scale-[0.97]", "disabled:pointer-events-none disabled:opacity-50")}>
              {loading ? <span className="inline-flex items-center gap-2"><span className="size-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" /> Logging in…</span> : "Log in"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground/60">Your login key is the only way to access your account. Keep it safe.</p>
      </motion.div>
    </main>
  )
}
