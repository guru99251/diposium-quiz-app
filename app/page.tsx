"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Users, BarChart3, Settings, ArrowUpRight, ArrowUp, Info } from "lucide-react"
import { motion } from "framer-motion"

export const dynamic = 'force-static'

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--neu-bg)]" data-quiz-homepage>
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--neu-text)] mb-3">디포지움 퀴즈</h1>
          <p className="text-base md:text-lg text-[color-mix(in_oklab,var(--neu-text)_70%,transparent)] max-w-2xl mx-auto">
            가벼운 소프트 UI 감성으로 새롭게 디자인된 퀴즈 앱.
          </p>
        </motion.div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* User Quiz Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="transition-transform duration-200 hover:-translate-y-0.5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 neu-surface--inset flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-[var(--neu-text)]" />
                </div>
                <CardTitle className="text-2xl">퀴즈 참여하기</CardTitle>
                <CardDescription className="text-[var(--neu-muted)]">QR 스캔 또는 주소 접속 후 시작</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/quiz" prefetch={false}>
                  <Button size="lg" variant="convex" className="w-full text-lg py-6">
                    시작하기
                    <ArrowUpRight className="ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="transition-transform duration-200 hover:-translate-y-0.5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 neu-surface--inset flex items-center justify-center">
                  <Settings className="w-8 h-8 text-[var(--neu-text)]" />
                </div>
                <CardTitle className="text-2xl">관리자 모드</CardTitle>
                <CardDescription className="text-[var(--neu-muted)]">문제 관리와 참여 현황 보기</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/admin" prefetch={false}>
                  <Button size="lg" variant="concave" className="w-full text-lg py-6">
                    대시보드 열기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Neumorphic Revenue Card (style guide demo) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto mb-12">
          <div className="neu-revenue-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="neu-revenue-title text-[var(--neu-text)]">Monthly Revenue</div>
                <div className="neu-revenue-value text-4xl md:text-5xl mt-1" aria-live="polite">$14,850</div>
              </div>
              <div className="neu-chip text-sm" aria-label="Change">
                <ArrowUp className="w-4 h-4" />
                <span className="font-medium">+5.2%</span>
              </div>
            </div>
            <div className="mt-5 flex gap-3 flex-wrap">
              <Button variant="convex" className="px-5">
                View Report
                <ArrowUpRight className="ml-2" />
              </Button>
              <Button variant="concave" className="px-5">
                Details
                <Info className="ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 neu-surface--inset">
                <Users className="w-6 h-6 text-[var(--neu-text)]" />
              </div>
              <CardTitle>간편 참여</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--neu-muted)]">전화번호 입력 후 바로 시작</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 neu-surface--inset">
                <QrCode className="w-6 h-6 text-[var(--neu-text)]" />
              </div>
              <CardTitle>다양한 문제</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--neu-muted)]">주제에 맞춘 문제 제공</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 neu-surface--inset">
                <BarChart3 className="w-6 h-6 text-[var(--neu-text)]" />
              </div>
              <CardTitle>실시간 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--neu-muted)]">즉시 점수 확인 및 통계</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


