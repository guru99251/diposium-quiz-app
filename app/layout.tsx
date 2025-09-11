import type React from "react"
import type { Metadata, Viewport } from "next"
import Link from "next/link"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <header className="soft-topbar">
          <div className="bar neu-surface neu-convex" style={{ padding: 8, borderRadius: 20 }}>
            <div className="left">
              <Link href="/" aria-label="Back" className="neu-btn neu-icon-btn neu-convex" prefetch={false}>
                <span aria-hidden>◀</span>
              </Link>
            </div>
            <div className="title" aria-live="polite">Quiz App</div>
            <div className="right" style={{ justifyContent: "flex-end" }}>
              <button type="button" aria-label="Options" className="neu-btn neu-icon-btn neu-convex">
                <span aria-hidden="true">···</span>
              </button>
            </div>
          </div>
        </header>
        <main style={{ maxWidth: "1200px", marginInline: "auto", padding: "16px 24px" }}>
          <Suspense
            fallback={
              <div className="min-h-[60dvh] flex items-center justify-center">
                <div className="neu-surface neu-convex" style={{ width: 64, height: 64, borderRadius: 32, display: "grid", placeItems: "center" }}>
                  <div className="w-8 h-8 border-4 border-[var(--soft-accent)] border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  )
}
