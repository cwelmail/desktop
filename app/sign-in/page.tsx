"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Icon } from "@/components/icon"
import { fetchSession } from "@/lib/session"

export default function SignInPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetchSession().then((data) => {
      if (data?.onboarded) router.replace("/inbox")
      else if (data && !data.onboarded) router.replace("/onboarding")
      else setChecking(false)
    }).catch(() => setChecking(false))
  }, [router])

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
        <div className="flex flex-col items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon icon="ph:envelope-simple" className="size-4" /></span>
          <h1 className="text-lg font-semibold tracking-tight">Sign in to aeri</h1>
          <p className="text-center text-sm text-muted-foreground">Enter your 24-digit login key to continue.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); const form = new FormData(e.currentTarget); const key = (form.get("key") as string)?.trim(); if (key) { localStorage.setItem("aeri_session_token", key); router.replace("/onboarding") } }} className="space-y-3">
          <input name="key" autoFocus autoComplete="off" placeholder="xxxx-xxxx-xxxx-xxxx-xxxx-xxxx"
            className="w-full rounded-xl border border-border/70 bg-background/50 px-4 py-2.5 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-accent/35" />
          <button type="submit" className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">Continue</button>
        </form>
      </div>
    </main>
  )
}
