"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
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

interface QuestionType {
  id: string
  name: string
}

interface QuestionForm {
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  type_id: string
}

export default function EditQuestionPage() {
  const params = useParams<{ id: string }>()
  const id = (params?.id as string) || ""
  const router = useRouter()

  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([])
  const [formData, setFormData] = useState<QuestionForm>({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    type_id: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectItemClassName = "text-gray-900 focus:bg-gray-100 focus:text-gray-900 data-[state=checked]:bg-gray-100 data-[state=checked]:text-gray-900"

  useEffect(() => {
    if (!id) return
    const supabase = createClient()

    const load = async () => {
      try {
        const [{ data: types }, { data: question } ] = await Promise.all([
          supabase.from("question_types").select("*").order("name"),
          supabase.from("questions").select("*").eq("id", id).single(),
        ])

        setQuestionTypes(types || [])
        if (question) {
          setFormData({
            question: question.question || "",
            option_a: question.option_a || "",
            option_b: question.option_b || "",
            option_c: question.option_c || "",
            option_d: question.option_d || "",
            correct_answer: question.correct_answer || "",
            type_id: question.type_id || "",
          })
        } else {
          setError("해당 문제가 없습니다.")
        }
      } catch (e) {
        console.error(e)
        setError("데이터를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [id])

  const handleInputChange = (field: keyof QuestionForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from("questions")
        .update(formData)
        .eq("id", id)

      if (updateError) throw updateError
      router.push("/admin/questions")
    } catch (err) {
      console.error(err)
      setError("문제를 저장하는 중 오류가 발생했습니다.")
    } finally {
      setIsSaving(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">문제 편집</h1>
          </div>
          <Link href="/admin/questions">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> 목록으로
            </Button>
          </Link>
        </motion.div>

        <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>문제 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type */}
              <div className="space-y-2">
                <Label className="text-base font-medium">문제 유형</Label>
                <Select value={formData.type_id} onValueChange={(v) => handleInputChange("type_id", v)}>
                  <SelectTrigger className="bg-white text-gray-900">
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900">
                    {questionTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id} className={selectItemClassName}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Question */}
              <div className="space-y-2">
                <Label htmlFor="question" className="text-base font-medium">
                  문제
                </Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => handleInputChange("question", e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="option_a" className="text-base font-medium">
                    보기 A
                  </Label>
                  <Input
                    id="option_a"
                    value={formData.option_a}
                    onChange={(e) => handleInputChange("option_a", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option_b" className="text-base font-medium">
                    보기 B
                  </Label>
                  <Input
                    id="option_b"
                    value={formData.option_b}
                    onChange={(e) => handleInputChange("option_b", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option_c" className="text-base font-medium">
                    보기 C
                  </Label>
                  <Input
                    id="option_c"
                    value={formData.option_c}
                    onChange={(e) => handleInputChange("option_c", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option_d" className="text-base font-medium">
                    보기 D
                  </Label>
                  <Input
                    id="option_d"
                    value={formData.option_d}
                    onChange={(e) => handleInputChange("option_d", e.target.value)}
                  />
                </div>
              </div>

              {/* Correct Answer */}
              <div className="space-y-2">
                <Label className="text-base font-medium">정답</Label>
                <Select value={formData.correct_answer} onValueChange={(v) => handleInputChange("correct_answer", v)}>
                  <SelectTrigger className="w-full bg-white text-gray-900">
                    <SelectValue placeholder="정답 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900">
                    <SelectItem value="A" className={selectItemClassName}>A</SelectItem>
                    <SelectItem value="B" className={selectItemClassName}>B</SelectItem>
                    <SelectItem value="C" className={selectItemClassName}>C</SelectItem>
                    <SelectItem value="D" className={selectItemClassName}>D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </motion.div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover"
                >
                  <Save className="w-4 h-4 mr-2" /> {isSaving ? "저장 중..." : "저장"}
                </Button>
                <Link href="/admin/questions">
                  <Button type="button" variant="outline" className="px-8 bg-transparent">
                    취소
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

