
"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Award, BarChart3, Medal, Sparkles, Trophy, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface RawAttempt {
  id: string
  phone_number: string | null
  score: number | null
  total_questions: number | null
  completed_at: string
  mode: string
}

interface RandomFiveStats {
  totalParticipants: number
  perfectCount: number
  averageScore: number
  todayPerfectCount: number
  recentPerfects: { id: string; phone: string; completed_at: string }[]
  dailyPerfectSeries: { date: string; count: number }[]
}

interface UnlimitedStats {
  highestScore: number
  averageScore: number
  participantCount: number
  rankings: { rank: number; phone: string; score: number }[]
  rankingChart: { name: string; score: number; phone: string }[]
}

const initialRandomFiveStats: RandomFiveStats = {
  totalParticipants: 0,
  perfectCount: 0,
  averageScore: 0,
  todayPerfectCount: 0,
  recentPerfects: [],
  dailyPerfectSeries: [],
}

const initialUnlimitedStats: UnlimitedStats = {
  highestScore: 0,
  averageScore: 0,
  participantCount: 0,
  rankings: [],
  rankingChart: [],
}


export default function ExhibitionDashboardPage() {
  const supabase = useMemo(() => createClient(), [])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [randomFiveStats, setRandomFiveStats] = useState<RandomFiveStats>(initialRandomFiveStats)
  const [unlimitedStats, setUnlimitedStats] = useState<UnlimitedStats>(initialUnlimitedStats)
  const [celebration, setCelebration] = useState<string | null>(null)

  const loadData = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) {
        setIsInitialLoading(true)
      }

      try {
        const [randomFiveResult, unlimitedResult] = await Promise.all([
          supabase
            .from("quiz_attempts")
            .select("id, phone_number, score, total_questions, completed_at, mode")
            .eq("mode", "random5")
            .order("completed_at", { ascending: false }),
          supabase
            .from("quiz_attempts")
            .select("id, phone_number, score, total_questions, completed_at, mode")
            .eq("mode", "unlimited")
            .order("score", { ascending: false }),
        ])

        if (randomFiveResult.error) {
          throw randomFiveResult.error
        }
        if (unlimitedResult.error) {
          throw unlimitedResult.error
        }

        const randomFiveAttempts: RawAttempt[] = randomFiveResult.data ?? []
        const unlimitedAttempts: RawAttempt[] = unlimitedResult.data ?? []

        const processedRandomFive = buildRandomFiveStats(randomFiveAttempts)
        const processedUnlimited = buildUnlimitedStats(unlimitedAttempts)

        setRandomFiveStats(processedRandomFive)
        setUnlimitedStats(processedUnlimited)
      } catch (error) {
        console.error("전시용 대시보드 데이터를 불러오지 못했습니다.", error)
      } finally {
        setIsInitialLoading(false)
      }
    },
    [supabase],
  )

  useEffect(() => {
    loadData(true)
      .catch((error) => console.error("전시용 대시보드 초기 로드 실패", error))

    const interval = setInterval(() => {
      loadData(false).catch((error) => console.error("전시용 대시보드 갱신 실패", error))
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [loadData])

  useEffect(() => {
    const channel = supabase
      .channel("random5-perfect-score-stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "quiz_attempts", filter: "mode=eq.random5" },
        (payload) => {
          const attempt = payload.new as RawAttempt
          if (!attempt) return
          const total = attempt.total_questions ?? 0
          const score = attempt.score ?? 0
          if (total > 0 && score >= total) {
            const maskedPhone = maskPhoneNumber(attempt.phone_number)
            setCelebration(maskedPhone)
            loadData(false).catch((error) => console.error("실시간 데이터 갱신 실패", error))
            setTimeout(() => setCelebration(null), 1000)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadData, supabase])

  if (isInitialLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary/20 via-quiz-secondary/20 to-quiz-accent/30">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">전시용 라이브 대시보드</h1>
            <p className="text-white/90 drop-shadow">현장의 열기를 실시간으로 보여주는 집중형 모니터링 화면입니다.</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> 관리자 홈으로
            </Button>
          </Link>
        </header>

        <AnimatePresence>
          {celebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="rounded-3xl border border-white/60 bg-gradient-to-r from-quiz-accent/80 to-quiz-primary/80 text-white shadow-lg px-6 py-4 flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              <div>
                <p className="text-sm uppercase tracking-wide">축하 폭죽!</p>
                <p className="text-lg font-semibold">{celebration} 님이 5문제 만점을 달성했습니다!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white drop-shadow">5문제 퀴즈 모드 실시간 현황</h2>
            <span className="text-sm text-white/80">누적 만점자 {randomFiveStats.perfectCount.toLocaleString()}명 · 참여 {randomFiveStats.totalParticipants.toLocaleString()}명</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="누적 만점자 / 참여자"
              description="한눈에 보는 핵심 지표"
              icon={<Trophy className="w-5 h-5 text-white" />}
              cardClassName="bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 text-white border border-transparent shadow-xl"
              iconWrapperClassName="bg-white/20 shadow-none"
              titleClassName="text-white"
              descriptionClassName="text-white/80"
              contentClassName="text-white"
            >
              <div className="text-3xl font-bold text-white">
                {randomFiveStats.perfectCount.toLocaleString()} / {randomFiveStats.totalParticipants.toLocaleString()}
              </div>
              <p className="text-sm text-white/80">만점률 {formatRatio(randomFiveStats.perfectCount, randomFiveStats.totalParticipants)}%</p>
            </StatCard>

            <StatCard
              title="평균 점수"
              description="누적 응시 기준"
              icon={<BarChart3 className="w-5 h-5 text-white" />}
              cardClassName="bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500 text-white border border-transparent shadow-xl"
              iconWrapperClassName="bg-white/15 shadow-none"
              titleClassName="text-white"
              descriptionClassName="text-white/80"
              contentClassName="text-white"
            >
              <div className="text-3xl font-bold text-white">{randomFiveStats.averageScore.toFixed(1)}점</div>
              <p className="text-sm text-white/80">집계 전체 평균</p>
            </StatCard>

            <StatCard
              title="오늘의 만점자"
              description="금일 00시 기준"
              icon={<Sparkles className="w-5 h-5 text-quiz-accent" />}
            >
              <div className="text-3xl font-bold text-quiz-accent">{randomFiveStats.todayPerfectCount.toLocaleString()}명</div>
              <p className="text-sm text-muted-foreground">지금도 계속 증가 중!</p>
            </StatCard>

            <StatCard
              title="최근 만점 속도"
              description="마지막 만점 기준"
              icon={<Users className="w-5 h-5 text-quiz-primary" />}
            >
              <div className="text-xl font-semibold text-quiz-primary">
                {randomFiveStats.recentPerfects.length > 0
                  ? formatRelativeTime(randomFiveStats.recentPerfects[0].completed_at)
                  : "기록 없음"}
              </div>
              <p className="text-sm text-muted-foreground">방금 갱신된 라이브 기록</p>
            </StatCard>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-white/30 bg-white/90 backdrop-blur shadow-playful">
              <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">최근 7일 만점 추이</CardTitle>
                  <CardDescription>일자별 5문제 만점자 수</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-medium text-quiz-primary">
                    <Trophy className="w-4 h-4" /> 만점자 수
                  </span>
                </div>
              </CardHeader>
              <CardContent className="h-72">
                {randomFiveStats.dailyPerfectSeries.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={randomFiveStats.dailyPerfectSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="perfectGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
                      <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
                      <Tooltip
                        contentStyle={{ borderRadius: "0.75rem", border: "1px solid rgba(148,163,184,0.4)", background: "rgba(255,255,255,0.95)" }}
                        formatter={(value: number) => [`${value}명`, "만점자"]}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Area type="monotone" dataKey="count" stroke="var(--chart-1)" fill="url(#perfectGradient)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="만점 데이터가 아직 없습니다." />
                )}
              </CardContent>
            </Card>

            <Card className="border-white/30 bg-white/90 backdrop-blur shadow-playful">
              <CardHeader>
                <CardTitle className="text-lg">실시간 만점자</CardTitle>
                <CardDescription>최신 순으로 8명까지 표시합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {randomFiveStats.recentPerfects.length > 0 ? (
                    randomFiveStats.recentPerfects.map((perfect) => (
                      <motion.li
                        key={perfect.id}
                        layout
                        className="flex items-center justify-between rounded-xl border border-white/50 bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm backdrop-blur-sm"
                      >
                        <span>{perfect.phone}</span>
                        <span className="text-xs text-slate-500">{formatTime(perfect.completed_at)}</span>
                      </motion.li>
                    ))
                  ) : (
                    <EmptyState message="아직 만점자가 없습니다." />
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white drop-shadow">무제한 모드 누적 성과</h2>
            <span className="text-sm text-white/80">누적 최고 {unlimitedStats.highestScore.toLocaleString()}점 · 참가자 {unlimitedStats.participantCount.toLocaleString()}명</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="누적 최고 점수"
              description="최고 기록 보유자"
              icon={<Award className="w-5 h-5 text-white" />}
              cardClassName="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white border border-transparent shadow-xl"
              iconWrapperClassName="bg-white/20 shadow-none"
              titleClassName="text-white"
              descriptionClassName="text-white/80"
              contentClassName="text-white"
            >
              <div className="text-3xl font-bold text-white">{unlimitedStats.highestScore.toLocaleString()}점</div>
              <p className="text-sm text-white/80">한계 없는 도전의 결과</p>
            </StatCard>

            <StatCard
              title="평균 점수"
              description="전체 무제한 응시"
              icon={<BarChart3 className="w-5 h-5 text-quiz-secondary" />}
            >
              <div className="text-3xl font-bold text-quiz-secondary">{unlimitedStats.averageScore.toFixed(1)}점</div>
              <p className="text-sm text-muted-foreground">꾸준한 실력 향상 지표</p>
            </StatCard>

            <StatCard
              title="누적 참여자"
              description="중복 번호 1회로 계산"
              icon={<Users className="w-5 h-5 text-quiz-accent" />}
            >
              <div className="text-3xl font-bold text-quiz-accent">{unlimitedStats.participantCount.toLocaleString()}명</div>
              <p className="text-sm text-muted-foreground">고정 팬층이 늘고 있어요</p>
            </StatCard>

            <StatCard
              title="상위 1위 점수"
              description="Top Rank"
              icon={<Medal className="w-5 h-5 text-quiz-primary" />}
            >
              <div className="text-3xl font-bold text-quiz-primary">
                {unlimitedStats.rankings.length > 0 ? `${unlimitedStats.rankings[0].score.toLocaleString()}점` : "기록 없음"}
              </div>
              <p className="text-sm text-muted-foreground">
                {unlimitedStats.rankings.length > 0 ? `${unlimitedStats.rankings[0].phone}` : "최고 기록을 기다리는 중"}
              </p>
            </StatCard>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="border-white/30 bg-white/90 backdrop-blur shadow-playful">
              <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">무제한 모드 랭킹 TOP 8</CardTitle>
                  <CardDescription>전화번호 마스킹으로 안전하게 표시합니다.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {unlimitedStats.rankings.length > 0 ? (
                  <ul className="space-y-2">
                    {unlimitedStats.rankings.map((entry) => (
                      <li
                        key={`${entry.rank}-${entry.phone}`}
                        className="flex items-center justify-between rounded-xl border border-white/50 bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 px-4 py-3 text-sm text-slate-800 shadow-sm backdrop-blur-sm"
                      >
                        <span className="font-semibold">{entry.rank}위</span>
                        <div className="flex-1 px-4 text-center font-medium">{entry.phone}</div>
                        <span className="font-semibold text-quiz-primary">{entry.score.toLocaleString()}점</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState message="랭킹 데이터가 아직 없습니다." />
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-white/30 bg-white/90 backdrop-blur shadow-playful">
              <CardHeader>
                <CardTitle className="text-lg">상위 5위 점수 분포</CardTitle>
                <CardDescription>막대 그래프로 한눈에 확인하세요.</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                {unlimitedStats.rankingChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={unlimitedStats.rankingChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
                      <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
                      <Tooltip
                        contentStyle={{ borderRadius: "0.75rem", border: "1px solid rgba(148,163,184,0.4)", background: "rgba(255,255,255,0.95)" }}
                        formatter={(value: number, _name: string, payload) => [
                          `${value.toLocaleString()}점`,
                          (payload && typeof payload.payload.phone === "string" ? payload.payload.phone : "전화번호"),
                        ]}
                        labelFormatter={() => "순위"}
                      />
                      <Bar dataKey="score" fill="var(--chart-2)" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="표시할 랭킹이 없습니다." />
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

function buildRandomFiveStats(attempts: RawAttempt[]): RandomFiveStats {
  if (attempts.length === 0) {
    return initialRandomFiveStats
  }

  const perfects = attempts.filter((attempt) => {
    const total = attempt.total_questions ?? 0
    const score = attempt.score ?? 0
    return total > 0 && score >= total
  })

  const totalParticipants = attempts.length
  const perfectCount = perfects.length
  const averageScore = totalParticipants > 0 ? attempts.reduce((sum, attempt) => sum + (attempt.score ?? 0), 0) / totalParticipants : 0

  const todayStart = startOfToday()
  const tomorrowStart = new Date(todayStart)
  tomorrowStart.setDate(tomorrowStart.getDate() + 1)

  const todayPerfectCount = perfects.filter((attempt) => {
    const time = new Date(attempt.completed_at)
    return time >= todayStart && time < tomorrowStart
  }).length

  const dailyPerfectSeries = buildDailySeries(perfects, 7)

  const recentPerfects = perfects
    .slice(0, 8)
    .map((attempt) => ({ id: attempt.id, phone: maskPhoneNumber(attempt.phone_number), completed_at: attempt.completed_at }))

  return {
    totalParticipants,
    perfectCount,
    averageScore: Math.round(averageScore * 10) / 10,
    todayPerfectCount,
    recentPerfects,
    dailyPerfectSeries,
  }
}

function buildUnlimitedStats(attempts: RawAttempt[]): UnlimitedStats {
  if (attempts.length === 0) {
    return initialUnlimitedStats
  }

  const highestScore = attempts.reduce((max, attempt) => Math.max(max, attempt.score ?? 0), 0)
  const averageScore = attempts.reduce((sum, attempt) => sum + (attempt.score ?? 0), 0) / attempts.length

  const bestScoreByPhone = new Map<string, number>()

  attempts.forEach((attempt) => {
    const phone = attempt.phone_number?.trim() || ""
    const currentBest = bestScoreByPhone.get(phone) ?? 0
    const score = attempt.score ?? 0
    if (score > currentBest) {
      bestScoreByPhone.set(phone, score)
    }
  })

  const rankings = Array.from(bestScoreByPhone.entries())
    .map(([phone, score]) => ({ phone: maskPhoneNumber(phone), score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  const rankingChart = rankings.slice(0, 5).map((entry, index) => ({ name: `${index + 1}위`, score: entry.score, phone: entry.phone }))

  const participantCount = bestScoreByPhone.size

  return {
    highestScore,
    averageScore: Math.round(averageScore * 10) / 10,
    participantCount,
    rankings,
    rankingChart,
  }
}

function buildDailySeries(attempts: RawAttempt[], days: number) {
  const today = startOfToday()
  const series = [] as { date: string; count: number }[]

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = new Date(today)
    dayStart.setDate(today.getDate() - i)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    const count = attempts.filter((attempt) => {
      const time = new Date(attempt.completed_at)
      return time >= dayStart && time < dayEnd
    }).length

    series.push({ date: `${dayStart.getMonth() + 1}/${dayStart.getDate()}`, count })
  }

  return series
}

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

function formatRatio(perfectCount: number, totalParticipants: number) {
  if (totalParticipants === 0) return 0
  const ratio = (perfectCount / totalParticipants) * 100
  return Math.round(ratio)
}

function maskPhoneNumber(phone: string | null | undefined) {
  if (!phone) {
    return "010-xxxx-0000"
  }

  const digits = phone.replace(/\D/g, "")
  const lastFour = digits.slice(-4).padStart(4, "0")
  return `010-xxxx-${lastFour}`
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
}

function formatRelativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.round(diff / (60 * 1000))
  if (minutes <= 1) return "방금"
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.round(hours / 24)
  return `${days}일 전`
}

function StatCard({
  title,
  description,
  icon,
  children,
  cardClassName,
  iconWrapperClassName,
  titleClassName,
  descriptionClassName,
  contentClassName,
}: {
  title: string
  description: string
  icon?: ReactNode
  children: ReactNode
  cardClassName?: string
  iconWrapperClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  contentClassName?: string
}) {
  const cardClasses = ["border-white/30 bg-white/90 backdrop-blur shadow-playful", cardClassName]
    .filter(Boolean)
    .join(" ")
  const iconClasses = [
    "rounded-full bg-gradient-to-br from-indigo-100 via-sky-100 to-cyan-100 p-2 shadow-inner",
    iconWrapperClassName,
  ]
    .filter(Boolean)
    .join(" ")
  const titleClasses = ["text-sm text-slate-600", titleClassName].filter(Boolean).join(" ")
  const descriptionClasses = [descriptionClassName].filter(Boolean).join(" ")
  const contentClasses = ["space-y-2 text-slate-700", contentClassName].filter(Boolean).join(" ")

  return (
    <Card className={cardClasses}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className={titleClasses}>{title}</CardTitle>
          <CardDescription className={descriptionClasses}>{description}</CardDescription>
        </div>
        {icon && <div className={iconClasses}>{icon}</div>}
      </CardHeader>
      <CardContent className={contentClasses}>{children}</CardContent>
    </Card>
  )
}
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[120px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-8 text-center text-sm text-slate-500">
      {message}
    </div>
  )
}
