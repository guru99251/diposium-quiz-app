"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-20 h-20 bg-black brutalist-border">
          <div className="w-full h-full bg-orange-500 animate-pulse"></div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-black text-white px-4 py-2 brutalist-border font-black text-xl uppercase">
              문제 {currentQuestionIndex + 1} / {questions.length}
            </div>
            <div className="bg-orange-500 text-white px-4 py-2 brutalist-border font-black text-xl">
              {Math.round(progress)}%
            </div>
          </div>
          <div className="h-6 bg-gray-200 brutalist-border">
            <div className="h-full bg-orange-500 brutalist-transition" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <Card className="brutalist-border brutalist-shadow bg-white mb-8">
          <CardHeader className="p-8">
            <div className="w-16 h-16 bg-blue-500 flex items-center justify-center mb-6 brutalist-border">
              <span className="text-white font-black text-2xl">{currentQuestionIndex + 1}</span>
            </div>
            <CardTitle className="text-2xl font-black text-black uppercase leading-tight">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-4">
            {[
              { key: "A", text: currentQuestion.option_a, color: "bg-red-500" },
              { key: "B", text: currentQuestion.option_b, color: "bg-green-500" },
              { key: "C", text: currentQuestion.option_c, color: "bg-blue-500" },
              { key: "D", text: currentQuestion.option_d, color: "bg-purple-500" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => handleAnswerSelect(option.key)}
                className={`w-full p-6 text-left brutalist-border brutalist-transition brutalist-click brutalist-focus ${
                  selectedAnswer === option.key
                    ? `${option.color} text-white brutalist-shadow`
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 flex items-center justify-center brutalist-border mr-4 font-black text-xl ${
                      selectedAnswer === option.key ? "bg-white text-black" : `${option.color} text-white`
                    }`}
                  >
                    {option.key}
                  </div>
                  <span className="text-lg font-bold">{option.text}</span>
                </div>
              </button>
            ))}

            <div className="pt-6">
              <Button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer || isSubmitting}
                className="w-full py-6 text-xl font-black uppercase bg-orange-500 hover:bg-orange-600 text-white brutalist-border brutalist-shadow brutalist-transition brutalist-click brutalist-focus border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "제출 중..."
                  : currentQuestionIndex === questions.length - 1
                    ? "퀴즈 완료"
                    : "다음 문제"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
