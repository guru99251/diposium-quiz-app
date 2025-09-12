"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

interface QuestionType {
  id: string
  name: string
  description?: string | null
}

export default function CategoriesPage() {
  const supabase = createClient()
  const router = useRouter()
  const [types, setTypes] = useState<QuestionType[]>([])
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const { data } = await supabase.from("question_types").select("*").order("name")
      setTypes(data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const addType = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const payload: any = { name: name.trim() }
      if (desc.trim()) payload.description = desc.trim()
      const { error } = await supabase
        .from("question_types")
        .insert(payload, { returning: "minimal" })
      if (error) throw error
      setName("")
      setDesc("")
      await load()
    } catch (e) {
      alert("유형 추가 중 오류가 발생했습니다.")
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const removeType = async (id: string) => {
    if (!confirm("정말 이 문제 유형을 삭제하시겠습니까? 관련 문제가 있다면 함께 삭제될 수 있습니다.")) return
    try {
      const { error } = await supabase.from("question_types").delete().eq("id", id)
      if (error) throw error
      await load()
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다.")
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow">문제 유형 관리</h1>
          <Link href="/admin">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> 관리 홈
            </Button>
          </Link>
        </motion.div>

        <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle>새 문제 유형 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1">
                <Label htmlFor="name">이름 * <br></br></Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 디지털콘텐츠학과" />
              </div>
              {/* <div className="md:col-span-2">
                <Label htmlFor="desc">설명</Label>
                <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="선택사항" />
              </div> */}
            </div>
            <div className="mt-4">
              <Button onClick={addType} disabled={saving || !name.trim()} className="bg-gradient-to-r from-quiz-primary to-quiz-secondary">
                <Plus className="w-4 h-4 mr-2" /> 추가
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>등록된 유형</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-gray-500">불러오는 중...</div>
            ) : types.length === 0 ? (
              <div className="text-gray-500">등록된 유형이 없습니다.</div>
            ) : (
              <div className="divide-y">
                {types.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-gray-800">{t.name}</div>
                      {t.description ? <div className="text-sm text-gray-500">{t.description}</div> : null}
                    </div>
                    <Button variant="outline" className="border-red-500 text-red-500 bg-red-400/10 hover:bg-red-500/20 hover:text-red-950/10 transition-all duration-300" onClick={() => removeType(t.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
