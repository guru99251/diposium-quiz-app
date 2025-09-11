"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { BookOpen, BarChart3, Users, Plus } from "lucide-react"

interface DashboardStats {
  totalQuestions: number
  totalAttempts: number
  averageScore: number
  todayAttempts: number
  unlimitedTop: { phone_number: string; score: number }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuestions: 0,
    totalAttempts: 0,
    averageScore: 0,
    todayAttempts: 0,
    unlimitedTop: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const supabase = createClient()

      const { count: questionsCount } = await supabase.from("questions").select("*", { count: "exact", head: true })

      const { data: attempts } = await supabase
        .from("quiz_attempts")
        .select("score, total_questions, completed_at, phone_number, mode")

      const today = new Date().toISOString().split("T")[0]
      const { count: todayCount } = await supabase
        .from("quiz_attempts")
        .select("*", { count: "exact", head: true })
        .gte("completed_at", `${today}T00:00:00.000Z`)
        .lt("completed_at", `${today}T23:59:59.999Z`)

      const totalAttempts = attempts?.length || 0
      const fiveAttempts = (attempts || []).filter((a) => (a as any).mode === "random5")
      const averageScore =
        fiveAttempts.length > 0
          ? Math.round(((fiveAttempts.reduce((sum, a) => sum + a.score, 0) || 0) / fiveAttempts.length) * 10) / 10
          : 0

      const unlimited = (attempts || []).filter((a) => (a as any).mode === "unlimited")
      const unlimitedTop = unlimited
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((a) => ({ phone_number: a.phone_number, score: a.score }))

      setStats({
        totalQuestions: questionsCount || 0,
        totalAttempts,
        averageScore,
        todayAttempts: todayCount || 0,
        unlimitedTop,
      })
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen soft-admin flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-[var(--soft-accent)] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 soft-admin">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--soft-text)" }}>관리자 대시보드</h1>
          <p className="text-lg" style={{ color: "var(--soft-text-muted)" }}>퀴즈 문제와 결과를 관리하세요</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: "var(--soft-text-muted)" }}>전체 문제</CardTitle>
                <BookOpen className="h-4 w-4" style={{ color: "var(--soft-accent)" }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "var(--soft-text)" }}>{stats.totalQuestions}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: "var(--soft-text-muted)" }}>전체 참여</CardTitle>
                <Users className="h-4 w-4" style={{ color: "var(--soft-accent-2)" }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "var(--soft-text)" }}>{stats.totalAttempts}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: "var(--soft-text-muted)" }}>평균 점수</CardTitle>
                <BarChart3 className="h-4 w-4" style={{ color: "var(--soft-accent-3)" }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "var(--soft-text)" }}>{stats.averageScore}/5</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: "var(--soft-text-muted)" }}>오늘 참여</CardTitle>
                <Users className="h-4 w-4" style={{ color: "var(--soft-accent-4)" }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: "var(--soft-text)" }}>{stats.todayAttempts}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Unlimited Mode Ranking */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl" style={{ color: "var(--soft-text)" }}>무제한 모드 최고 점수</CardTitle>
              <CardDescription>최고 점수 Top 5</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.unlimitedTop.length > 0 ? (
                <div className="space-y-2">
                  {stats.unlimitedTop.map((row, idx) => (
                    <div key={row.phone_number + idx} className="flex items-center justify-between p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-semibold" style={{ color: "var(--soft-text-muted)" }}>{idx + 1}</span>
                        <span className="font-medium" style={{ color: "var(--soft-text)" }}>{row.phone_number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}</span>
                      </div>
                      <div className="font-bold" style={{ color: "var(--soft-accent)" }}>{row.score}점</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "var(--soft-text-muted)" }}>아직 기록이 없습니다.</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 neu-surface neu-concave">
                  <BookOpen className="w-8 h-8" style={{ color: "var(--soft-accent)" }} />
                </div>
                <CardTitle className="text-xl" style={{ color: "var(--soft-text)" }}>문제 관리</CardTitle>
                <CardDescription>퀴즈 문제 추가/수정/삭제</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/admin/questions" prefetch={false}>
                  <Button className="w-full" data-accent="primary">문제 관리하기</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 neu-surface neu-concave">
                  <BarChart3 className="w-8 h-8" style={{ color: "var(--soft-accent-2)" }} />
                </div>
                <CardTitle className="text-xl" style={{ color: "var(--soft-text)" }}>통계 보기</CardTitle>
                <CardDescription>참여 통계와 결과 확인</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/admin/statistics" prefetch={false}>
                  <Button className="w-full" data-accent="secondary">통계 보기</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 neu-surface neu-concave">
                  <Plus className="w-8 h-8" style={{ color: "var(--soft-accent-3)" }} />
                </div>
                <CardTitle className="text-xl" style={{ color: "var(--soft-text)" }}>빠른 문제 추가</CardTitle>
                <CardDescription>바로 퀴즈 문제 등록</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/admin/questions/new" prefetch={false}>
                  <Button className="w-full" data-accent="success">문제 추가하기</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 neu-surface neu-concave">
                  <Plus className="w-8 h-8" style={{ color: "var(--soft-accent-4)" }} />
                </div>
                <CardTitle className="text-xl" style={{ color: "var(--soft-text)" }}>문제 유형 관리</CardTitle>
                <CardDescription>유형 추가/삭제</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/admin/categories" prefetch={false}>
                  <Button className="w-full" data-accent="warning">유형 관리하기</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Back to Home */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-8">
          <Link href="/" prefetch={false}>
            <Button data-accent="secondary">뒤로 돌아가기</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

