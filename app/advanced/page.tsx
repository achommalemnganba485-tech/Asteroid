"use client"

import { useState } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Shield, Zap, Star, Sparkles, Users, Brain } from "lucide-react"
import { toast } from "sonner"

export default function AdvancedPage() {
  const { isAdvanced, setAdvanced, addActivity } = useSafeTrekStore()
  const [isEnabling, setIsEnabling] = useState(false)

  const handleEnableAdvanced = async () => {
    if (!isAdvanced) {
      setIsEnabling(true)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setAdvanced(true)
      addActivity({
        type: "Advanced Features Enabled",
        time: new Date().toLocaleString(),
        meta: { program: "Asteroid Advanced Pilot", method: "Demo Enable" },
      })

      setIsEnabling(false)

      toast.success("🎉 Welcome to Asteroid Advanced!", {
        description: "All advanced features are now unlocked. Explore AI-powered safety tools!",
        duration: 5000,
      })
    }
  }

  const essentialFeatures = [
    "Emergency SOS",
    "Basic safety map",
    "Document vault (unlimited)",
    "Safety checklists",
    "Basic location sharing",
    "Guardian contacts",
  ]

  const advancedFeatures = [
    "AI safety scoring",
    "Smart hazard alerts",
    "24/7 AI safety assistant",
    "Fall detection",
    "Advanced route planning",
    "Priority emergency response",
    "Family safety dashboard",
    "Offline safety maps",
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-heading mb-4">Asteroid Advanced Pilot</h1>
        <p className="text-xl text-muted-foreground mb-6">Free advanced safety features for everyone</p>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">
              Pilot Program: All advanced features are now free during our pilot phase!
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
        {/* Essential Features */}
        <Card className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Essential Features
              </CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Always Free
              </Badge>
            </div>
            <CardDescription>Core safety features available to everyone</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {essentialFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card className="relative border-primary shadow-lg">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1">
              <Star className="h-3 w-3 mr-1" />
              Advanced Pilot
            </Badge>
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Advanced Features
              </CardTitle>
              {isAdvanced && <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">Active</Badge>}
            </div>
            <CardDescription>AI-powered safety for maximum protection</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {advancedFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={handleEnableAdvanced}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              disabled={isAdvanced || isEnabling}
            >
              <Zap className="h-4 w-4 mr-2" />
              {isEnabling ? "Enabling..." : isAdvanced ? "Advanced Active" : "Enable Advanced (Demo)"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pilot Program Info */}
      <div className="max-w-4xl mx-auto">
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Users className="h-8 w-8 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  About the Advanced Pilot Program
                </h3>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p>
                    We're making all advanced safety features free during our pilot phase to help more travelers stay
                    safe.
                  </p>
                  <p>
                    <strong>What's included:</strong> All AI-powered features, unlimited storage, advanced routing, and
                    priority support.
                  </p>
                  <p>
                    <strong>How it works:</strong> Simply click "Enable Advanced (Demo)" to unlock all features
                    instantly.
                  </p>
                  <p>
                    <strong>Duration:</strong> This pilot program is ongoing - enjoy free access to all advanced safety
                    tools!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
