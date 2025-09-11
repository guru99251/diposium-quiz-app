import Link from "next/link"
import { QrCode, Users, BarChart3, Settings } from "lucide-react"

export const dynamic = 'force-static'

export default function HomePage() {
  return (
    <div className="min-h-[100dvh]" data-quiz-homepage>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 text-balance" style={{color:"var(--soft-text)"}}>디포지움 QUIZ!</h1>
          <p className="text-lg md:text-xl text-pretty max-w-2xl mx-auto" style={{color:"var(--soft-text-muted)"}}>
            가볍게 즐기는 퀴즈!<br />지식, 공지, 이벤트를 빠르게 체크하세요.
          </p>
        </div>

        {/* Main Actions as Soft Buttons */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          <Link href="/quiz" prefetch={false} className="block">
            <button className="neu-btn neu-convex neu-btn--lg w-full text-left p-5" aria-label="퀴즈 참여하기">
              <div className="flex items-center gap-4">
                <div className="neu-icon-btn neu-convex" style={{width:48, height:48}} aria-hidden>
                  <QrCode className="w-6 h-6" style={{color:"var(--soft-accent)"}} />
                </div>
                <div>
                  <div className="text-xl font-extrabold" style={{color:"var(--soft-text)"}}>퀴즈 참여하기</div>
                  <div style={{color:"var(--soft-text-muted)"}}>QR 또는 주소로 바로 시작</div>
                </div>
              </div>
            </button>
          </Link>

          <Link href="/admin" prefetch={false} className="block">
            <button className="neu-btn neu-convex neu-btn--lg w-full text-left p-5" aria-label="관리자 모드">
              <div className="flex items-center gap-4">
                <div className="neu-icon-btn neu-convex" style={{width:48, height:48}} aria-hidden>
                  <Settings className="w-6 h-6" style={{color:"var(--soft-accent)"}} />
                </div>
                <div>
                  <div className="text-xl font-extrabold" style={{color:"var(--soft-text)"}}>관리자 모드</div>
                  <div style={{color:"var(--soft-text-muted)"}}>문제/참여 현황 관리</div>
                </div>
              </div>
            </button>
          </Link>
        </div>

        {/* Features as Soft Surfaces */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="neu-surface neu-convex p-6 text-center">
            <div className="neu-icon-btn neu-convex mx-auto mb-3" style={{width:40, height:40}} aria-hidden>
              <Users className="w-5 h-5" style={{color:"var(--soft-accent)"}} />
            </div>
            <div className="font-semibold" style={{color:"var(--soft-text)"}}>간편 참여</div>
            <p style={{color:"var(--soft-text-muted)"}}>전화번호 입력만으로 시작</p>
          </div>

          <div className="neu-surface neu-convex p-6 text-center">
            <div className="neu-icon-btn neu-convex mx-auto mb-3" style={{width:40, height:40}} aria-hidden>
              <QrCode className="w-5 h-5" style={{color:"var(--soft-accent)"}} />
            </div>
            <div className="font-semibold" style={{color:"var(--soft-text)"}}>다양한 문제</div>
            <p style={{color:"var(--soft-text-muted)"}}>주제별 맞춤형 문제 제공</p>
          </div>

          <div className="neu-surface neu-convex p-6 text-center">
            <div className="neu-icon-btn neu-convex mx-auto mb-3" style={{width:40, height:40}} aria-hidden>
              <BarChart3 className="w-5 h-5" style={{color:"var(--soft-accent)"}} />
            </div>
            <div className="font-semibold" style={{color:"var(--soft-text)"}}>즉시 결과</div>
            <p style={{color:"var(--soft-text-muted)"}}>점수와 통계 즉시 확인</p>
          </div>
        </div>
      </div>
    </div>
  )
}
