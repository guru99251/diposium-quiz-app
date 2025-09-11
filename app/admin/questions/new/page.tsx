"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

  useEffect(() => { loadQuestionTypes() }, [])

  const loadQuestionTypes = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase.from("question_types").select("*").order("name")
      setQuestionTypes(data || [])
    } catch (error) {
      console.error("Error loading question types:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.question.trim()) return fail("문제를 입력하세요")
    if (![formData.option_a, formData.option_b, formData.option_c, formData.option_d].every((v) => v.trim())) return fail("모든 보기를 입력하세요")
    if (!formData.correct_answer) return fail("정답을 선택하세요")
    if (!formData.type_id) return fail("문제 유형을 선택하세요")

    try {
      const supabase = createClient()
      const { error } = await supabase.from("questions").insert([formData], { returning: "minimal" })
      if (error) throw error
      router.push("/admin/questions")
    } catch (error) {
      console.error("Error creating question:", error)
      setError("문제 생성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const fail = (msg: string) => { setError(msg); setIsLoading(false) }
  const handleInputChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen p-4 soft-admin">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--soft-text)' }}>새 문제 추가</h1>
            <p className="text-lg" style={{ color: 'var(--soft-text-muted)' }}>바로 퀴즈 문제를 등록하세요</p>
          </div>
          <Link href="/admin/questions">
            <Button data-accent="secondary"><ArrowLeft className="w-4 h-4 mr-2" /> 문제 목록으로</Button>
          </Link>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: 'var(--soft-text)' }}>문제 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-base font-medium">문제 유형 *</Label>
                  <Select value={formData.type_id} onValueChange={(value) => handleInputChange("type_id", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="문제 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question" className="text-base font-medium">문제 *</Label>
                  <Textarea id="question" placeholder="문제를 입력하세요" value={formData.question} onChange={(e) => handleInputChange("question", e.target.value)} className="min-h-[100px] resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {([
                    { id: "option_a", label: "보기 A *" },
                    { id: "option_b", label: "보기 B *" },
                    { id: "option_c", label: "보기 C *" },
                    { id: "option_d", label: "보기 D *" },
                  ] as const).map((f) => (
                    <div className="space-y-2" key={f.id}>
                      <Label htmlFor={f.id} className="text-base font-medium">{f.label}</Label>
                      <Input id={f.id} placeholder={`${f.label.replace(' *','')}를 입력하세요`} value={(formData as any)[f.id]} onChange={(e) => handleInputChange(f.id, e.target.value)} />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correct_answer" className="text-base font-medium">정답 *</Label>
                  <Select value={formData.correct_answer} onValueChange={(value) => handleInputChange("correct_answer", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="정답을 선택하세요" />
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
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1" data-accent="primary">
                    <Save className="w-4 h-4 mr-2" /> {isLoading ? "저장 중…" : "문제 저장"}
                  </Button>
                  <Link href="/admin/questions"><Button type="button">취소</Button></Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

