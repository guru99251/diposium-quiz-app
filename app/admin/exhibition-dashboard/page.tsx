"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import Link from "next/link"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trophy, Users, Sparkles, Activity, Crown, Flame, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface QuizAttempt {
  id: string
  phone_number: string | null
  score: number
  total_questions: number
  completed_at: string
  mode: string
}

interface FiveModeStats {
  perfectCount: number
  totalParticipants: number
  averageScore: number
  todayPerfectCount: number
  recentPerfects: { phone: string; completed_at: string }[]
}

interface UnlimitedStats {
  highestScore: number
  averageScore: number
  totalParticipants: number
  ranking: { phone: string; score: number }[]
}

interface TrendDatum {
  dateLabel: string
  perfectCount: number
  averageScore: number
}

const CHART_COLORS = ["#F97316", "#6366F1", "#14B8A6", "#EC4899", "#8B5CF6"]

const maskPhoneNumber = (phone?: string | null) => {
  if (!phone) {
    return "010-xxxx-0000"
  }
  const digits = phone.replace(/\D/g, "")
  const lastFour = digits.slice(-4).padStart(4, "0")
  return `010-xxxx-${lastFour}`
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function ExhibitionDashboardPage() {
  const supabase = useMemo(() => createClient(), [])
  const celebrationTimeout = useRef<NodeJS.Timeout | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fiveStats, setFiveStats] = useState<FiveModeStats>({
    perfectCount: 0,
    totalParticipants: 0,
    averageScore: 0,
    todayPerfectCount: 0,
    recentPerfects: [],
  })
  const [unlimitedStats, setUnlimitedStats] = useState<UnlimitedStats>({
    highestScore: 0,
    averageScore: 0,
    totalParticipants: 0,
    ranking: [],
  })
  const [trendData, setTrendData] = useState<TrendDatum[]>([])
  const [showCelebration, setShowCelebration] = useState(false)

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data: attempts } = await supabase
        .from("quiz_attempts")
        .select("id, phone_number, score, total_questions, completed_at, mode")
        .order("completed_at", { ascending: false })

      if (!attempts) {
        return
      }

      const fiveAttempts = attempts.filter((attempt) => attempt.mode === "random5")
      const unlimitedAttempts = attempts.filter((attempt) => attempt.mode === "unlimited")

      const totalParticipants = fiveAttempts.length
      const perfectAttempts = fiveAttempts.filter((attempt) => attempt.score >= attempt.total_questions)
      const perfectCount = perfectAttempts.length
      const averageScore =
        totalParticipants > 0
          ? Math.round((fiveAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalParticipants) * 10) / 10
          : 0

      const todayKey = new Date().toISOString().split("T")[0]
      const todayPerfectCount = perfectAttempts.filter((attempt) => attempt.completed_at.startsWith(todayKey)).length

      const recentPerfects = perfectAttempts
        .slice()
        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
        .slice(0, 8)
        .map((attempt) => ({ phone: maskPhoneNumber(attempt.phone_number), completed_at: attempt.completed_at }))

      const highestScore = unlimitedAttempts.reduce((max, attempt) => Math.max(max, attempt.score), 0)
      const unlimitedAverage =
        unlimitedAttempts.length > 0
          ? Math.round(
              (unlimitedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / unlimitedAttempts.length) * 10,
            ) / 10
          : 0

      const ranking = unlimitedAttempts
        .slice()
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((attempt) => ({ phone: maskPhoneNumber(attempt.phone_number), score: attempt.score }))

      // Trend for the last 7 days
      const trendMap = new Map<string, { perfect: number; totalScore: number; count: number }>()
      const now = new Date()

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(now.getDate() - i)
        const key = date.toISOString().split("T")[0]
        trendMap.set(key, { perfect: 0, totalScore: 0, count: 0 })
      }

      fiveAttempts.forEach((attempt) => {
        const key = attempt.completed_at.split("T")[0]
        if (trendMap.has(key)) {
          const record = trendMap.get(key)!
          record.totalScore += attempt.score
          record.count += 1
          if (attempt.score >= attempt.total_questions) {
            record.perfect += 1
          }
        }
      })

      const trend = Array.from(trendMap.entries()).map(([key, value]) => {
        const date = new Date(key)
        const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`
        const average = value.count > 0 ? Math.round((value.totalScore / value.count) * 10) / 10 : 0
        return {
          dateLabel,
          perfectCount: value.perfect,
          averageScore: average,
        }
      })

      setFiveStats({
        perfectCount,
        totalParticipants,
        averageScore,
        todayPerfectCount,
        recentPerfects,
      })
      setUnlimitedStats({
        highestScore,
        averageScore: unlimitedAverage,
        totalParticipants: unlimitedAttempts.length,
        ranking,
      })
      setTrendData(trend)
    } catch (error) {
      console.error("전시용 대시보드 데이터를 불러오는 중 오류가 발생했습니다:", error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  useEffect(() => {
    const channel = supabase
      .channel("exhibition-dashboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "quiz_attempts", filter: "mode=eq.random5" },
        (payload) => {
          const attempt = payload.new as QuizAttempt
          if (!attempt) return

          if (attempt.score >= attempt.total_questions) {
            if (celebrationTimeout.current) {
              clearTimeout(celebrationTimeout.current)
            }
            setShowCelebration(true)
            celebrationTimeout.current = setTimeout(() => {
              setShowCelebration(false)
            }, 1000)
          }

          loadDashboardData()
        },
      )
      .subscribe()

    return () => {
      if (celebrationTimeout.current) {
        clearTimeout(celebrationTimeout.current)
      }
      supabase.removeChannel(channel)
    }
  }, [supabase, loadDashboardData])

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-white/90 px-10 py-6 text-center shadow-playful"
            >
              <div className="flex items-center justify-center gap-3 text-2xl font-bold text-quiz-primary">
                <Sparkles className="h-8 w-8 text-quiz-accent" />
                새로운 만점자가 탄생했습니다!
                <Sparkles className="h-8 w-8 text-quiz-accent" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl pt-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">전시용 대시보드</h1>
            <p className="mt-2 text-white/90 drop-shadow">
              실시간 성과와 순위를 한눈에 확인하세요. "5개 퀴즈 모드"가 메인입니다.
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              관리자 홈으로
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-playful">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl text-quiz-primary">
                    <Trophy className="h-6 w-6" /> 5개 퀴즈 모드 실시간 현황
                  </CardTitle>
                  <CardDescription>만점 현황과 평균 점수를 집중 조명합니다.</CardDescription>
                </div>
                <div className="rounded-full bg-quiz-primary/10 px-4 py-1 text-sm font-semibold text-quiz-primary">
                  누적 만점자 {fiveStats.perfectCount.toLocaleString()}명 / 참여 {fiveStats.totalParticipants.toLocaleString()}명
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-gradient-to-r from-quiz-primary/90 to-quiz-secondary/90 p-4 text-white shadow-playful">
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <span>평균 점수</span>
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-3xl font-bold">{fiveStats.averageScore.toFixed(1)}</div>
                    <p className="mt-1 text-xs text-white/80">최근 7일 누적 기준</p>
                  </div>
                  <div className="rounded-2xl bg-white/90 p-4 shadow-inner">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>오늘의 만점자</span>
                      <Sparkles className="h-4 w-4 text-quiz-accent" />
                    </div>
                    <div className="mt-2 text-3xl font-bold text-quiz-accent">{fiveStats.todayPerfectCount.toLocaleString()}명</div>
                    <p className="mt-1 text-xs text-gray-500">금일 00:00 이후</p>
                  </div>
                  <div className="rounded-2xl bg-white/90 p-4 shadow-inner">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>누적 만점 비율</span>
                      <TrendingUp className="h-4 w-4 text-quiz-secondary" />
                    </div>
                    <div className="mt-2 text-3xl font-bold text-quiz-secondary">
                      {fiveStats.totalParticipants > 0
                        ? Math.round((fiveStats.perfectCount / fiveStats.totalParticipants) * 1000) / 10
                        : 0}
                      %
                    </div>
                    <p className="mt-1 text-xs text-gray-500">참여 대비 만점자 비율</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-600">최근 만점자 실시간 리스트</h3>
                    <div className="space-y-2">
                      {fiveStats.recentPerfects.length > 0 ? (
                        fiveStats.recentPerfects.map((perfect, index) => (
                          <motion.div
                            key={`${perfect.phone}-${perfect.completed_at}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between rounded-xl bg-white/90 px-4 py-3 shadow-sm"
                          >
                            <div className="flex items-center gap-3 text-gray-700">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-quiz-primary/10 text-sm font-bold text-quiz-primary">
                                {index + 1}
                              </span>
                              <span className="text-lg font-semibold">{perfect.phone}</span>
                            </div>
                            <span className="text-sm text-gray-500">{formatTime(perfect.completed_at)}</span>
                          </motion.div>
                        ))
                      ) : (
                        <div className="rounded-xl bg-white/70 px-4 py-6 text-center text-sm text-gray-500">
                          아직 만점자가 없습니다.
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-600">최근 7일 만점/평균 점수 추이</h3>
                    <div className="h-64 rounded-2xl bg-white/90 p-3 shadow-inner">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="dateLabel" stroke="#6b7280" />
                          <YAxis yAxisId="left" stroke="#F97316" allowDecimals={false} />
                          <YAxis yAxisId="right" orientation="right" stroke="#6366F1" domain={[0, 5]} allowDecimals />
                          <Tooltip
                            contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
                            formatter={(value: number, name) => {
                              if (name === "perfectCount") {
                                return [`${value}명`, "만점자"]
                              }
                              return [`${value}점`, "평균 점수"]
                            }}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="perfectCount"
                            name="perfectCount"
                            stroke="#F97316"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="averageScore"
                            name="averageScore"
                            stroke="#6366F1"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-playful">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-quiz-secondary">
                  <Crown className="h-6 w-6" /> 무제한 모드 주요 지표
                </CardTitle>
                <CardDescription>상위 기록과 참여 현황을 확인하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-r from-quiz-secondary/90 to-quiz-accent/90 p-4 text-white">
                  <div className="text-sm text-white/80">누적 최고 점수</div>
                  <div className="mt-1 text-4xl font-bold">{unlimitedStats.highestScore}</div>
                  <p className="text-xs text-white/80">역대 최고 기록</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-4 shadow-inner">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>평균 점수</span>
                    <Activity className="h-4 w-4 text-quiz-secondary" />
                  </div>
                  <div className="mt-2 text-3xl font-bold text-quiz-secondary">{unlimitedStats.averageScore.toFixed(1)}</div>
                  <p className="mt-1 text-xs text-gray-500">전체 참여자 기준</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-4 shadow-inner">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>누적 참여자</span>
                    <Users className="h-4 w-4 text-quiz-primary" />
                  </div>
                  <div className="mt-2 text-3xl font-bold text-quiz-primary">{unlimitedStats.totalParticipants.toLocaleString()}명</div>
                  <p className="mt-1 text-xs text-gray-500">무제한 모드 참여</p>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-600">누적 상위 5명</h3>
                  <div className="h-64 rounded-2xl bg-white/90 p-3 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={unlimitedStats.ranking} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" />
                        <YAxis type="category" dataKey="phone" width={120} stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
                          formatter={(value: number) => [`${value}점`, "점수"]}
                        />
                        <Bar dataKey="score" radius={[0, 12, 12, 0]}>
                          {unlimitedStats.ranking.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-playful">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-quiz-primary">
                <Flame className="h-6 w-6 text-quiz-accent" /> 실시간 하이라이트
              </CardTitle>
              <CardDescription>전시 공간에서 시선을 사로잡을 핵심 메시지를 구성했습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-gradient-to-br from-quiz-primary to-quiz-secondary p-6 text-white shadow-playful">
                  <div className="text-sm text-white/80">현재까지 만점자</div>
                  <div className="mt-2 text-4xl font-bold">{fiveStats.perfectCount.toLocaleString()}명</div>
                  <p className="mt-2 text-sm text-white/80">5개 퀴즈 모드를 정복한 참가자 수</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-quiz-secondary to-quiz-accent p-6 text-white shadow-playful">
                  <div className="text-sm text-white/80">무제한 모드 최고 점수</div>
                  <div className="mt-2 text-4xl font-bold">{unlimitedStats.highestScore}점</div>
                  <p className="mt-2 text-sm text-white/80">끊임없이 도전한 참가자들의 정점</p>
                </div>
                <div className="rounded-2xl bg-white/95 p-6 shadow-inner">
                  <div className="text-sm text-gray-500">만점자 비율</div>
                  <div className="mt-2 text-4xl font-bold text-quiz-secondary">
                    {fiveStats.totalParticipants > 0
                      ? Math.round((fiveStats.perfectCount / fiveStats.totalParticipants) * 1000) / 10
                      : 0}
                    %
                  </div>
                  <p className="mt-2 text-sm text-gray-500">참여자 중 만점자 비율</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
