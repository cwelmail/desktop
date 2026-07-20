import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "aeri",
  description: "aeri — Anonymous, private email",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
