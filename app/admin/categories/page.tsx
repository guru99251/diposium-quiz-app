"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

interface QuestionType { id: string; name: string; description?: string | null }

export default function CategoriesPage() {
  const supabase = createClient()
  const [types, setTypes] = useState<QuestionType[]>([])
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const { data, error } = await supabase.from("question_types").select("*").order("name")
      if (error) throw error
      setTypes(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const addType = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const payload: any = { name: name.trim() }
      if (desc.trim()) payload.description = desc.trim()
      const { error } = await supabase.from("question_types").insert(payload, { returning: "minimal" })
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
    if (!confirm("정말로 이 유형을 삭제하시겠습니까? 관련 항목이 있다면 함께 영향을 받을 수 있습니다.")) return
    try {
      const { error } = await supabase.from("question_types").delete().eq("id", id)
      if (error) throw error
      await load()
    } catch (e) {
      alert("유형 삭제 중 오류가 발생했습니다.")
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen p-4 soft-admin">
      <div className="max-w-3xl mx-auto pt-8">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--soft-text)' }}>질문 유형 관리</h1>
          <Link href="/admin">
            <Button data-accent="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" /> 관리자 홈
            </Button>
          </Link>
        </motion.div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>새 유형 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1">
                <Label htmlFor="name">이름 *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 네트워크" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="desc">설명</Label>
                <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="선택 사항" />
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={addType} disabled={saving || !name.trim()} data-accent="primary">
                <Plus className="w-4 h-4 mr-2" /> 추가
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>등록된 유형</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-gray-500">불러오는 중…</div>
            ) : types.length === 0 ? (
              <div className="text-gray-500">등록된 유형이 없습니다.</div>
            ) : (
              <div className="divide-y">
                {types.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium" style={{ color: 'var(--soft-text)' }}>{t.name}</div>
                      {t.description ? <div className="text-sm" style={{ color: 'var(--soft-text-muted)' }}>{t.description}</div> : null}
                    </div>
                    <Button size="icon" variant="destructive" onClick={() => removeType(t.id)} aria-label={`${t.name} 삭제`}>
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

