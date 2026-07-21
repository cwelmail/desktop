"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Icon } from "@/components/icon"
import { morphEase } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { UpdateCheckResult } from "@/lib/electron"

export function UpdateNotification() {
  const reduced = useReducedMotion()
  const [updateResult, setUpdateResult] = useState<UpdateCheckResult | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [checking, setChecking] = useState(false)
  const [noUpdateMessage, setNoUpdateMessage] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !window.electronAPI) return

    window.electronAPI.onUpdateAvailable((result) => {
      setUpdateResult(result)
      setDismissed(false)
    })

    window.electronAPI.onUpdateCheckResult((result) => {
      setUpdateResult(result)
      setDismissed(false)
      if (result && !result.updateAvailable) {
        setNoUpdateMessage(true)
        setTimeout(() => setNoUpdateMessage(false), 4000)
      }
    })

    window.electronAPI.getUpdateResult().then((result) => {
      if (result?.updateAvailable) {
        setUpdateResult(result)
      }
    })
  }, [])

  const handleCheck = useCallback(async () => {
    if (typeof window === "undefined" || !window.electronAPI) return
    setChecking(true)
    setNoUpdateMessage(false)
    try {
      const result = await window.electronAPI.checkForUpdates()
      if (result) {
        setUpdateResult(result)
        if (!result.updateAvailable) {
          setNoUpdateMessage(true)
          setTimeout(() => setNoUpdateMessage(false), 4000)
        }
      }
    } catch {
      /* ignore */
    } finally {
      setChecking(false)
    }
  }, [])

  const handleDownload = useCallback(() => {
    const url = updateResult?.downloadUrl || updateResult?.releaseUrl || "https://aeri.rest"
    if (typeof window !== "undefined") {
      window.open(url, "_blank")
    }
  }, [updateResult])

  const updateAvailable = updateResult?.updateAvailable && !dismissed

  return (
    <>
      {updateAvailable && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.01 : 0.24, ease: morphEase }}
          onClick={handleDownload}
          className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-[10px] text-accent transition-colors hover:bg-accent/20"
          title={`Download v${updateResult?.latestVersion}`}
        >
          <Icon icon="ph:arrow-circle-down" className="size-3" />
          Update v{updateResult?.latestVersion}
        </motion.button>
      )}

      {!updateAvailable && (
        <button
          type="button"
          onClick={handleCheck}
          disabled={checking}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] transition-colors cursor-pointer",
            noUpdateMessage
              ? "text-green-500/70"
              : "text-muted-foreground/30 hover:text-muted-foreground/60",
          )}
        >
          <Icon
            icon={checking ? "ph:spinner" : noUpdateMessage ? "ph:check-circle" : "ph:arrows-clockwise"}
            className={cn("size-3", checking && "animate-spin")}
          />
          {checking ? "Checking…" : noUpdateMessage ? "Up to date" : "Check for updates"}
        </button>
      )}
    </>
  )
}
