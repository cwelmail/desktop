"use client"

import { useEffect } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Icon } from "@/components/icon"
import { morphEase } from "@/lib/motion"
import { cn } from "@/lib/utils"

const ease = morphEase

type ConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  icon?: string
  variant?: "default" | "destructive"
  highlight?: string
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon,
  variant = "default",
  highlight,
}: ConfirmModalProps) {
  const reduced = useReducedMotion()
  const destructive = variant === "destructive"

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, loading, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <motion.button
            type="button"
            aria-label="Close dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.2, ease }}
            className="absolute inset-0 bg-background/90"
            onClick={() => !loading && onClose()}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : 6 }}
            transition={{ duration: reduced ? 0.01 : 0.28, ease }}
            className="relative w-full max-w-sm rounded-2xl border border-border/50 bg-background px-5 py-5 sm:px-6"
          >
            <div className="flex items-start gap-3">
              {icon && (
                <Icon
                  icon={icon}
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    destructive ? "text-destructive" : "text-muted-foreground",
                  )}
                  aria-hidden
                />
              )}
              <div className="min-w-0 flex-1">
                <h2
                  id="confirm-modal-title"
                  className="text-[15px] font-medium tracking-tight"
                >
                  {title}
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {description}
                </p>
                {highlight && (
                  <p className="mt-3 truncate font-mono text-[12px] text-foreground/80">
                    {highlight}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors disabled:opacity-50",
                  destructive
                    ? "border-destructive/40 text-destructive hover:bg-destructive/10"
                    : "border-accent/30 text-accent hover:bg-accent/[0.08]",
                )}
              >
                {loading && (
                  <Icon icon="ph:spinner" className="size-3.5 animate-spin" aria-hidden />
                )}
                {loading ? "Working…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
