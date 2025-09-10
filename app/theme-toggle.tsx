"use client"

import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import * as React from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="neu-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--neu-accent)_60%,black)] rounded-full p-2"
    >
      {isDark ? (
        <Sun className="size-5 text-[var(--neu-text)]" />
      ) : (
        <Moon className="size-5 text-[var(--neu-text)]" />
      )}
    </motion.button>
  )
}
