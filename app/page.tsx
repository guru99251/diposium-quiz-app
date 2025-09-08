import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Users, BarChart3, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen" data-quiz-homepage>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance drop-shadow-lg"> 🎁 디포지엄 QUIZ ! 🎁 </h1>
          <p className="text-xl text-white/90 text-pretty max-w-2xl mx-auto drop-shadow">
            가볍게 즐기는 퀴즈! 지식, 인공지능, 전시까지 테스트해보세요.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* User Quiz Card */}
          <Card className="border-0 shadow-playful hover:shadow-playful-hover transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-sky-500" />
              </div>
              <CardTitle className="text-2xl text-sky-500">퀴즈 참여하기</CardTitle>
              <CardDescription className="text-lg">
                QR 코드를 스캔하거나 바로 접속하여 퀴즈를 시작해 보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="w-full text-lg py-6 rounded-xl bg-sky-600 hover:bg-sky-700 transition-all duration-300 hover:scale-105 shadow-playful hover:shadow-playful-hover text-white border-0"
                >
                  퀴즈 시작하기 ▶
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="border-0 shadow-playful hover:shadow-playful-hover transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-amber-500" />
              </div>
              <CardTitle className="text-2xl text-amber-500">愿由ъ옄 紐⑤뱶</CardTitle>
              <CardDescription className="text-lg">문제 관리와 퀴즈 결과를 확인하세요</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/admin">
                <Button
                  size="lg"
                  className="w-full text-lg py-6 rounded-xl bg-amber-600 hover:bg-amber-700 transition-all duration-300 hover:scale-105 shadow-playful hover:shadow-playful-hover text-white border-0"
                >
                  관리자 대시보드
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="text-center border-0 shadow-playful bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-pink-500" />
              </div>
              <CardTitle className="text-pink-500">간편 참여</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">전화번호만 입력하면 바로 시작</p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-playful bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <QrCode className="w-6 h-6 text-sky-500" />
              </div>
              <CardTitle className="text-sky-500">다양한 문제</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">학과, 전시, 상식 맞춤 문제</p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-playful bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-6 h-6 text-amber-500" />
              </div>
              <CardTitle className="text-amber-500">실시간 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">즉시 점수 확인 및 통계 제공</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
