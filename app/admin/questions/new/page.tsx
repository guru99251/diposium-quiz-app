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

interface QuestionType {
  id: string
  name: string
}

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

  useEffect(() => {
    loadQuestionTypes()
  }, [])

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

    // Validation
    if (!formData.question.trim()) {
      setError("?얜챷?ｇ몴???낆젾??곻폒?紐꾩뒄.")
      setIsLoading(false)
      return
    }

    if (
      !formData.option_a.trim() ||
      !formData.option_b.trim() ||
      !formData.option_c.trim() ||
      !formData.option_d.trim()
    ) {
      setError("筌뤴뫀諭??醫뤾문筌왖????낆젾??곻폒?紐꾩뒄.")
      setIsLoading(false)
      return
    }

    if (!formData.correct_answer) {
      setError("?類ｋ뼗???醫뤾문??곻폒?紐꾩뒄.")
      setIsLoading(false)
      return
    }

    if (!formData.type_id) {
      setError("?얜챷???醫륁굨???醫뤾문??곻폒?紐꾩뒄.")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("questions")
        .insert([formData], { returning: "minimal" })

      if (error) throw error

      router.push("/admin/questions")
    } catch (error) {
      console.error("Error creating question:", error)
      setError("?얜챷????밴쉐 餓???살첒揶쎛 獄쏆뮇源??됰뮸??덈뼄.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">???얜챷???곕떽?</h1>
            <p className="text-white/90 text-lg drop-shadow">??덉쨮????곸グ ?얜챷?ｇ몴???밴쉐??뤾쉭??</p>
          </div>
          <Link href="/admin/questions">
            <Button
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              ?얜챷??筌뤴뫖以??곗쨮
            </Button>
          </Link>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">?얜챷???類ｋ궖</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-base font-medium">
                    ?얜챷???醫륁굨 *
                  </Label>
                  <Select value={formData.type_id} onValueChange={(value) => handleInputChange("type_id", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="?얜챷???醫륁굨???醫뤾문??뤾쉭?? " />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Question */}
                <div className="space-y-2">
                  <Label htmlFor="question" className="text-base font-medium">
                    ?얜챷??*
                  </Label>
                  <Textarea
                    id="question"
                    placeholder="?얜챷?ｇ몴???낆젾??뤾쉭??.."
                    value={formData.question}
                    onChange={(e) => handleInputChange("question", e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="option_a" className="text-base font-medium">
                      ?醫뤾문筌왖 A *
                    </Label>
                    <Input
                      id="option_a"
                      placeholder="?醫뤾문筌왖 A????낆젾??뤾쉭??"
                      value={formData.option_a}
                      onChange={(e) => handleInputChange("option_a", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_b" className="text-base font-medium">
                      ?醫뤾문筌왖 B *
                    </Label>
                    <Input
                      id="option_b"
                      placeholder="?醫뤾문筌왖 B????낆젾??뤾쉭??"
                      value={formData.option_b}
                      onChange={(e) => handleInputChange("option_b", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_c" className="text-base font-medium">
                      ?醫뤾문筌왖 C *
                    </Label>
                    <Input
                      id="option_c"
                      placeholder="?醫뤾문筌왖 C????낆젾??뤾쉭??"
                      value={formData.option_c}
                      onChange={(e) => handleInputChange("option_c", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="option_d" className="text-base font-medium">
                      ?醫뤾문筌왖 D *
                    </Label>
                    <Input
                      id="option_d"
                      placeholder="?醫뤾문筌왖 D????낆젾??뤾쉭??"
                      value={formData.option_d}
                      onChange={(e) => handleInputChange("option_d", e.target.value)}
                    />
                  </div>
                </div>

                {/* Correct Answer */}
                <div className="space-y-2">
                  <Label htmlFor="correct_answer" className="text-base font-medium">
                    ?類ｋ뼗 *
                  </Label>
                  <Select
                    value={formData.correct_answer}
                    onValueChange={(value) => handleInputChange("correct_answer", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="?類ｋ뼗???醫뤾문??뤾쉭?? " />
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
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    { isLoading ? "??????.." : "??몄??????" }
                  </Button>
                  <Link href="/admin/questions">
                    <Button type="button" variant="outline" className="px-8 bg-transparent">
                      ?띯뫁??
                    </Button>
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
