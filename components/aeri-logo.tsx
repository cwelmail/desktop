import { cn } from "@/lib/utils"

type AeriLogoProps = {
  className?: string
  title?: string
}

/** Brand mark — inherits `currentColor`. */
export function AeriLogo({ className, title = "aeri" }: AeriLogoProps) {
  return (
    <svg
      viewBox="0 0 635 281"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("aspect-[635/281]", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        d="M263.104 281C264.69 281 266.208 280.352 267.305 279.207L437.784 101.195C441.921 96.8749 449.101 100.865 447.616 106.658L412.208 244.872C409.066 257.136 418.331 269.071 430.992 269.071H552.688C561.545 269.071 569.276 263.072 571.474 254.494L634.815 7.25716C635.757 3.57844 632.979 8.90364e-06 629.182 8.90364e-06H489.993C489.886 8.90364e-06 489.78 0.00580769 489.676 0.00726115C489.545 0.00435422 489.413 8.90364e-06 489.28 8.90364e-06H264.366C257.509 8.90364e-06 250.932 2.72379 246.083 7.57255L5.71835 247.901C-6.49742 260.115 2.15458 280.999 19.4303 281H263.104Z"
        fill="currentColor"
      />
    </svg>
  )
}
