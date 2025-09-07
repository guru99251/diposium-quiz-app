import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Users, BarChart3, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-16">
          <h1 className="brutalist-title text-black mb-6 uppercase tracking-tight">퀴즈 앱</h1>
          <p className="brutalist-subtitle text-black max-w-3xl mx-auto uppercase font-bold">
            지식을 테스트하고 도전하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-16">
          {/* User Quiz Card */}
          <Card className="brutalist-border brutalist-shadow brutalist-transition brutalist-hover bg-white">
            <CardHeader className="text-center p-8">
              <div className="w-20 h-20 bg-orange-500 flex items-center justify-center mx-auto mb-6 brutalist-border">
                <QrCode className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-black font-black uppercase mb-4">퀴즈 참여</CardTitle>
              <CardDescription className="text-xl text-black font-bold">전화번호 입력 후 바로 시작</CardDescription>
            </CardHeader>
            <CardContent className="text-center p-8 pt-0">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="w-full text-xl py-8 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase brutalist-border brutalist-shadow brutalist-transition brutalist-click brutalist-focus border-0"
                >
                  퀴즈 시작
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="brutalist-border brutalist-shadow brutalist-transition brutalist-hover bg-white">
            <CardHeader className="text-center p-8">
              <div className="w-20 h-20 bg-green-500 flex items-center justify-center mx-auto mb-6 brutalist-border">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-black font-black uppercase mb-4">관리자</CardTitle>
              <CardDescription className="text-xl text-black font-bold">문제 관리 및 통계 확인</CardDescription>
            </CardHeader>
            <CardContent className="text-center p-8 pt-0">
              <Link href="/admin">
                <Button
                  size="lg"
                  className="w-full text-xl py-8 bg-green-500 hover:bg-green-600 text-white font-black uppercase brutalist-border brutalist-shadow brutalist-transition brutalist-click brutalist-focus border-0"
                >
                  관리자 모드
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="brutalist-border brutalist-shadow bg-blue-500 text-white brutalist-transition brutalist-hover">
            <CardHeader className="p-6">
              <div className="w-16 h-16 bg-white flex items-center justify-center mb-4 brutalist-border">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <CardTitle className="text-2xl font-black uppercase">간편 참여</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-lg font-bold">전화번호만 입력하면 바로 퀴즈 시작</p>
            </CardContent>
          </Card>

          <Card className="brutalist-border brutalist-shadow bg-purple-500 text-white brutalist-transition brutalist-hover md:mt-8">
            <CardHeader className="p-6">
              <div className="w-16 h-16 bg-white flex items-center justify-center mb-4 brutalist-border">
                <QrCode className="w-8 h-8 text-purple-500" />
              </div>
              <CardTitle className="text-2xl font-black uppercase">다양한 문제</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-lg font-bold">학과, 전시, 전공별 맞춤 문제</p>
            </CardContent>
          </Card>

          <Card className="brutalist-border brutalist-shadow bg-red-500 text-white brutalist-transition brutalist-hover">
            <CardHeader className="p-6">
              <div className="w-16 h-16 bg-white flex items-center justify-center mb-4 brutalist-border">
                <BarChart3 className="w-8 h-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-black uppercase">실시간 결과</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-lg font-bold">즉시 점수 확인 및 통계 제공</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
