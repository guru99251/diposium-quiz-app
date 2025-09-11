"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
      setError("올바른 전화번호 형식으로 입력해주세요 (예: 010-1234-5678)")
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
          setError("이미 5문제 모드에 참여하셨어요.")
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
          setError("이미 질문 무제한 모드에 참여하셨어요.")
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
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-playful border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-3xl font-bold text-quiz-primary">퀴즈 참여하기</CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                전화번호 입력 후 모드를 선택하세요.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            {step === "phone" && (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="phone" className="text-base font-medium text-gray-700">
                    전화번호
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg py-3 border-2 border-gray-200 focus:border-quiz-primary rounded-xl"
                    required
                  />
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="text-center">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-80 py-4 text-lg font-semibold bg-gradient-to-r shadow-playful hover:shadow-playful-hover transition-all duration-600 rounded-full transform hover:scale-102"
                  >
                    {isLoading ? "확인 중..." : "다음: 모드 선택"}
                  </Button>
                </motion.div>
              </form>
            )}

            {step === "mode" && (
              <div className="space-y-4">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-center text-gray-700 font-medium mb-2">모드를 선택하세요</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectMode("random5")}
                    className="
                          relative rounded-2xl p-5 text-left text-white
                          /* 기본: 보라 그라디언트 + 움직임 */
                          bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600
                          bg-[length:200%_100%] bg-[position:0%_0%]
                          transition-[background-position,colors,box-shadow,transform] duration-500
                          hover:bg-[position:100%_0%] hover:brightness-105 active:brightness-95

                          /* 보더 */
                          border-2 border-transparent hover:border-white/60 focus-visible:border-white/80

                          /* 선택/포커스 시 배경 강조 */
                          focus:outline-none focus-visible:ring-4 focus-visible:ring-white/15
                          focus-visible:from-purple-800 focus-visible:via-purple-700 focus-visible:to-indigo-800

                          /* 그림자 */
                          shadow-playful hover:shadow-playful-hover

                          /* 비활성화 */
                          disabled:opacity-60 disabled:cursor-not-allowed

                          /* — 그라디언트 보더 애니메이션 — */
                          before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none
                          before:p-[2px] before:opacity-0 focus-visible:before:opacity-100
                          before:transition-opacity before:duration-300
                          before:bg-[linear-gradient(90deg,#7e22ce,#6366f1,#7e22ce)]
                          before:bg-[length:200%_100%] before:bg-[position:0%_0%]
                          focus-visible:before:bg-[position:100%_0%] transition-[background-position]
                          before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
                          before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]
                        "
                      >
                    <div className="text-xl font-extrabold">무작위 5개</div>
                    <div className="opacity-90">5문제 모두 풀기</div>
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectMode("unlimited")}
                    className="
                        relative rounded-2xl p-5 text-left text-white
                        /* 기본: 그라디언트 배경 + 살짝 움직이는 쉐입 */
                        bg-gradient-to-r from-orange-500 via-orange-400 to-pink-600
                        bg-[length:200%_100%] bg-[position:0%_0%]
                        transition-[background-position,colors,box-shadow,transform] duration-500
                        hover:bg-[position:100%_0%] hover:brightness-105 active:brightness-95

                        /* 테두리: 기본 투명, 선택 시 보임 */
                        border-2 border-transparent hover:border-white/60 focus-visible:border-white/80

                        /* 선택 시 배경 톤업 + 링 */
                        focus:outline-none focus-visible:ring-4 focus-visible:ring-white/15
                        focus-visible:from-orange-600 focus-visible:via-orange-500 focus-visible:to-pink-600

                        /* 그림자 */
                        shadow-playful hover:shadow-playful-hover

                        /* 비활성화 */
                        disabled:opacity-60 disabled:cursor-not-allowed

                        /* —— 선택 시 그라디언트 보더 애니메이션(가상요소, className만으로 구현) —— */
                        before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none
                        before:p-[2px] before:opacity-0 focus-visible:before:opacity-100
                        before:transition-opacity before:duration-300
                        before:bg-[linear-gradient(90deg,#fb923c,#ec4899,#fb923c)]
                        before:bg-[length:200%_100%] before:bg-[position:0%_0%]
                        focus-visible:before:bg-[position:100%_0%] transition-[background-position]
                        before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
                        before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]
                      "
                    >
                    <div className="text-xl font-extrabold">질문 무제한</div>
                    <div className="opacity-90">틀릴 때까지 연속 정답</div>
                  </motion.button>
                </div>

                {error && (
                  <div>
                    {error}
                  </div>
                )}

                <div className="text-center">
                  <Button variant="outline" onClick={() => setStep("phone")} className="py-4 font-semibold bg-gradient-to-r shadow-playful hover:shadow-playful-hover transition-all duration-600 rounded-full transform hover:scale-102">
                    ‹ 전화번호 다시 입력
                  </Button>
                </div>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-6 text-center text-sm text-gray-500 space-y-1"
            >
              <em>퀴즈는 모드별로 **1회씩** 참여할 수 있어요!</em>
              <br></br>
              <em>전화번호는 중복 참여 방지를 위해서만 사용됩니다.</em>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
