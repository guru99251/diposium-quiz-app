"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface QuestionResult {
  question: string
  selected_answer: string
  correct_answer: string
  is_correct: boolean
}

interface QuizResult {
  score: number
  total: number
  questions: QuestionResult[]
}

export default function QuizResultPage() {
  const [result, setResult] = useState<QuizResult | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const resultData = sessionStorage.getItem("quiz_result")
    if (!resultData) {
      router.push("/quiz")
      return
    }

    const parsedResult = JSON.parse(resultData)
    setResult(parsedResult)

    // Show confetti for good scores
    if (parsedResult.score >= parsedResult.total * 0.6) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    // Clear session data
    sessionStorage.removeItem("quiz_phone")
    sessionStorage.removeItem("quiz_result")
  }, [router])

  if (!result) {
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

  const percentage = Math.round((result.score / result.total) * 100)
  const getScoreMessage = () => {
    if (percentage >= 80) return "🎉 훌륭해요!"
    if (percentage >= 60) return "👍 잘했어요!"
    if (percentage >= 40) return "💪 괜찮아요!"
    return "📚 다음엔 더 잘할 수 있어요!"
  }

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-blue-600"
    if (percentage >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                y: -100,
                x: Math.random() * window.innerWidth,
                rotate: 0,
              }}
              animate={{
                opacity: 0,
                y: window.innerHeight + 100,
                rotate: 360,
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full"
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        {/* Score Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="shadow-playful border-0 bg-white/95 backdrop-blur-sm text-center">
            <CardHeader>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">퀴즈 완료! 🎯</CardTitle>
                <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
                  {result.score}/{result.total}
                </div>
                <div className={`text-2xl font-semibold ${getScoreColor()}`}>{percentage}점</div>
                <div className="text-xl text-gray-600 mt-2">{getScoreMessage()}</div>
              </motion.div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Detailed Results */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="shadow-playful border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">📊 상세 결과</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.questions.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  className={`p-4 rounded-lg border-2 ${
                    q.is_correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{q.is_correct ? "✅" : "❌"}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">
                        문제 {index + 1}: {q.question}
                      </p>
                      <div className="text-sm space-y-1">
                        <p className={q.is_correct ? "text-green-700" : "text-red-700"}>
                          선택한 답: {q.selected_answer}
                        </p>
                        {!q.is_correct && <p className="text-green-700">정답: {q.correct_answer}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex gap-4"
        >
          <Button
            onClick={() => router.push("/")}
            className="flex-1 py-4 text-lg font-semibold bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover transform hover:scale-105"
          >
            🏠 홈으로 돌아가기
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
