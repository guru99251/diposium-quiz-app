"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { ArrowLeft, Users, Trophy, Clock, TrendingUp } from "lucide-react"

interface QuizAttempt {
  id: string
  phone_number: string
  score: number
  total_questions: number
  completed_at: string
  questions_answered: any[]
}

interface Statistics {
  totalAttempts: number
  averageScore: number
  highestScore: number
  todayAttempts: number
  recentAttempts: QuizAttempt[]
  scoreDistribution: { [key: number]: number }
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics>({
    totalAttempts: 0,
    averageScore: 0,
    highestScore: 0,
    todayAttempts: 0,
    recentAttempts: [],
    scoreDistribution: {},
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { loadStatistics() }, [])

  const loadStatistics = async () => {
    try {
      const supabase = createClient()
      const { data: attempts } = await supabase.from("quiz_attempts").select("*").order("completed_at", { ascending: false })
      if (!attempts) { setIsLoading(false); return }

      const totalAttempts = attempts.length
      const scores = attempts.map((a) => a.score)
      const averageScore = totalAttempts > 0 ? Math.round((scores.reduce((s, v) => s + v, 0) / totalAttempts) * 10) / 10 : 0
      const highestScore = totalAttempts > 0 ? Math.max(...scores) : 0

      const today = new Date().toISOString().split("T")[0]
      const todayAttempts = attempts.filter((a) => a.completed_at?.startsWith(today)).length

      const scoreDistribution: { [key: number]: number } = {}
      scores.forEach((score) => { scoreDistribution[score] = (scoreDistribution[score] || 0) + 1 })

      const recentAttempts = attempts.slice(0, 10)

      setStatistics({ totalAttempts, averageScore, highestScore, todayAttempts, recentAttempts, scoreDistribution })
    } catch (error) {
      console.error("Error loading statistics:", error)
    } finally { setIsLoading(false) }
  }

  const formatPhoneNumber = (phone: string) => phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
  const formatDate = (d: string) => new Date(d).toLocaleString("ko-KR", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

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
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--soft-text)' }}>퀴즈 통계</h1>
            <p className="text-lg" style={{ color: 'var(--soft-text-muted)' }}>퀴즈 참여 현황과 결과를 확인하세요</p>
          </div>
          <Link href="/admin">
            <Button data-accent="secondary"><ArrowLeft className="w-4 h-4 mr-2" /> 대시보드로</Button>
          </Link>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: 'var(--soft-text-muted)' }}>총 참여수</CardTitle>
              <Users className="h-4 w-4" style={{ color: 'var(--soft-accent)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--soft-text)' }}>{statistics.totalAttempts}회</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: 'var(--soft-text-muted)' }}>평균 점수</CardTitle>
              <TrendingUp className="h-4 w-4" style={{ color: 'var(--soft-accent-2)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--soft-text)' }}>{statistics.averageScore}/5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: 'var(--soft-text-muted)' }}>최고 점수</CardTitle>
              <Trophy className="h-4 w-4" style={{ color: 'var(--soft-accent-3)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--soft-text)' }}>{statistics.highestScore}/5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: 'var(--soft-text-muted)' }}>오늘 참여</CardTitle>
              <Clock className="h-4 w-4" style={{ color: 'var(--soft-accent-4)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--soft-text)' }}>{statistics.todayAttempts}회</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl" style={{ color: 'var(--soft-text)' }}>점수 분포</CardTitle>
              <CardDescription>참여자들의 점수 분포를 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[0, 1, 2, 3, 4, 5].map((score) => {
                  const count = statistics.scoreDistribution[score] || 0
                  const percentage = statistics.totalAttempts > 0 ? Math.round((count / statistics.totalAttempts) * 100) : 0
                  return (
                    <div key={score} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium" style={{ color: 'var(--soft-text-muted)' }}>{score}점</div>
                      <div className="flex-1 soft-progress">
                        <div className="bar" style={{ width: `${percentage}%` }} />
                      </div>
                      <div className="w-16 text-sm text-right" style={{ color: 'var(--soft-text-muted)' }}>
                        {count}명
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Attempts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl" style={{ color: 'var(--soft-text)' }}>최근 참여</CardTitle>
              <CardDescription>최근 10건의 참여 기록</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {statistics.recentAttempts.length > 0 ? (
                  statistics.recentAttempts.map((attempt, index) => (
                    <motion.div key={attempt.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + index * 0.03 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium" style={{ color: 'var(--soft-text)' }}>{formatPhoneNumber(attempt.phone_number)}</div>
                        <div className="text-sm" style={{ color: 'var(--soft-text-muted)' }}>{formatDate(attempt.completed_at)}</div>
                      </div>
                      <div className="text-lg font-bold" style={{ color: 'var(--soft-accent)' }}>
                        {attempt.score}/{attempt.total_questions}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8" style={{ color: 'var(--soft-text-muted)' }}>아직 참여 기록이 없습니다.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

