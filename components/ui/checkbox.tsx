"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"

function Checkbox({
  className,
  checked,
  ...props
}: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked}
      className={cn(
        "group/checkbox inline-flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border border-border/50 bg-background/40 text-accent shadow-none transition-colors outline-none",
        "hover:border-border/80 hover:bg-secondary/30",
        "focus-visible:border-accent/40 focus-visible:ring-2 focus-visible:ring-accent/20",
        "data-checked:border-accent/45 data-checked:bg-accent/10",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-items-center text-current">
        <Icon icon="ph:check-bold" className="size-2.5" aria-hidden />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
