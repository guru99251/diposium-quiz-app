"use client"

import { useEffect, useState } from "react"

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener("change", updatePreference)

    return () => mediaQuery.removeEventListener("change", updatePreference)
  }, [])

  return prefersReducedMotion
}

export default function GradientBackground() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div
      className={`metaball-background${prefersReducedMotion ? " metaball-background--static" : ""}`}
      aria-hidden
      suppressHydrationWarning
    >
      <div className="metaball-background__noise" />
    </div>
  )
}
