"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Icon } from "@/components/icon"
import { ApiError, getBillingStatus, devActivatePro } from "@/lib/api"
import type { BillingStatus } from "@/lib/types/api"
import { hasProBenefits } from "@/lib/plan-access"
import { cn } from "@/lib/utils"

const ease = [0.32, 0.72, 0, 1] as const

type UpgradeModalProps = {
  open: boolean
  onClose: () => void
  onUpgraded?: () => void
}

export function UpgradeModal({ open, onClose, onUpgraded }: UpgradeModalProps) {
  const [status, setStatus] = useState<BillingStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getBillingStatus()
      setStatus(data)
    } catch {
      setError("Could not load billing status.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    void load()
  }, [open, load])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, loading, onClose])

  async function handleDevActivate() {
    const secret = window.prompt("Dev activation secret:")
    if (!secret) return
    try {
      const result = await devActivatePro(secret)
      setStatus(result)
      if (result.can_send) onUpgraded?.()
    } catch {
      setError("Dev activation failed.")
    }
  }

  const isActive = hasProBenefits(status)

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease }}>
          <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-background/90" onClick={() => !loading && onClose()} />
          <motion.div role="dialog" aria-modal="true" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.28, ease }} className="relative w-full max-w-sm rounded-2xl border border-border/50 bg-background px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <Icon icon="ph:ghost" className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Phantom Pro</p>
                <h2 className="mt-1 text-[15px] font-medium tracking-tight">{isActive ? "Pro is active" : "Send mail privately"}</h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {isActive ? "Sending enabled — compose from any alias you own." : "Upgrade to send mail, get unlimited aliases, and block senders."}
                </p>
              </div>
              <button type="button" onClick={() => !loading && onClose()} disabled={loading} className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50" aria-label="Close">
                <Icon icon="ph:x" className="size-3.5" />
              </button>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={onClose} disabled={loading} className="px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50">Close</button>
              {!isActive && process.env.NODE_ENV === "development" && (
                <button type="button" onClick={() => void handleDevActivate()} className="text-[11px] text-muted-foreground underline-offset-2 hover:underline">Dev activate</button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
