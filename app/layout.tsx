import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Streamline - Houston CRE Platform",
  description: "Houston's Premier Commercial Real Estate Platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en"
    data-kantu="1"
    >
      <body>{children}</body>
    </html>
  )
}
