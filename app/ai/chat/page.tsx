"use client"

import { useState } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { AppShell } from "@/components/layout/app-shell"
import { AdvancedFeatureBanner } from "@/components/ui/advanced-feature-banner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Bot, User } from "lucide-react"

export default function AIChatPage() {
  const { isAdvanced } = useSafeTrekStore()
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string; timestamp: string }>
  >([])
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = message.trim()
    const timestamp = new Date().toLocaleTimeString()

    setMessage("")
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage, timestamp }])
    setIsTyping(true)

    setTimeout(() => {
      const responses = [
        "Based on current conditions in your area, I recommend avoiding the downtown district after 9 PM due to increased incident reports. The safest route to your hotel is via Main Street with good lighting and regular police patrols.",
        "Your hotel appears to be in a safe neighborhood with excellent security ratings. I suggest using the main entrance and avoiding the side alley entrance after dark. The area has 24/7 security presence.",
        "The route you're planning passes through a construction zone with limited visibility. Consider the alternate route via Oak Street for better safety - it adds only 5 minutes but provides better lighting and foot traffic.",
        "Weather conditions show potential storms this evening. I recommend completing outdoor activities before 6 PM and having indoor backup plans ready. Local emergency shelters are available if needed.",
        "I've detected elevated crime reports in the area you're visiting. Stay in well-lit areas, travel in groups when possible, and keep emergency contacts readily available. The nearest police station is 3 blocks away.",
        "Your current location has excellent safety ratings. The nearby police station is 2 blocks away, and there are 24/7 establishments for emergency shelter if needed. Tourist police are active in this area.",
        "For your evening plans, I recommend staying in the main tourist district where security is enhanced. Avoid isolated areas and always inform someone of your whereabouts. Emergency services response time is under 5 minutes in this area.",
        "The restaurant you're planning to visit has good safety reviews. The area is well-patrolled and has good lighting. I recommend taking the main road route and avoiding shortcuts through alleys.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      const assistantTimestamp = new Date().toLocaleTimeString()

      setChatHistory((prev) => [...prev, { role: "assistant", content: randomResponse, timestamp: assistantTimestamp }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Safety Assistant</h1>
            <p className="text-muted-foreground">24/7 AI-powered safety guidance and support</p>
          </div>
          {isAdvanced && (
            <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">ADVANCED ACTIVE</Badge>
          )}
        </div>

        {!isAdvanced && (
          <AdvancedFeatureBanner
            featureName="AI Safety Assistant"
            description="Get 24/7 AI-powered safety guidance and instant answers to your travel safety questions."
          />
        )}

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Safety Chat
            </CardTitle>
            <CardDescription>
              Ask me anything about travel safety, local conditions, or emergency procedures
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border rounded-lg bg-muted/20">
              {chatHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <p className="text-muted-foreground mb-2">Hi! I'm your AI Safety Assistant.</p>
                  <p className="text-sm text-muted-foreground">
                    Ask me about local safety conditions, emergency procedures, or travel advice.
                  </p>
                </div>
              ) : (
                <>
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-background border p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Ask about safety concerns, local conditions, emergency procedures..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!message.trim() || isTyping} size="lg" className="px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Questions</CardTitle>
            <CardDescription>Common safety questions to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Is my current area safe for evening walks?",
                "What are the emergency numbers here?",
                "How safe is public transport at night?",
                "Are there any areas I should avoid?",
                "What's the safest route to my hotel?",
                "Current weather and safety conditions?",
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start h-auto p-3 bg-transparent"
                  onClick={() => setMessage(question)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{question}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
