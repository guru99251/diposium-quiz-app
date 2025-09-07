import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Users, BarChart3, Sparkles, Clock, Trophy } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-cyan-50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg">
            <Sparkles className="w-4 h-4" />✨ 지식을 테스트하고 성장하세요 🚀
          </div>
          <h1 className="modern-title text-gray-800 mb-6">🧠 스마트 퀴즈 플랫폼</h1>
          <p className="modern-subtitle max-w-2xl mx-auto text-gray-600">
            간편한 참여와 실시간 결과로 학습의 즐거움을 경험해보세요 📚
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          <div className="modern-shadow modern-transition modern-hover border-0 rounded-2xl overflow-hidden">
            <div
              className="text-center p-8"
              style={{ background: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)" }}
            >
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">🎯 퀴즈 참여하기</h2>
              <p className="text-base text-white/90">전화번호만 입력하면 바로 시작할 수 있어요 📱</p>
            </div>
            <div className="p-8 bg-white">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl modern-transition modern-button shadow-lg hover:shadow-xl"
                >
                  🎮 퀴즈 시작하기
                </Button>
              </Link>
            </div>
          </div>

          <div className="modern-shadow modern-transition modern-hover border-0 rounded-2xl overflow-hidden">
            <div
              className="text-center p-8"
              style={{ background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)" }}
            >
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">⚙️ 관리자 모드</h2>
              <p className="text-base text-white/90">문제 관리와 통계를 확인해보세요 📊</p>
            </div>
            <div className="p-8 bg-white">
              <Link href="/admin">
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white rounded-xl modern-transition modern-button shadow-lg hover:shadow-xl"
                >
                  🔧 관리자 대시보드
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="modern-shadow border-0 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl p-6 modern-transition modern-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-800 mb-2">👥 간편한 참여</h3>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  복잡한 가입 없이 전화번호만으로 즉시 퀴즈에 참여할 수 있습니다
                </p>
              </div>
            </div>
          </div>

          <div className="modern-shadow border-0 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-6 modern-transition modern-hover md:mt-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">⚡ 실시간 피드백</h3>
                <p className="text-sm text-amber-700 leading-relaxed">
                  답변과 동시에 결과를 확인하고 즉시 학습 효과를 얻을 수 있습니다
                </p>
              </div>
            </div>
          </div>

          <div className="modern-shadow border-0 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 modern-transition modern-hover">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 mb-2">🏆 맞춤형 문제</h3>
                <p className="text-sm text-purple-700 leading-relaxed">
                  학과별, 전공별로 특화된 다양한 문제를 통해 전문 지식을 테스트합니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
