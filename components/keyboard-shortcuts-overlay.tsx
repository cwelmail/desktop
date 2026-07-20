"use client"

import { Icon } from "@/components/icon"

const SHORTCUTS = [
  { keys: ["j", "k"], label: "Move down / up in list" },
  { keys: ["r"], label: "Reply to selected message" },
  { keys: ["f"], label: "Forward selected message" },
  { keys: ["e"], label: "Archive selected message" },
  { keys: ["/"], label: "Focus search" },
  { keys: ["?"], label: "Show this help" },
  { keys: ["Esc"], label: "Close panel or menu" },
] as const

type KeyboardShortcutsOverlayProps = {
  open: boolean
  onClose: () => void
}

export function KeyboardShortcutsOverlay({ open, onClose }: KeyboardShortcutsOverlayProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-xl border border-border/60 bg-card p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label="Keyboard shortcuts"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Keyboard shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <Icon icon="ph:x" className="size-4" />
          </button>
        </div>
        <ul className="space-y-2">
          {SHORTCUTS.map((item) => (
            <li key={item.label} className="flex items-center justify-between gap-3 text-[13px]">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="flex gap-1">
                {item.keys.map((key) => (
                  <kbd
                    key={key}
                    className="rounded border border-border/60 bg-secondary/40 px-1.5 py-0.5 font-mono text-[11px]"
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
