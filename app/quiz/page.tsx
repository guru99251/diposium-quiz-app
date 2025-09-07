"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="brutalist-border brutalist-shadow bg-white">
          <CardHeader className="text-center p-8">
            <div className="w-24 h-24 bg-orange-500 flex items-center justify-center mx-auto mb-6 brutalist-border">
              <span className="text-4xl">🎯</span>
            </div>
            <CardTitle className="brutalist-subtitle text-black uppercase mb-4">퀴즈 참여</CardTitle>
            <CardDescription className="text-xl text-black font-bold">전화번호 입력 후 바로 시작</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleStartQuiz} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="phone" className="text-xl font-black text-black uppercase block">
                  전화번호
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-xl py-4 px-4 brutalist-border bg-white text-black font-bold placeholder:text-gray-400 brutalist-focus"
                  required
                />
              </div>

              {error && <div className="bg-red-500 text-white p-4 brutalist-border font-bold text-lg">{error}</div>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-xl font-black uppercase bg-orange-500 hover:bg-orange-600 text-white brutalist-border brutalist-shadow brutalist-transition brutalist-click brutalist-focus border-0"
              >
                {isLoading ? "확인 중..." : "퀴즈 시작"}
              </Button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="bg-blue-500 text-white p-4 brutalist-border">
                <p className="font-bold text-lg">전화번호는 중복 참여 방지용으로만 사용</p>
              </div>
              <div className="bg-green-500 text-white p-4 brutalist-border">
                <p className="font-bold text-lg">총 5문제, 약 3분 소요</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
