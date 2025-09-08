"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Plus, ArrowLeft } from "lucide-react"

interface Question { id: string; question: string }

export default function QuestionsManagePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { (async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase.from("questions").select("id, question").order("created_at", { ascending: false })
      setQuestions(data || [])
    } finally { setLoading(false) }
  })() }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Manage Questions</h1>
            <p className="text-white/90 text-lg drop-shadow">View list and add new questions</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Admin Home
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <Link href="/admin/questions/new">
            <Button className="bg-gradient-to-r from-quiz-primary to-quiz-secondary">
              <Plus className="w-4 h-4 mr-2" /> Add New Question
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : questions.length === 0 ? (
              <div className="text-gray-500">No questions found.</div>
            ) : (
              <ul className="space-y-2 list-disc list-inside text-gray-800">
                {questions.map((q) => (
                  <li key={q.id}>{q.question}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
