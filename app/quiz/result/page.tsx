"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuestionResult { question: string; selected_answer: string; correct_answer: string; is_correct: boolean }
interface QuizResult { mode?: "random5" | "unlimited"; score: number; total: number; questions: QuestionResult[] }

export default function QuizResultPage() {
  const [result, setResult] = useState<QuizResult | null>(null)
  const router = useRouter()

  useEffect(() => {
    const data = sessionStorage.getItem("quiz_result")
    if (!data) { router.push("/quiz"); return }
    try { setResult(JSON.parse(data) as QuizResult) } catch { router.push("/quiz") }
  }, [router])

  if (!result) return null

  const isUnlimited = result.mode === "unlimited"
  const percentage = isUnlimited ? 100 : Math.round((result.score / Math.max(result.total, 1)) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        <Card className="shadow-playful border-0 bg-white/95 backdrop-blur-sm text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Quiz Finished</CardTitle>
          </CardHeader>
          <CardContent>
            {isUnlimited ? (
              <div className="text-2xl font-bold text-quiz-primary">Best streak {result.score}</div>
            ) : (
              <div className="space-y-1">
                <div className="text-5xl font-bold text-quiz-primary">{result.score}/{result.total}</div>
                <div className="text-xl text-gray-700">{percentage}%</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-playful border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Per-question Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.questions.map((q, i) => (
              <div key={i} className={`p-3 rounded-lg border ${q.is_correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <div className="font-medium text-gray-800 mb-1">Q{i + 1}: {q.question}</div>
                <div className="text-sm">Your answer: {q.selected_answer}{!q.is_correct && <span className="ml-2">/ Correct: {q.correct_answer}</span>}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => router.push("/")} className="flex-1 py-3 bg-gradient-to-r from-quiz-primary to-quiz-secondary">Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
