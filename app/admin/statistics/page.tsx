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

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      const supabase = createClient()

      // Get all quiz attempts
      const { data: attempts } = await supabase
        .from("quiz_attempts")
        .select("*")
        .order("completed_at", { ascending: false })

      if (!attempts) {
        setIsLoading(false)
        return
      }

      // Calculate statistics
      const totalAttempts = attempts.length
      const scores = attempts.map((a) => a.score)
      const averageScore =
        totalAttempts > 0 ? Math.round((scores.reduce((sum, score) => sum + score, 0) / totalAttempts) * 10) / 10 : 0
      const highestScore = totalAttempts > 0 ? Math.max(...scores) : 0

      // Today's attempts
      const today = new Date().toISOString().split("T")[0]
      const todayAttempts = attempts.filter((a) => a.completed_at.startsWith(today)).length

      // Score distribution
      const scoreDistribution: { [key: number]: number } = {}
      scores.forEach((score) => {
        scoreDistribution[score] = (scoreDistribution[score] || 0) + 1
      })

      // Recent attempts (last 10)
      const recentAttempts = attempts.slice(0, 10)

      setStatistics({
        totalAttempts,
        averageScore,
        highestScore,
        todayAttempts,
        recentAttempts,
        scoreDistribution,
      })
    } catch (error) {
      console.error("Error loading statistics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">퀴즈 통계</h1>
            <p className="text-white/90 text-lg drop-shadow">퀴즈 참여 현황과 결과를 확인하세요</p>
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">총 참여 수</CardTitle>
                <Users className="h-4 w-4 text-quiz-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-quiz-primary">{statistics.totalAttempts}명</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">평균 점수</CardTitle>
                <TrendingUp className="h-4 w-4 text-quiz-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-quiz-secondary">{statistics.averageScore}/5</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">최고 점수</CardTitle>
                <Trophy className="h-4 w-4 text-quiz-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-quiz-accent">{statistics.highestScore}/5</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">오늘 참여 수</CardTitle>
                <Clock className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{statistics.todayAttempts}명</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
              <CardHeader>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">점수 분포</CardTitle>
                <CardDescription>점수별 참여 현황을 확인해요</CardDescription>
              <CardContent>
                <div className="space-y-3">
                  {[0, 1, 2, 3, 4, 5].map((score) => {
                    const count = statistics.scoreDistribution[score] || 0
                    const percentage =
                      statistics.totalAttempts > 0 ? Math.round((count / statistics.totalAttempts) * 100) : 0

                    return (
                      <div key={score} className="flex items-center gap-4">
                        <div className="w-12 text-sm font-medium text-gray-600">{score}점</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.6 + score * 0.1, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-quiz-primary to-quiz-secondary"
                          />
                        </div>
                        <div className="w-16 text-sm text-gray-600 text-right">
                          {count}명 ({percentage}%)
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Attempts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">최근 참여</CardTitle>
                <CardDescription>최근 퀴즈 참여자들의 결과입니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {statistics.recentAttempts.length > 0 ? (
                    statistics.recentAttempts.map((attempt, index) => (
                      <motion.div
                        key={attempt.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-800">{formatPhoneNumber(attempt.phone_number)}</div>
                          <div className="text-sm text-gray-500">{formatDate(attempt.completed_at)}</div>
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            attempt.score >= 4
                              ? "text-green-600"
                              : attempt.score >= 3
                                ? "text-blue-600"
                                : attempt.score >= 2
                                  ? "text-yellow-600"
                                  : "text-red-600"
                          }`}
                        >
                          {attempt.score}/{attempt.total_questions}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">아직 참여 기록이 없습니다.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
