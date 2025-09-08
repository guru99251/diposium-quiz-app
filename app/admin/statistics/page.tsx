"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Quiz Statistics</h1>
            <p className="text-white/90 text-lg drop-shadow">Participation and results overview</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              Admin Home
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-playful bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            Detailed statistics UI will be added soon.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
