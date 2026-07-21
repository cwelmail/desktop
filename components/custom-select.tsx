"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Icon } from "@/components/icon"
import { morphEase } from "@/lib/motion"
import { cn } from "@/lib/utils"

const ease = morphEase

export type SelectOption = {
  value: string
  label: string
  hint?: string
}

type CustomSelectProps = {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  disabled?: boolean
  ariaLabel?: string
  className?: string
  mono?: boolean
}

export function CustomSelect({
  value,
  onChange,
  options,
  disabled = false,
  ariaLabel,
  className,
  mono = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border border-border/50 bg-background/40 px-2.5 py-2 text-left transition-colors",
          "hover:border-border/80 focus:border-accent/30 focus:outline-none",
          open && "border-accent/30",
          disabled && "pointer-events-none opacity-50",
          mono ? "font-mono text-[12px]" : "text-[13px]",
        )}
      >
        <span className="min-w-0 truncate">{selected?.label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease }}
          className="shrink-0 text-muted-foreground"
        >
          <Icon icon="ph:caret-down" className="size-3.5" aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16, ease }}
            className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-border/60 bg-background p-0.5"
          >
            {options.map((option) => {
              const active = option.value === value
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
                      active
                        ? "bg-secondary/60 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
                      mono ? "font-mono text-[12px]" : "text-[13px]",
                    )}
                  >
                    <span className="min-w-0 truncate">{option.label}</span>
                    {option.hint && (
                      <span className="shrink-0 text-[10px] text-muted-foreground/80">
                        {option.hint}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
