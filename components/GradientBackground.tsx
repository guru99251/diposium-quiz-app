"use client"

import { useEffect, useRef } from "react"

export default function GradientBackground() {
  const interactiveRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const interBubble = interactiveRef.current
    if (!interBubble) return

    let curX = 0
    let curY = 0
    let tgX = 0
    let tgY = 0

    let raf = 0
    const move = () => {
      curX += (tgX - curX) / 20
      curY += (tgY - curY) / 20
      interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
      raf = requestAnimationFrame(move)
    }

    const onMouseMove = (event: MouseEvent) => {
      tgX = event.clientX
      tgY = event.clientY
    }

    window.addEventListener("mousemove", onMouseMove)
    raf = requestAnimationFrame(move)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="gradient-bg" aria-hidden>
      {/* Background noise overlay */}
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="noiseBg"
        preserveAspectRatio="xMidYMid meet"
      >
        <filter id="noiseFilterBg">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilterBg)" />
      </svg>

      {/* Goo filter for blobs */}
      <svg xmlns="http://www.w3.org/2000/svg" className="svgBlur">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Animated gradient blobs */}
      <div className="gradients-container">
        <div className="g1" />
        <div className="g2" />
        <div className="g3" />
        <div className="g4" />
        <div className="g5" />
        <div className="interactive" ref={interactiveRef} />
      </div>
    </div>
  )
}

