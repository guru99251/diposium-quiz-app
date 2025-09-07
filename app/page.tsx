import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, BarChart3, Sparkles, Clock, Trophy } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            지식을 테스트하고 성장하세요
          </div>
          <h1 className="modern-title text-foreground mb-6">스마트 퀴즈 플랫폼</h1>
          <p className="modern-subtitle max-w-2xl mx-auto">간편한 참여와 실시간 결과로 학습의 즐거움을 경험해보세요</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {/* User Quiz Card */}
          <Card className="modern-shadow modern-transition modern-hover border-0 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="text-center p-8 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 modern-shadow">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground mb-3">퀴즈 참여하기</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                전화번호만 입력하면 바로 시작할 수 있어요
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl modern-transition modern-button modern-shadow"
                >
                  퀴즈 시작하기
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="modern-shadow modern-transition modern-hover border-0 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="text-center p-8 bg-gradient-to-br from-accent/5 to-accent/10">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 modern-shadow">
                <BarChart3 className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground mb-3">관리자 모드</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                문제 관리와 통계를 확인해보세요
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Link href="/admin">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-lg font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-xl modern-transition modern-button bg-transparent"
                >
                  관리자 대시보드
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="modern-shadow border-0 bg-card/70 backdrop-blur-sm rounded-xl p-6 modern-transition modern-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-chart-1/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-chart-1" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">간편한 참여</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  복잡한 가입 없이 전화번호만으로 즉시 퀴즈에 참여할 수 있습니다
                </p>
              </div>
            </div>
          </Card>

          <Card className="modern-shadow border-0 bg-card/70 backdrop-blur-sm rounded-xl p-6 modern-transition modern-hover md:mt-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-chart-2/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-chart-2" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">실시간 피드백</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  답변과 동시에 결과를 확인하고 즉시 학습 효과를 얻을 수 있습니다
                </p>
              </div>
            </div>
          </Card>

          <Card className="modern-shadow border-0 bg-card/70 backdrop-blur-sm rounded-xl p-6 modern-transition modern-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-chart-3" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">맞춤형 문제</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  학과별, 전공별로 특화된 다양한 문제를 통해 전문 지식을 테스트합니다
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
