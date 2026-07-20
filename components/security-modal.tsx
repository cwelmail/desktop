"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Icon } from "@/components/icon"
import {
  disableTotp,
  enableTotp,
  getApiErrorDetail,
  getTotpStatus,
  setupTotp,
} from "@/lib/api"
import { morphEase } from "@/lib/motion"
import { cn } from "@/lib/utils"

type TotpSetupData = {
  secret: string
  qrcode_svg: string
  recovery_codes: string[]
}

type SecurityModalProps = {
  open: boolean
  onClose: () => void
}

export function SecurityModal({ open, onClose }: SecurityModalProps) {
  const reduced = useReducedMotion()
  const [status, setStatus] = useState<{ enabled: boolean; enabled_at: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [setupData, setSetupData] = useState<TotpSetupData | null>(null)
  const [code, setCode] = useState("")
  const [enabling, setEnabling] = useState(false)
  const [disabling, setDisabling] = useState(false)
  const [settingUp, setSettingUp] = useState(false)
  const [showRecovery, setShowRecovery] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStatus = useCallback(async () => {
    setLoading(true)
    try {
      setStatus(await getTotpStatus())
    } catch {
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setSetupData(null)
    setCode("")
    setShowRecovery(false)
    setError(null)
    void loadStatus()
  }, [open, loadStatus])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !enabling && !disabling && !settingUp) onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, enabling, disabling, settingUp, onClose])

  async function handleSetup() {
    setError(null)
    setSettingUp(true)
    setSetupData(null)
    setShowRecovery(false)
    try {
      setSetupData(await setupTotp())
    } catch (err) {
      setError(getApiErrorDetail(err, "Could not start 2FA setup."))
    } finally {
      setSettingUp(false)
    }
  }

  async function handleEnable() {
    if (code.length !== 6) return
    setEnabling(true)
    setError(null)
    try {
      await enableTotp(code)
      setSetupData(null)
      setCode("")
      setShowRecovery(false)
      setStatus({ enabled: true, enabled_at: new Date().toISOString() })
    } catch (err) {
      setError(getApiErrorDetail(err, "Could not enable 2FA. Check your code."))
    } finally {
      setEnabling(false)
    }
  }

  async function handleDisable() {
    setDisabling(true)
    setError(null)
    try {
      await disableTotp()
      setStatus({ enabled: false, enabled_at: null })
    } catch (err) {
      setError(getApiErrorDetail(err, "Could not disable 2FA."))
    } finally {
      setDisabling(false)
    }
  }

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
            transition={{ duration: reduced ? 0.01 : 0.2, ease: morphEase }}
            className="absolute inset-0 bg-background/90"
            onClick={() => !enabling && !disabling && !settingUp && onClose()}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="security-modal-title"
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : 6 }}
            transition={{ duration: reduced ? 0.01 : 0.28, ease: morphEase }}
            className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/50 bg-background px-5 py-5 sm:px-6"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Icon icon="ph:shield-check" className="mt-0.5 size-4 shrink-0 text-accent" />
                <div>
                  <h2 id="security-modal-title" className="text-sm font-semibold tracking-tight">
                    Security
                  </h2>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Protect your account with an authenticator app.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close"
              >
                <Icon icon="ph:x" className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/40 px-3 py-2.5">
                <div>
                  <p className="text-sm">Two-factor authentication</p>
                  <p className="text-[11px] text-muted-foreground">
                    {loading
                      ? "Loading…"
                      : status?.enabled
                        ? "Enabled — required at sign-in"
                        : "Add an extra layer of security"}
                  </p>
                </div>
                {!loading && (
                  status?.enabled ? (
                    <button
                      type="button"
                      disabled={disabling}
                      onClick={() => void handleDisable()}
                      className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-destructive/30 hover:text-destructive disabled:opacity-50"
                    >
                      <Icon
                        icon={disabling ? "ph:spinner" : "ph:x"}
                        className={cn("size-3.5", disabling && "animate-spin")}
                      />
                      {disabling ? "Disabling…" : "Disable"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={settingUp}
                      onClick={() => void handleSetup()}
                      className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-accent/25 hover:text-foreground disabled:opacity-50"
                    >
                      <Icon
                        icon={settingUp ? "ph:spinner" : "ph:qrcode"}
                        className={cn("size-3.5", settingUp && "animate-spin")}
                      />
                      {settingUp ? "Preparing…" : "Set up"}
                    </button>
                  )
                )}
              </div>

              {setupData && (
                <div className="space-y-3 rounded-xl border border-border/50 bg-background/40 p-4">
                  <div
                    className="mx-auto flex justify-center rounded-xl bg-white p-4 [&_svg]:h-40 [&_svg]:w-40"
                    dangerouslySetInnerHTML={{ __html: setupData.qrcode_svg }}
                  />
                  <p className="text-center text-[11px] text-muted-foreground">
                    Scan with your authenticator app, or enter this secret manually:
                  </p>
                  <p className="break-all text-center font-mono text-xs tracking-wider text-muted-foreground">
                    {setupData.secret}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="000000"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="flex-1 rounded-md border border-border/60 bg-background px-3 py-1.5 text-center font-mono text-sm tracking-[0.2em] placeholder:text-muted-foreground/40 focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={code.length !== 6 || enabling}
                      onClick={() => void handleEnable()}
                      className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1.5 text-[11px] text-foreground transition-colors hover:border-accent/25 disabled:opacity-40"
                    >
                      <Icon
                        icon={enabling ? "ph:spinner" : "ph:check"}
                        className={cn("size-3.5", enabling && "animate-spin")}
                      />
                      {enabling ? "Verifying…" : "Verify & enable"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRecovery((v) => !v)}
                    className="w-full text-center text-[10px] text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    {showRecovery ? "Hide recovery codes" : "Show recovery codes"}
                  </button>
                  {showRecovery && (
                    <div className="rounded-md border border-border/40 bg-background/50 p-3">
                      <p className="mb-2 text-[10px] text-muted-foreground">
                        Save these codes somewhere safe. Each can be used once if you lose your authenticator.
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {setupData.recovery_codes.map((recoveryCode) => (
                          <code
                            key={recoveryCode}
                            className="rounded bg-background/80 px-2 py-1 font-mono text-[11px]"
                          >
                            {recoveryCode}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <p className="text-[11px] text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
