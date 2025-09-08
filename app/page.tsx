import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen" data-quiz-homepage>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance drop-shadow-lg">Diposium QUIZ</h1>
          <p className="text-xl text-white/90 text-pretty max-w-2xl mx-auto drop-shadow">
            Quick and fun quiz. Test your knowledge!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="border-0 shadow-playful hover:shadow-playful-hover transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-sky-500" />
              </div>
              <CardTitle className="text-2xl text-sky-500">Start Quiz</CardTitle>
              <CardDescription className="text-lg">Scan QR or start here</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/quiz">
                <Button size="lg" className="w-full text-lg py-6 rounded-xl bg-sky-600 hover:bg-sky-700 transition-all duration-300 hover:scale-105 shadow-playful hover:shadow-playful-hover text-white border-0">
                  Start ▶
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-playful hover:shadow-playful-hover transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-amber-500" />
              </div>
              <CardTitle className="text-2xl text-amber-500">Admin</CardTitle>
              <CardDescription className="text-lg">Manage questions and results</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/admin">
                <Button size="lg" className="w-full text-lg py-6 rounded-xl bg-amber-600 hover:bg-amber-700 transition-all duration-300 hover:scale-105 shadow-playful hover:shadow-playful-hover text-white border-0">
                  Admin Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
