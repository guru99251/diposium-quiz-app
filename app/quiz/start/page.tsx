"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function QuizStartPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [answers, setAnswers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const phone = sessionStorage.getItem("quiz_phone")
    if (!phone) {
      router.push("/quiz")
      return
    }
    setPhoneNumber(phone)
    loadQuestions()
  }, [router])

  const loadQuestions = async () => {
    try {
      const supabase = createClient()

      // Get 5 random questions
      const { data, error } = await supabase.from("questions").select("*").limit(20) // Get more than needed for randomization

      if (error) throw error

      // Randomly select 5 questions
      const shuffled = data.sort(() => 0.5 - Math.random())
      const selectedQuestions = shuffled.slice(0, 5)

      setQuestions(selectedQuestions)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading questions:", error)
      router.push("/quiz")
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer("")

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      submitQuiz(newAnswers)
    }
  }

  const submitQuiz = async (finalAnswers: string[]) => {
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Calculate score
      let score = 0
      const questionsAnswered = questions.map((question, index) => ({
        question_id: question.id,
        question: question.question,
        selected_answer: finalAnswers[index],
        correct_answer: question.correct_answer,
        is_correct: finalAnswers[index] === question.correct_answer,
      }))

      questionsAnswered.forEach((qa) => {
        if (qa.is_correct) score++
      })

      // Save quiz attempt
      const { error } = await supabase.from("quiz_attempts").insert({
        phone_number: phoneNumber,
        score,
        total_questions: questions.length,
        questions_answered: questionsAnswered,
      })

      if (error) throw error

      // Store results and redirect
      sessionStorage.setItem(
        "quiz_result",
        JSON.stringify({
          score,
          total: questions.length,
          questions: questionsAnswered,
        }),
      )

      router.push("/quiz/result")
    } catch (error) {
      console.error("Error submitting quiz:", error)
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

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">
              문제 {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-white font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-white/20" />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
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
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer || isSubmitting}
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting
                      ? "제출 중..."
                      : currentQuestionIndex === questions.length - 1
                        ? "🎯 퀴즈 완료하기"
                        : "➡️ 다음 문제"}
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
