"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchSession } from "@/lib/session"

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    fetchSession().then((session) => {
      if (session?.onboarded) {
        router.replace("/inbox")
      } else {
        router.replace("/onboarding")
      }
    })
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="size-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </main>
  )
}
