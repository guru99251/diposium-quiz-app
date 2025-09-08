"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
}

type Mode = "random5" | "unlimited"

export default function QuizStartPage() {
  const [pool, setPool] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [answers, setAnswers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [mode, setMode] = useState<Mode>("random5")
  const [streak, setStreak] = useState<number>(0)

  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const phone = sessionStorage.getItem("quiz_phone")
    if (!phone) {
      router.push("/quiz")
      return
    }
    setPhoneNumber(phone)
    const m = (params?.get("mode") as Mode) || (sessionStorage.getItem("quiz_mode") as Mode) || "random5"
    setMode(m)
    loadQuestions(m)
  }, [router, params])

  const loadQuestions = async (m: Mode) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("questions").select("*")
      if (error) throw error
      // ensure no duplicates by shuffling and slicing
      const shuffled = (data || []).slice().sort(() => 0.5 - Math.random())
      if (m === "random5") {
        setPool(shuffled.slice(0, 5))
      } else {
        setPool(shuffled)
      }
      setCurrentIndex(0)
      setIsLoading(false)
    } catch (e) {
      console.error("Error loading questions:", e)
      router.push("/quiz")
    }
  }

  const currentQuestion = pool[currentIndex]
  const progress = useMemo(() => (mode === "random5" ? ((currentIndex + 1) / Math.max(pool.length, 1)) * 100 : 0), [mode, currentIndex, pool.length])

  const handleAnswerSelect = (answer: string) => setSelectedAnswer(answer)

  const handleNext = () => {
    if (!currentQuestion) return

    if (mode === "random5") {
      const newAnswers = [...answers, selectedAnswer]
      setAnswers(newAnswers)
      setSelectedAnswer("")
      if (currentIndex < pool.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        submitRandom5(newAnswers)
      }
      return
    }

    // unlimited mode
    const isCorrect = selectedAnswer === currentQuestion.correct_answer
    const nextCorrectList = isCorrect ? [...answers, selectedAnswer] : [...answers]
    setAnswers(nextCorrectList)
    setSelectedAnswer("")

    if (!isCorrect) {
      submitUnlimited(nextCorrectList)
      return
    }

    setStreak((s) => s + 1)
    // Advance sequentially; pool has unique items
    const nextIdx = currentIndex + 1
    if (nextIdx >= pool.length) {
      // Ran out of questions: end as perfect streak
      submitUnlimited(nextCorrectList)
    } else {
      setCurrentIndex(nextIdx)
    }
  }

  const submitRandom5 = async (finalAnswers: string[]) => {
    setIsSubmitting(true)
    try {
      const supabase = createClient()

      const questionsAnswered = pool.map((q, i) => ({
        question_id: q.id,
        question: q.question,
        selected_answer: finalAnswers[i],
        correct_answer: q.correct_answer,
        is_correct: finalAnswers[i] === q.correct_answer,
      }))
      const score = questionsAnswered.filter((qa) => qa.is_correct).length

      const { error } = await supabase.from("quiz_attempts").insert({
        phone_number: phoneNumber,
        score,
        total_questions: pool.length,
        questions_answered: questionsAnswered,
        mode: "random5",
      })
      if (error) throw error

      sessionStorage.setItem(
        "quiz_result",
        JSON.stringify({ mode: "random5", score, total: pool.length, questions: questionsAnswered }),
      )
      router.push("/quiz/result")
    } catch (e) {
      console.error("Error submitting quiz:", e)
      alert("퀴즈 제출 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitUnlimited = async (correctAnswers: string[]) => {
    setIsSubmitting(true)
    try {
      const supabase = createClient()

      const answered = correctAnswers.map((ans, idx) => {
        const q = pool[idx]
        return {
          question_id: q.id,
          question: q.question,
          selected_answer: ans,
          correct_answer: q.correct_answer,
          is_correct: true,
        }
      })
      const streakScore = answered.length

      const { error } = await supabase.from("quiz_attempts").insert({
        phone_number: phoneNumber,
        score: streakScore,
        total_questions: streakScore,
        questions_answered: answered,
        mode: "unlimited",
      })
      if (error) throw error

      sessionStorage.setItem(
        "quiz_result",
        JSON.stringify({ mode: "unlimited", score: streakScore, total: streakScore, questions: answered }),
      )
      router.push("/quiz/result")
    } catch (e) {
      console.error("Error submitting unlimited quiz:", e)
      alert("퀴즈 제출 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Progress / Streak */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          {mode === "random5" ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">
                  문제 {currentIndex + 1} / {pool.length}
                </span>
                <span className="text-white font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-white/20" />
            </>
          ) : (
            <div className="text-center text-white font-semibold">연속 정답 {streak}개</div>
          )}
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-playful border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: "A", text: currentQuestion.option_a },
                  { key: "B", text: currentQuestion.option_b },
                  { key: "C", text: currentQuestion.option_c },
                  { key: "D", text: currentQuestion.option_d },
                ].map((option) => (
                  <motion.button
                    key={option.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(option.key)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswer === option.key
                        ? "border-quiz-primary bg-quiz-primary/10 shadow-playful"
                        : "border-gray-200 hover:border-quiz-secondary bg-white hover:bg-quiz-secondary/5"
                    }`}
                  >
                    <span className="font-semibold text-quiz-primary mr-3">{option.key}.</span>
                    <span className="text-gray-700">{option.text}</span>
                  </motion.button>
                ))}

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: selectedAnswer ? 1 : 0.5 }} className="pt-4">
                  <Button
                    onClick={handleNext}
                    disabled={!selectedAnswer || isSubmitting}
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting
                      ? "제출 중..."
                      : mode === "random5"
                        ? currentIndex === pool.length - 1
                          ? "지금 퀴즈 완료하기"
                          : "▶️ 다음 문제"
                        : "▶️ 확인 / 다음"}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
