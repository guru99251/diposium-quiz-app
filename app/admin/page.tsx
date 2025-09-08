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

      // Get total questions
      const { count: questionsCount } = await supabase.from("questions").select("*", { count: "exact", head: true })

      // Get attempts including total_questions and phone
      const { data: attempts } = await supabase
        .from("quiz_attempts")
        .select("score, total_questions, completed_at, phone_number, mode")

      // Get today's attempts
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">관리자 대시보드</h1>
          <p className="text-white/90 text-lg drop-shadow">퀴즈 문제와 결과를 관리하세요</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">총 문제 수</CardTitle>
                <BookOpen className="h-4 w-4 text-quiz-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-quiz-primary">{stats.totalQuestions}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">총 참여자</CardTitle>
                <Users className="h-4 w-4 text-quiz-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-quiz-secondary">{stats.totalAttempts}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">평균 점수</CardTitle>
                <BarChart3 className="h-4 w-4 text-quiz-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-quiz-accent">{stats.averageScore}/5</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">오늘 참여자</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.todayAttempts}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Unlimited Mode Ranking */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-8">
          <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">질문 무제한 모드 랭킹 (연속 정답)</CardTitle>
              <CardDescription>최대 연속 정답 기록 Top 5</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.unlimitedTop.length > 0 ? (
                <div className="space-y-2">
                  {stats.unlimitedTop.map((row, idx) => (
                    <div key={row.phone_number + idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center text-gray-600 font-semibold">{idx + 1}</span>
                        <span className="font-medium text-gray-800">{row.phone_number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}</span>
                      </div>
                      <div className="text-quiz-primary font-bold">{row.score}개</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">아직 무제한 모드 기록이 없습니다.</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="border-0 shadow-playful hover:shadow-playful-hover transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-quiz-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-quiz-primary" />
                </div>
                <CardTitle className="text-xl text-quiz-primary">문제 관리</CardTitle>
                <CardDescription>퀴즈 문제를 추가, 수정, 삭제할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/admin/questions">
                  <Button className="w-full bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover">
                    문제 관리하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="border-0 shadow-playful hover:shadow-playful-hover transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-quiz-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-quiz-secondary" />
                </div>
                <CardTitle className="text-xl text-quiz-secondary">통계 보기</CardTitle>
                <CardDescription>퀴즈 참여 통계와 결과를 확인할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/admin/statistics">
                  <Button className="w-full bg-gradient-to-r from-quiz-secondary to-quiz-accent hover:from-quiz-accent hover:to-quiz-secondary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover text-white">
                    통계 보기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="border-0 shadow-playful hover:shadow-playful-hover transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-quiz-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-quiz-accent" />
                </div>
                <CardTitle className="text-xl text-quiz-accent">빠른 문제 추가</CardTitle>
                <CardDescription>새로운 퀴즈 문제를 빠르게 추가할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/admin/questions/new">
                  <Button className="w-full bg-gradient-to-r from-quiz-accent to-quiz-primary hover:from-quiz-primary hover:to-quiz-accent transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover text-white">
                    문제 추가하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              홈으로 돌아가기
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
