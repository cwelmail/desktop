"use client"

import { Component, type ReactNode } from "react"
import { Icon } from "@/components/icon"

type Props = { children: ReactNode; fallbackTitle?: string }
type State = { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[aeri] ErrorBoundary caught:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-8 text-center">
          <Icon icon="ph:warning-circle" className="size-10 text-destructive" />
          <h1 className="text-lg font-medium tracking-tight">
            {this.props.fallbackTitle ?? "Something went wrong"}
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="rounded-full border border-accent/30 bg-accent/[0.1] px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/[0.16]"
          >
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
