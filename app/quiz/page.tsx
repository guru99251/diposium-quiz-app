"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function QuizEntryPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"phone" | "mode">("phone")
  const router = useRouter()

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const digits = phoneNumber.replace(/[^0-9]/g, "")
    if (!/^01[0-9]{9}$/.test(digits)) { setError("휴대폰 번호 형식(010-1234-5678)을 확인하세요."); setIsLoading(false); return }
    sessionStorage.setItem("quiz_phone", digits)
    setStep("mode")
    setIsLoading(false)
  }

  const handleSelectMode = (mode: "random5" | "unlimited") => {
    sessionStorage.setItem("quiz_mode", mode)
    router.push(`/quiz/start?mode=${mode}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-primary via-quiz-secondary to-quiz-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-playful border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-quiz-primary">Join the Quiz</CardTitle>
            <CardDescription className="text-lg text-gray-600">Enter your phone and choose a mode</CardDescription>
          </CardHeader>
          <CardContent>
            {step === "phone" && (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-medium text-gray-700">Phone</Label>
                  <Input id="phone" type="tel" placeholder="010-1234-5678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
                <Button type="submit" disabled={isLoading} className="w-full py-3 text-lg bg-gradient-to-r from-quiz-primary to-quiz-secondary">{isLoading ? "Checking..." : "Next: Choose Mode"}</Button>
              </form>
            )}

            {step === "mode" && (
              <div className="space-y-4">
                <p className="text-center text-gray-700 font-medium">Choose a mode</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button type="button" disabled={isLoading} onClick={() => handleSelectMode("random5")} className="h-auto py-6 text-base bg-gradient-to-r from-purple-600 to-indigo-600">Random 5</Button>
                  <Button type="button" disabled={isLoading} onClick={() => handleSelectMode("unlimited")} className="h-auto py-6 text-base bg-gradient-to-r from-orange-500 to-pink-600">Unlimited</Button>
                </div>
                <div className="text-center">
                  <Button variant="outline" onClick={() => setStep("phone")} className="bg-white">Re-enter phone</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
