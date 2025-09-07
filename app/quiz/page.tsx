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
  const router = useRouter()

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate phone number format (Korean mobile)
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/
    if (!phoneRegex.test(phoneNumber.replace(/-/g, ""))) {
      setError("올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Check if user already took the quiz
      const { data: existingAttempt } = await supabase
        .from("quiz_attempts")
        .select("id")
        .eq("phone_number", phoneNumber)
        .single()

      if (existingAttempt) {
        setError("이미 퀴즈에 참여하셨습니다. 한 번만 참여 가능합니다.")
        setIsLoading(false)
        return
      }

      // Store phone number in session storage and redirect to quiz
      sessionStorage.setItem("quiz_phone", phoneNumber)
      router.push("/quiz/start")
    } catch (error) {
      console.error("Error checking quiz attempt:", error)
      // If no existing attempt found, proceed to quiz
      sessionStorage.setItem("quiz_phone", phoneNumber)
      router.push("/quiz/start")
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
              <CardTitle className="text-3xl font-bold text-quiz-primary">🎯 퀴즈 참여하기</CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                전화번호를 입력하고 재미있는 퀴즈를 시작해보세요!
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStartQuiz} className="space-y-6">
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

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover transform hover:scale-105"
                >
                  {isLoading ? "확인 중..." : "🚀 퀴즈 시작하기"}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-6 text-center text-sm text-gray-500 space-y-1"
            >
              <p>📱 전화번호는 중복 참여 방지용으로만 사용됩니다</p>
              <p>🎮 총 5문제, 약 3분 소요</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
