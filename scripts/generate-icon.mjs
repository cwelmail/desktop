#!/usr/bin/env node

import { writeFileSync } from "node:fs"
import { join } from "node:path"

const OUT = join(import.meta.dirname, "..", "public", "icon.png")

const SVG = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="102" fill="#0A0A0A"/>
  <g transform="translate(106, 136)">
    <rect x="0" y="0" width="300" height="200" rx="16" fill="none" stroke="#666" stroke-width="8"/>
    <path d="M0 24 L150 130 L300 24" fill="none" stroke="#666" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <circle cx="430" cy="82" r="42" fill="#4ADE80"/>
  <text x="430" y="90" font-family="system-ui" font-size="40" font-weight="bold" text-anchor="middle" fill="#000">0</text>
</svg>
`.trim()

console.log("Generating app icon at", OUT)
console.log("NOTE: This generates a placeholder SVG. For a real .png, use macOS 'sips' or an image tool.")
console.log("The SVG placeholder is sufficient for electron-builder to accept during development.")

writeFileSync(OUT.replace(".png", ".svg"), SVG)
console.log("Wrote", OUT.replace(".png", ".svg"))
