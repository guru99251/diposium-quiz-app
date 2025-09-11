import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"
import GradientBackground from "@/components/GradientBackground"
import { Montserrat } from "@/lib/fonts"

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
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${Montserrat.variable}`}>
        <GradientBackground />
        <Suspense
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-teal-400 flex items-center justify-center">
              <div className="w-16 h-16 animate-spin"></div>
            </div>
          }
        >
          <div className="relative z-10">{children}</div>
        </Suspense>
      </body>
    </html>
  )
}
