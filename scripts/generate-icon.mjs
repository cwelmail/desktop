#!/usr/bin/env node

import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const PUBLIC = join(import.meta.dirname, "..", "public")
const ELECTRON = join(import.meta.dirname, "..", "electron")

const LOGO_PATH =
  "M263.104 281C264.69 281 266.208 280.352 267.305 279.207L437.784 101.195C441.921 96.8749 449.101 100.865 447.616 106.658L412.208 244.872C409.066 257.136 418.331 269.071 430.992 269.071H552.688C561.545 269.071 569.276 263.072 571.474 254.494L634.815 7.25716C635.757 3.57844 632.979 8.90364e-06 629.182 8.90364e-06H489.993C489.886 8.90364e-06 489.78 0.00580769 489.676 0.00726115C489.545 0.00435422 489.413 8.90364e-06 489.28 8.90364e-06H264.366C257.509 8.90364e-06 250.932 2.72379 246.083 7.57255L5.71835 247.901C-6.49742 260.115 2.15458 280.999 19.4303 281H263.104Z"

const logoSvg = `<svg width="635" height="281" viewBox="0 0 635 281" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="${LOGO_PATH}" fill="currentColor"/>
</svg>
`

/** Square app icon: dark rounded tile + white mark. */
const iconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#0A0A0B"/>
  <g transform="translate(48, 144) scale(0.656)">
    <path d="${LOGO_PATH}" fill="#FFFFFF"/>
  </g>
</svg>
`

function traySvg(size, fill) {
  const pad = Math.round(size * 0.09)
  const scale = (size - pad * 2) / 635
  const logoH = 281 * scale
  const ty = (size - logoH) / 2
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${pad}, ${ty}) scale(${scale})">
    <path d="${LOGO_PATH}" fill="${fill}"/>
  </g>
</svg>`
}

writeFileSync(join(PUBLIC, "logo.svg"), logoSvg)
writeFileSync(join(PUBLIC, "icon.svg"), iconSvg)
console.log("Wrote logo.svg and icon.svg")

let Resvg
try {
  Resvg = require("@resvg/resvg-js").Resvg
} catch {
  console.log("Skipping PNG render (@resvg/resvg-js not installed). Run: npm i -D @resvg/resvg-js")
  process.exit(0)
}

function renderPng(svg, outPath, width) {
  const png = new Resvg(Buffer.from(svg), { fitTo: { mode: "width", value: width } }).render().asPng()
  writeFileSync(outPath, png)
  console.log("Wrote", outPath)
}

renderPng(iconSvg, join(PUBLIC, "icon.png"), 512)
// Menu bar: Electron needs real PNGs — SVG buffers render as empty images.
renderPng(traySvg(44, "#000000"), join(ELECTRON, "trayTemplate.png"), 44)
renderPng(traySvg(44, "#22C55E"), join(ELECTRON, "trayUnread.png"), 44)
