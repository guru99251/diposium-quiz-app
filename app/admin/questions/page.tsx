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
  question_types?: {
    name: string
  }
}

interface QuestionType {
  id: string
  name: string
}

export default function QuestionsManagePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterQuestions()
  }, [questions, searchTerm, selectedType])

  const loadData = async () => {
    try {
      const supabase = createClient()

      // Load question types
      const { data: types } = await supabase.from("question_types").select("*").order("name")

      // Load questions with types
      const { data: questionsData } = await supabase
        .from("questions")
        .select(`
          *,
          question_types (
            name
          )
        `)
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

    if (searchTerm) {
      filtered = filtered.filter((q) => q.question.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((q) => q.type_id === selectedType)
    }

    setFilteredQuestions(filtered)
  }

  const deleteQuestion = async (questionId: string) => {
    if (!confirm("정말로 이 문제를 삭제하시겠습니까?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("questions").delete().eq("id", questionId)

      if (error) throw error

      setQuestions(questions.filter((q) => q.id !== questionId))
    } catch (error) {
      console.error("Error deleting question:", error)
      alert("문제 삭제 중 오류가 발생했습니다.")
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
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">문제 관리</h1>
            <p className="text-white/90 text-lg drop-shadow">퀴즈 문제를 추가, 수정, 삭제할 수 있습니다</p>
          </div>
          <Link href="/admin">
            <Button
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              대시보드로
            </Button>
          </Link>
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">문제 검색</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="문제 내용으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">문제 유형</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Link href="/admin/questions/new">
                  <Button className="bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover">
                    <Plus className="w-4 h-4 mr-2" />
                    문제 추가
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
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-playful hover:shadow-playful-hover transition-all duration-300 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-800 mb-2">{question.question}</CardTitle>
                        <CardDescription className="text-quiz-primary font-medium">
                          {question.question_types?.name}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/questions/edit/${question.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-quiz-secondary text-quiz-secondary hover:bg-quiz-secondary hover:text-white bg-transparent"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteQuestion(question.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div
                        className={`p-2 rounded ${question.correct_answer === "A" ? "bg-green-100 border border-green-300" : "bg-gray-50"}`}
                      >
                        <span className="font-semibold text-quiz-primary">A.</span> {question.option_a}
                      </div>
                      <div
                        className={`p-2 rounded ${question.correct_answer === "B" ? "bg-green-100 border border-green-300" : "bg-gray-50"}`}
                      >
                        <span className="font-semibold text-quiz-primary">B.</span> {question.option_b}
                      </div>
                      <div
                        className={`p-2 rounded ${question.correct_answer === "C" ? "bg-green-100 border border-green-300" : "bg-gray-50"}`}
                      >
                        <span className="font-semibold text-quiz-primary">C.</span> {question.option_c}
                      </div>
                      <div
                        className={`p-2 rounded ${question.correct_answer === "D" ? "bg-green-100 border border-green-300" : "bg-gray-50"}`}
                      >
                        <span className="font-semibold text-quiz-primary">D.</span> {question.option_d}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">정답:</span> {question.correct_answer}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredQuestions.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
                <CardContent className="p-8">
                  <p className="text-gray-500 text-lg">
                    {searchTerm || selectedType !== "all"
                      ? "검색 조건에 맞는 문제가 없습니다."
                      : "아직 등록된 문제가 없습니다."}
                  </p>
                  <Link href="/admin/questions/new">
                    <Button className="mt-4 bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover">
                      첫 번째 문제 추가하기
                    </Button>
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
