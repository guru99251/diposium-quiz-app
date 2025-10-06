#!/usr/bin/env node

const { existsSync } = require("fs")
const { resolve } = require("path")
const dotenv = require("dotenv")
const { spawn } = require("child_process")

const envCandidates = [
  ".env.development.local",
  ".env.local",
  ".env.development",
  ".env",
]

const cwd = process.cwd()
const loaded = []

for (const candidate of envCandidates) {
  const fullPath = resolve(cwd, candidate)
  if (!existsSync(fullPath)) continue

  const result = dotenv.config({ path: fullPath, override: false })
  if (result.error) {
    console.warn(`[dev-env] Failed to load ${candidate}:`, result.error.message)
    continue
  }
  loaded.push(candidate)
}

if (loaded.length > 0) {
  console.log(`[dev-env] Loaded environment files: ${loaded.join(", ")}`)
} else {
  console.log(`[dev-env] No environment file found for development run (${envCandidates.join(", ")}).`)
}

const nextBin = require.resolve("next/dist/bin/next")
const child = spawn(process.execPath, [nextBin, "dev"], {
  cwd,
  env: process.env,
  stdio: "inherit",
})

child.on("close", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})
