"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { type RealtimeEvent } from "@/lib/realtime"

const API_BASE = "https://api.aeri.rest/api/v1"
const MAX_RETRIES = 10
const BASE_RETRY_MS = 3000
const MAX_RETRY_MS = 60000

export type RealtimeHandlers = {
  onInboxChanged?: () => void
  onAliasesChanged?: () => void
  onBillingChanged?: () => void
}

export function useRealtime({ onInboxChanged, onAliasesChanged, onBillingChanged }: RealtimeHandlers) {
  const [connected, setConnected] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)

  const handlersRef = useRef({ onInboxChanged, onAliasesChanged, onBillingChanged })
  useEffect(() => {
    handlersRef.current = { onInboxChanged, onAliasesChanged, onBillingChanged }
  }, [onInboxChanged, onAliasesChanged, onBillingChanged])

  const dispatch = useCallback((event: RealtimeEvent) => {
    if (event === "connected") return
    if (event === "inbox.changed") handlersRef.current.onInboxChanged?.()
    if (event === "aliases.changed") handlersRef.current.onAliasesChanged?.()
    if (event === "billing.changed") handlersRef.current.onBillingChanged?.()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    let cancelled = false
    let source: EventSource | null = null
    let retryTimer: ReturnType<typeof window.setTimeout> | undefined
    let retries = 0

    async function checkTokenValid(): Promise<boolean> {
      const token = localStorage.getItem("aeri_session_token")
      if (!token) return false
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        return res.ok
      } catch {
        return true
      }
    }

    function openSse() {
      if (cancelled) return
      const token = localStorage.getItem("aeri_session_token")
      if (!token) {
        setConnected(false)
        setReconnecting(false)
        return
      }
      const url = `${API_BASE}/events/stream?token=${encodeURIComponent(token)}`
      source = new EventSource(url)

      source.addEventListener("open", () => {
        setConnected(true)
        setReconnecting(false)
        retries = 0
      })

      const events: RealtimeEvent[] = ["inbox.changed", "aliases.changed", "billing.changed"]
      for (const event of events) {
        source.addEventListener(event, () => { dispatch(event) })
      }
      source.addEventListener("new_message", () => { dispatch("inbox.changed") })

      source.onerror = () => {
        setConnected(false)
        source?.close()
        source = null
        if (cancelled) return
        retries++
        void checkTokenValid().then((valid) => {
          if (cancelled) return
          if (!valid) {
            localStorage.removeItem("aeri_session_token")
            setReconnecting(false)
            window.location.href = "/sign-in"
            return
          }
          if (retries >= MAX_RETRIES) {
            retries = 0
            retryTimer = window.setTimeout(connect, BASE_RETRY_MS)
            return
          }
          const delay = Math.min(BASE_RETRY_MS * Math.pow(1.5, retries - 1), MAX_RETRY_MS)
          setReconnecting(true)
          retryTimer = window.setTimeout(connect, delay)
        })
      }
    }

    function connect() {
      source?.close()
      source = null
      if (retryTimer) window.clearTimeout(retryTimer)
      openSse()
    }

    connect()
    return () => {
      cancelled = true
      if (retryTimer) window.clearTimeout(retryTimer)
      source?.close()
      setConnected(false)
      setReconnecting(false)
    }
  }, [dispatch])

  return { connected, reconnecting }
}
