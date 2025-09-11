"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"

export default function QuizEntryPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"phone" | "mode">("phone")
  const router = useRouter()

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/
    if (!phoneRegex.test(phoneNumber.replace(/-/g, ""))) {
      setError("올바른 전화번호 형식으로 입력해 주세요 (예: 010-1234-5678)")
      setIsLoading(false)
      return
    }

    sessionStorage.setItem("quiz_phone", phoneNumber)
    setStep("mode")
    setIsLoading(false)
  }

  const handleSelectMode = async (mode: "random5" | "unlimited") => {
    try {
      setIsLoading(true)
      setError(null)
      const supabase = createClient()

      if (mode === "random5") {
        const { data: tried5 } = await supabase
          .from("quiz_attempts")
          .select("id")
          .eq("phone_number", phoneNumber)
          .eq("mode", "random5")
          .limit(1)

        if (tried5 && tried5.length > 0) {
          setError("이미 5문제 모드에 참여하셨습니다.")
          setIsLoading(false)
          return
        }
      } else {
        const { data: triedUnlimited } = await supabase
          .from("quiz_attempts")
          .select("id")
          .eq("phone_number", phoneNumber)
          .eq("mode", "unlimited")
          .limit(1)

        if (triedUnlimited && triedUnlimited.length > 0) {
          setError("이미 질문 무제한 모드에 참여하셨습니다.")
          setIsLoading(false)
          return
        }
      }

      sessionStorage.setItem("quiz_mode", mode)
      router.push(`/quiz/start?mode=${mode}`)
    } catch (err) {
      console.error("Error checking mode attempt:", err)
      sessionStorage.setItem("quiz_mode", mode)
      router.push(`/quiz/start?mode=${mode}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md fade-in"
      >
        <div className="neu-surface neu-convex p-6" role="region" aria-labelledby="quiz-entry-heading">
          <div className="text-center space-y-2 mb-4">
            <h2 id="quiz-entry-heading" className="text-3xl font-bold" style={{color:"var(--soft-text)"}}>퀴즈 참여하기</h2>
            <p style={{color:"var(--soft-text-muted)"}}>휴대폰 번호를 입력하고 모드를 선택하세요</p>
          </div>

          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-base font-medium" style={{color:"var(--soft-text)"}}>휴대폰 번호</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="neu-input text-lg"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>

              {error && (
                <div className="neu-surface neu-concave glow-incorrect text-sm p-3 rounded-[20px] text-center" style={{color:"var(--soft-text)"}}>
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <button type="submit" disabled={isLoading} className="neu-btn neu-convex cta-primary">
                  {isLoading ? "확인 중..." : "다음: 모드 선택"}
                </button>
              </div>
            </form>
          )}

          {step === "mode" && (
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectMode("random5")}
                  className="neu-btn neu-convex neu-btn--lg w-full text-left p-5"
                >
                  <div className="text-xl font-extrabold" style={{color:"var(--soft-text)"}}>무작위 5문제</div>
                  <div style={{color:"var(--soft-text-muted)"}}>5문제 모두 답변</div>
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectMode("unlimited")}
                  className="neu-btn neu-convex neu-btn--lg w-full text-left p-5"
                >
                  <div className="text-xl font-extrabold" style={{color:"var(--soft-text)"}}>질문 무제한</div>
                  <div style={{color:"var(--soft-text-muted)"}}>틀릴 때까지 계속</div>
                </button>
              </motion.div>

              {error && (
                <div className="text-sm neu-surface neu-concave glow-incorrect p-3 rounded-[20px] text-center" style={{color:"var(--soft-text)"}}>
                  {error}
                </div>
              )}

              <div className="text-center">
                <button onClick={() => setStep("phone")} className="neu-btn neu-convex" type="button">
                  휴대폰 번호 다시 입력
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm" style={{color:"var(--soft-text-muted)"}}>
            <em>각 모드별로 <strong>1회씩</strong> 참여 가능합니다.</em>
            <br />
            <em>입력한 전화번호는 중복 참여 방지를 위해서만 사용됩니다.</em>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

