"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, BarChart3, Plus } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Admin Dashboard</h1>
          <p className="text-white/90 text-lg drop-shadow">Manage quiz questions and results</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-playful hover:shadow-playful-hover transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-quiz-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-quiz-primary" />
              </div>
              <CardTitle className="text-xl text-quiz-primary">Manage Questions</CardTitle>
              <CardDescription>Add or edit quiz questions</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/admin/questions">
                <Button className="w-full bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover">
                  Open Questions
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-playful hover:shadow-playful-hover transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-quiz-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-quiz-secondary" />
              </div>
              <CardTitle className="text-xl text-quiz-secondary">View Statistics</CardTitle>
              <CardDescription>See participation stats and results</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/admin/statistics">
                <Button className="w-full bg-gradient-to-r from-quiz-secondary to-quiz-accent hover:from-quiz-accent hover:to-quiz-secondary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover text-white">
                  Open Statistics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-playful hover:shadow-playful-hover transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-quiz-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-quiz-primary" />
              </div>
              <CardTitle className="text-xl text-quiz-primary">Manage Categories</CardTitle>
              <CardDescription>Add or remove question categories</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/admin/categories">
                <Button className="w-full bg-gradient-to-r from-quiz-primary to-quiz-secondary hover:from-quiz-secondary hover:to-quiz-primary transition-all duration-300 rounded-xl shadow-playful hover:shadow-playful-hover">
                  Open Categories
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
