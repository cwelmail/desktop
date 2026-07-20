"use client"

import { addCollection, Icon as IconifyIcon } from "@iconify/react/offline"
import phIcons from "@/lib/ph-icons.json"

addCollection(phIcons)

export const Icon = IconifyIcon
