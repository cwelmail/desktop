"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"

export type SendToastEvent =
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; detail?: string }
  | { kind: "dismiss" }

type Listener = (event: SendToastEvent) => void

const listeners = new Set<Listener>()

/** Notify the page-level send toast about send progress. Safe to call from anywhere. */
export function emitSendToast(event: SendToastEvent) {
  for (const listener of listeners) listener(event)
}

const SENT_DISMISS_MS = 4000
const ERROR_DISMISS_MS = 6000

/**
 * Gmail-style status pill fixed at the bottom of the viewport. Mount once per
 * page; it stays up after the compose panel closes so "Message sent." persists.
 */
export function SendToastHost() {
  const [toast, setToast] = useState<SendToastEvent | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const listener: Listener = (event) => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (event.kind === "dismiss") {
        setToast(null)
        return
      }
      setToast(event)
      if (event.kind === "sent" || event.kind === "error") {
        timerRef.current = window.setTimeout(
          () => setToast(null),
          event.kind === "sent" ? SENT_DISMISS_MS : ERROR_DISMISS_MS,
        )
      }
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.kind}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              "pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13px] shadow-lg shadow-black/30",
              "border-border/60 bg-popover text-popover-foreground",
            )}
            role="status"
          >
            {toast.kind === "sending" && (
              <>
                <Icon
                  icon="ph:spinner"
                  className="size-3.5 shrink-0 animate-spin text-muted-foreground"
                  aria-hidden
                />
                <span>Sending&hellip;</span>
              </>
            )}
            {toast.kind === "sent" && (
              <>
                <Icon
                  icon="ph:check-circle"
                  className="size-4 shrink-0 text-accent"
                  aria-hidden
                />
                <span>Message sent.</span>
              </>
            )}
            {toast.kind === "error" && (
              <>
                <Icon
                  icon="ph:warning-circle"
                  className="size-4 shrink-0 text-destructive"
                  aria-hidden
                />
                <span className="min-w-0 truncate">
                  Failed to send.
                  {toast.detail ? (
                    <span className="text-muted-foreground"> {toast.detail}</span>
                  ) : null}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (timerRef.current !== null) {
                      window.clearTimeout(timerRef.current)
                      timerRef.current = null
                    }
                    setToast(null)
                  }}
                  aria-label="Dismiss"
                  className="-mr-1 inline-flex shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon icon="ph:x" className="size-3.5" aria-hidden />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
