#!/usr/bin/env node

// paints build/dmg-background.png (+ @2x). window size stays 660×400 in package.json

import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const BUILD = join(import.meta.dirname, "..", "build")

const W = 660
const H = 400

const LOGO =
  "M263.104 281C264.69 281 266.208 280.352 267.305 279.207L437.784 101.195C441.921 96.8749 449.101 100.865 447.616 106.658L412.208 244.872C409.066 257.136 418.331 269.071 430.992 269.071H552.688C561.545 269.071 569.276 263.072 571.474 254.494L634.815 7.25716C635.757 3.57844 632.979 8.90364e-06 629.182 8.90364e-06H489.993C489.886 8.90364e-06 489.78 0.00580769 489.676 0.00726115C489.545 0.00435422 489.413 8.90364e-06 489.28 8.90364e-06H264.366C257.509 8.90364e-06 250.932 2.72379 246.083 7.57255L5.71835 247.901C-6.49742 260.115 2.15458 280.999 19.4303 281H263.104Z"

// keep in sync with package.json build.dmg.contents
const left = 180
const right = 480
const cy = 190
const pad = 120
const radius = 12
const mid = (left + right) / 2

function buildSvg(scale) {
  const w = W * scale
  const h = H * scale
  const s = (n) => n * scale

  let seed = 7
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }

  let dots = ""
  for (let i = 0; i < 280 * scale * scale; i++) {
    const x = (rand() * w).toFixed(1)
    const y = (rand() * h).toFixed(1)
    const a = (0.04 + rand() * 0.06).toFixed(2)
    dots += `<circle cx="${x}" cy="${y}" r="${(0.8 * scale).toFixed(1)}" fill="#fff" fill-opacity="${a}"/>`
  }

  function slot(cx) {
    return `<rect x="${s(cx - pad / 2)}" y="${s(cy - pad / 2)}" width="${s(pad)}" height="${s(pad)}" rx="${s(radius)}" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-opacity=".14" stroke-width="${scale}"/>`
  }

  // filled triangle — one path, no stroke joins
  const arrow = `<path d="M${s(mid - 12)} ${s(cy - 10)} L${s(mid + 14)} ${s(cy)} L${s(mid - 12)} ${s(cy + 10)} Z" fill="#fff" fill-opacity=".5"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#141416"/>
      <stop offset="100%" stop-color="#080809"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  ${dots}
  <g transform="translate(${s((W - 148) / 2)} ${s(34)}) scale(${0.233 * scale})">
    <path d="${LOGO}" fill="#f4f4f5"/>
  </g>
  ${slot(left)}
  ${slot(right)}
  ${arrow}
  <text x="${s(mid)}" y="${s(cy + pad / 2 + 34)}" text-anchor="middle"
    font-family="-apple-system, system-ui, sans-serif" font-size="${s(12)}"
    fill="#fff" fill-opacity=".4">Drag aeri to Applications</text>
</svg>`
}

let Resvg
try {
  Resvg = require("@resvg/resvg-js").Resvg
} catch {
  console.error("need @resvg/resvg-js — npm i -D @resvg/resvg-js")
  process.exit(1)
}

function writePng(name, scale) {
  const svg = buildSvg(scale)
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: W * scale },
  })
    .render()
    .asPng()
  writeFileSync(join(BUILD, name), png)
  console.log("wrote", name)
}

mkdirSync(BUILD, { recursive: true })
writeFileSync(join(BUILD, "dmg-background.svg"), buildSvg(1))
writePng("dmg-background.png", 1)
writePng("dmg-background@2x.png", 2)
