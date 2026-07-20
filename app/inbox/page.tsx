"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Icon } from "@/components/icon"
import { DesktopInbox } from "@/components/desktop-inbox"
import { ErrorBoundary } from "@/components/error-boundary"
import { fetchSession, type UserSession } from "@/lib/session"

const ease = [0.32, 0.72, 0, 1] as const

export default function InboxPage() {
  const router = useRouter()
  const [session, setSession] = useState<UserSession | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetchSession().then((data) => {
      if (!data) { router.replace("/sign-in"); return }
      if (!data.onboarded) { router.replace("/onboarding"); return }
      setSession(data)
      const timer = window.setTimeout(() => setReady(true), 40)
      return () => window.clearTimeout(timer)
    })
  }, [router])

  if (!ready || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Icon icon="ph:spinner" className="size-5 animate-spin text-accent" />
      </main>
    )
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <ErrorBoundary>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease }} className="flex min-h-0 flex-1 flex-col">
          <DesktopInbox primaryAlias={session.primaryAlias} domain={session.domain} />
        </motion.div>
      </ErrorBoundary>
    </main>
  )
}
