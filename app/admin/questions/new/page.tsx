"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { ArrowLeft, Save } from "lucide-react"

interface QuestionType { id: string; name: string }

export default function NewQuestionPage() {
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([])
  const [formData, setFormData] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    type_id: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => { (async () => {
    const supabase = createClient()
    const { data } = await supabase.from("question_types").select("*").order("name")
    setQuestionTypes(data || [])
  })() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const { question, option_a, option_b, option_c, option_d, correct_answer, type_id } = formData
    if (!question.trim() || !option_a.trim() || !option_b.trim() || !option_c.trim() || !option_d.trim()) {
      setError("모든 항목을 입력하세요."); setIsLoading(false); return
    }
    if (!correct_answer) { setError("정답을 선택하세요."); setIsLoading(false); return }
    if (!type_id) { setError("문제 유형을 선택하세요."); setIsLoading(false); return }
    try {
      const supabase = createClient()
      const { error } = await supabase.from("questions").insert([formData])
      if (error) throw error
      router.push("/admin/questions")
    } catch (err) {
      console.error(err)
      setError("문제 생성 중 오류가 발생했습니다.")
    } finally { setIsLoading(false) }
  }

  const set = (k: string, v: string) => setFormData((p) => ({ ...p, [k]: v }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Add New Question</h1>
            <p className="text-white/90 text-lg drop-shadow">Create a new quiz question</p>
          </div>
          <Link href="/admin/questions">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to list
            </Button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Question Info</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Category *</Label>
                  <Select value={formData.type_id} onValueChange={(v) => set("type_id", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Question *</Label>
                  <Textarea id="question" placeholder="Type the question..." value={formData.question} onChange={(e) => set("question", e.target.value)} className="min-h-[100px] resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["A","B","C","D"] as const).map((opt) => (
                    <div key={opt} className="space-y-2">
                      <Label htmlFor={`option_${opt.toLowerCase()}`}>Option {opt} *</Label>
                      <Input id={`option_${opt.toLowerCase()}`} placeholder={`Enter option ${opt}`} value={(formData as any)[`option_${opt.toLowerCase()}`]} onChange={(e) => set(`option_${opt.toLowerCase()}`, e.target.value)} />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correct_answer">Answer *</Label>
                  <Select value={formData.correct_answer} onValueChange={(v) => set("correct_answer", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select the answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover">
                    <Save className="w-4 h-4 mr-2" /> {isLoading ? "Saving..." : "Save Question"}
                  </Button>
                  <Link href="/admin/questions">
                    <Button type="button" variant="outline" className="px-8 bg-transparent">Cancel</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
