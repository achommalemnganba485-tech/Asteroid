"use client"

import type React from "react"

import { useState } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, MessageSquare, Shield, Activity, Crown, Lock, Zap } from "lucide-react"

export default function AISafetyPage() {
  const { user, isPro, setIsPro, calculateTouristSafetyScore } = useSafeTrekStore()
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [safetyScore, setSafetyScore] = useState(() => calculateTouristSafetyScore())
  const [fallDetectionActive, setFallDetectionActive] = useState(false)
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  const enableDemoMode = () => {
    setDemoMode(true)
    setIsPro(true)
    setFallDetectionActive(true)
    setAlertsEnabled(true)
  }

  const handleSafetyAnalysis = async () => {
    if (!isPro && !demoMode) return
    setIsAnalyzing(true)

    setTimeout(() => {
      const baseScore = calculateTouristSafetyScore()
      const newScore = Math.max(45, Math.min(95, baseScore + Math.floor(Math.random() * 10) - 5))
      setSafetyScore(newScore)
      setIsAnalyzing(false)
    }, 3000)
  }

  const handleChatSubmit = async () => {
    if ((!isPro && !demoMode) || !chatMessage.trim()) return

    const userMessage = chatMessage
    setChatMessage("")
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }])

    setTimeout(() => {
      const responses = [
        "Based on current conditions in your area, I recommend avoiding the downtown district after 9 PM due to increased incident reports. The safest route to your hotel is via Main Street.",
        "Your hotel appears to be in a safe neighborhood with good lighting and security. I suggest using the main entrance and avoiding the side alley entrance after dark.",
        "The route you're planning passes through a construction zone with limited visibility. Consider the alternate route via Oak Street for better safety - it adds only 5 minutes.",
        "Weather conditions show potential storms this evening. I recommend completing outdoor activities before 6 PM and having indoor backup plans ready.",
        "I've detected elevated crime reports in the area you're visiting. Stay in well-lit areas, travel in groups when possible, and keep emergency contacts readily available.",
        "Your current location has excellent safety ratings. The nearby police station is 2 blocks away, and there are 24/7 establishments for emergency shelter if needed.",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatHistory((prev) => [...prev, { role: "assistant", content: randomResponse }])
    }, 1500)
  }

  const testFallDetection = () => {
    if (!isPro && !demoMode) return

    // Simulate fall detection sequence
    setTimeout(() => {
      alert("Fall detected! Emergency countdown initiated. SOS will be sent in 30 seconds unless cancelled.")
    }, 1000)
  }

  const ProFeatureCard = ({
    children,
    title,
    description,
  }: { children: React.ReactNode; title: string; description: string }) => (
    <Card className={`relative ${!isPro && !demoMode ? "opacity-60" : ""}`}>
      {!isPro && !demoMode && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center p-4">
            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">Pro Feature</p>
            <Button size="sm" className="bg-gradient-to-r from-primary to-blue-600" onClick={enableDemoMode}>
              <Crown className="h-4 w-4 mr-1" />
              Try Demo
            </Button>
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {!isPro && !demoMode && (
            <Badge variant="secondary" className="bg-gradient-to-r from-primary to-blue-600 text-white">
              PRO
            </Badge>
          )}
          {demoMode && (
            <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              DEMO
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">AI Safety Assistant</h1>
          <p className="text-muted-foreground">Advanced AI-powered safety features for enhanced protection</p>
        </div>
        <div className="flex gap-2">
          {(isPro || demoMode) && (
            <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">
              {demoMode ? "DEMO ACTIVE" : "PRO ACTIVE"}
            </Badge>
          )}
          {!isPro && !demoMode && (
            <Button onClick={enableDemoMode} className="bg-gradient-to-r from-green-500 to-emerald-600">
              <Zap className="h-4 w-4 mr-1" />
              Try Demo
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Itinerary Safety Scoring */}
        <ProFeatureCard
          title="Tourist Safety Analysis"
          description="AI-powered risk assessment based on travel patterns and area sensitivity"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tourist Safety Score</span>
              <span
                className={`text-2xl font-bold ${safetyScore >= 85 ? "text-green-600" : safetyScore >= 70 ? "text-yellow-600" : "text-red-600"}`}
              >
                {safetyScore}/100
              </span>
            </div>
            <Progress value={safetyScore} className="h-2" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Area Sensitivity</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {safetyScore >= 80 ? "Low Risk" : safetyScore >= 60 ? "Medium Risk" : "High Risk"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Travel Pattern</span>
                <Badge
                  variant="outline"
                  className={
                    safetyScore >= 80 ? "text-green-600 border-green-600" : "text-yellow-600 border-yellow-600"
                  }
                >
                  {safetyScore >= 80 ? "Safe" : "Moderate"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Preparation Level</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {safetyScore >= 75 ? "Well Prepared" : "Needs Attention"}
                </Badge>
              </div>
            </div>

            <Button onClick={handleSafetyAnalysis} disabled={(!isPro && !demoMode) || isAnalyzing} className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Analyze Tourist Safety"}
            </Button>
          </div>
        </ProFeatureCard>

        {/* Hazard Alerts */}
        <ProFeatureCard title="Smart Hazard Alerts" description="Real-time AI-powered safety notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Alert Sensitivity</span>
              <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} disabled={!isPro && !demoMode} />
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Weather Alert</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Heavy rain expected 6-8 PM. Consider indoor activities.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Safety Tip</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Tourist area - keep valuables secure and stay aware.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ProFeatureCard>

        {/* Safety Chat Assistant */}
        <ProFeatureCard title="Safety Chat Assistant" description="24/7 AI safety advisor for instant guidance">
          <div className="space-y-4">
            <div className="h-48 border rounded-lg p-3 overflow-y-auto bg-muted/20">
              {chatHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center mt-16">
                  Ask me anything about safety in your area...
                </p>
              ) : (
                <div className="space-y-3">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-2 rounded-lg text-sm ${
                          msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Ask about safety concerns..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                disabled={!isPro && !demoMode}
                className="min-h-[40px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleChatSubmit()
                  }
                }}
              />
              <Button onClick={handleChatSubmit} disabled={(!isPro && !demoMode) || !chatMessage.trim()} size="sm">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </ProFeatureCard>

        {/* Fall Detection */}
        <ProFeatureCard title="Fall Detection" description="Emergency detection using device sensors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fall Detection</span>
              <Switch
                checked={fallDetectionActive}
                onCheckedChange={setFallDetectionActive}
                disabled={!isPro && !demoMode}
              />
            </div>

            <div className="text-center py-6">
              <Activity
                className={`h-12 w-12 mx-auto mb-3 ${fallDetectionActive ? "text-primary animate-pulse" : "text-muted-foreground"}`}
              />
              <p className="text-sm font-medium mb-1">
                {fallDetectionActive ? "Monitoring Active" : "Monitoring Inactive"}
              </p>
              <p className="text-xs text-muted-foreground">Using accelerometer and gyroscope data</p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Sensitivity:</span>
                <span>High</span>
              </div>
              <div className="flex justify-between">
                <span>Response Time:</span>
                <span>30 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Last Calibration:</span>
                <span>2 hours ago</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              disabled={!isPro && !demoMode}
              onClick={testFallDetection}
            >
              Test Fall Detection
            </Button>
          </div>
        </ProFeatureCard>
      </div>

      {!isPro && !demoMode && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-600/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Crown className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Unlock AI Safety Pro</h3>
                <p className="text-sm text-muted-foreground">
                  Get advanced AI-powered safety features, real-time hazard alerts, and 24/7 safety assistance.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={enableDemoMode}
                  variant="outline"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Try Demo
                </Button>
                <Button className="bg-gradient-to-r from-primary to-blue-600">Upgrade Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
