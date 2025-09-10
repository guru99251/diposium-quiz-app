import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/app/theme-toggle"

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
    <html lang="ko" suppressHydrationWarning>
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <Suspense
            fallback={
              <div className="min-h-screen bg-[var(--neu-bg)] text-[var(--neu-text)] flex items-center justify-center">
                <div className="neu-spinner" aria-label="Loading" />
              </div>
            }
          >
            <div className="min-h-screen bg-[var(--neu-bg)] text-[var(--neu-text)]">
              <header className="sticky top-0 z-30 w-full backdrop-blur-sm bg-[color-mix(in_oklab,var(--neu-bg)_85%,transparent)] border-b border-[color-mix(in_oklab,var(--neu-shadow-dark)_25%,transparent)]">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-end">
                  <ThemeToggle />
                </div>
              </header>
              {children}
            </div>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
