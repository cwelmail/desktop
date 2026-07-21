"use client"

import { useEffect } from "react"

export function PlatformDetect() {
  useEffect(() => {
    let platform = "darwin"
    const ua = navigator.platform || navigator.userAgent
    if (/Win|win32/i.test(ua)) platform = "win32"

    try {
      const api = (window as Record<string, unknown>).electronAPI as
        | { getPlatform: () => Promise<string> }
        | undefined
      if (api?.getPlatform) {
        api.getPlatform().then((p: string) => {
          document.documentElement.setAttribute("data-platform", p)
        })
        return
      }
    } catch {
      /* fall back to UA detection */
    }

    document.documentElement.setAttribute("data-platform", platform)
  }, [])

  return null
}
