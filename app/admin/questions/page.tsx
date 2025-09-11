"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react"

interface Question {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  type_id: string
  question_types?: { name: string }
}

interface QuestionType { id: string; name: string }

export default function QuestionsManagePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { loadData() }, [])
  useEffect(() => { filterQuestions() }, [questions, searchTerm, selectedType])

  const loadData = async () => {
    try {
      const supabase = createClient()
      const { data: types } = await supabase.from("question_types").select("*").order("name")
      const { data: questionsData } = await supabase
        .from("questions")
        .select(`*, question_types ( name )`)
        .order("created_at", { ascending: false })
      setQuestionTypes(types || [])
      setQuestions(questionsData || [])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterQuestions = () => {
    let filtered = questions
    if (searchTerm) filtered = filtered.filter((q) => q.question.toLowerCase().includes(searchTerm.toLowerCase()))
    if (selectedType !== "all") filtered = filtered.filter((q) => q.type_id === selectedType)
    setFilteredQuestions(filtered)
  }

  const deleteQuestion = async (questionId: string) => {
    if (!confirm("정말 이 문제를 삭제하시겠습니까?")) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from("questions").delete().eq("id", questionId)
      if (error) throw error
      setQuestions((prev) => prev.filter((q) => q.id !== questionId))
    } catch (error) {
      console.error("Error deleting question:", error)
      alert("문제 삭제 중 오류가 발생했습니다.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen soft-admin flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="w-16 h-16 border-4 border-[var(--soft-accent)] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 soft-admin">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--soft-text)' }}>문제 관리</h1>
            <p className="text-lg" style={{ color: 'var(--soft-text-muted)' }}>퀴즈 문제를 추가, 수정, 삭제합니다</p>
          </div>
          <Link href="/admin">
            <Button data-accent="secondary"><ArrowLeft className="w-4 h-4 mr-2" /> 대시보드로</Button>
          </Link>
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--soft-text)' }}>문제 검색</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="문제 내용으로 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--soft-text)' }}>문제 유형</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Link href="/admin/questions/new">
                  <Button data-accent="primary">
                    <Plus className="w-4 h-4 mr-2" /> 문제 추가
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Questions List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredQuestions.map((question, index) => (
              <motion.div key={question.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ delay: index * 0.03 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg" style={{ color: 'var(--soft-text)' }}>{question.question}</CardTitle>
                        <CardDescription>{question.question_types?.name}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/questions/edit/${question.id}`}>
                          <Button size="icon" data-accent="secondary" aria-label="편집"><Edit className="w-4 h-4" /></Button>
                        </Link>
                        <Button size="icon" variant="destructive" onClick={() => deleteQuestion(question.id)} aria-label="삭제">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {([
                        { key: 'A', text: question.option_a },
                        { key: 'B', text: question.option_b },
                        { key: 'C', text: question.option_c },
                        { key: 'D', text: question.option_d },
                      ] as const).map((opt) => (
                        <div key={opt.key} className={`p-2 rounded ${question.correct_answer === opt.key ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                          <span className="font-semibold" style={{ color: 'var(--soft-accent)' }}>{opt.key}.</span> {opt.text}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-sm" style={{ color: 'var(--soft-text)' }}>
                      <span className="font-medium">정답:</span> {question.correct_answer}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredQuestions.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Card>
                <CardContent className="p-8">
                  <p className="text-lg" style={{ color: 'var(--soft-text-muted)' }}>
                    {searchTerm || selectedType !== "all" ? "조건에 맞는 문제가 없습니다." : "아직 등록된 문제가 없습니다."}
                  </p>
                  <Link href="/admin/questions/new">
                    <Button className="mt-4" data-accent="primary">첫 번째 문제 추가하기</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

