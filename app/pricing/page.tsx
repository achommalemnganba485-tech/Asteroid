"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSafeTrekStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Shield, Zap, Star, Sparkles } from "lucide-react"
import { toast } from "sonner"

export default function PricingPage() {
  const { isPro, setPro, addActivity } = useSafeTrekStore()
  const [isAnnual, setIsAnnual] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const router = useRouter()

  const handleUpgrade = async (plan: string) => {
    if (plan === "pro" && !isPro) {
      setIsUpgrading(true)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setPro(true)
      addActivity({
        type: "Account Upgraded",
        time: new Date().toLocaleString(),
        meta: { plan: "Asteroid Pro", method: "Demo Upgrade" },
      })

      setIsUpgrading(false)

      toast.success("🎉 Welcome to Asteroid Pro!", {
        description: "All premium features are now unlocked. Explore AI-powered safety tools!",
        duration: 5000,
      })

      // Redirect to AI features after a short delay
      setTimeout(() => {
        router.push("/ai-safety")
      }, 2000)
    }
  }

  const features = {
    free: [
      "Basic safety map",
      "Emergency SOS",
      "Document vault (5 files)",
      "Safety checklists",
      "Basic location sharing",
    ],
    pro: [
      "Everything in Free",
      "AI safety scoring",
      "Smart hazard alerts",
      "24/7 AI safety assistant",
      "Fall detection",
      "Unlimited document storage",
      "Advanced route planning",
      "Priority emergency response",
      "Family safety dashboard",
      "Offline safety maps",
    ],
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-heading mb-4">Choose Your Safety Plan</h1>
        <p className="text-xl text-muted-foreground mb-6">Enhanced protection with AI-powered safety features</p>

        {!isPro && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">
                Demo Mode: Click "Upgrade to Pro" to instantly unlock all premium features for judges!
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm ${!isAnnual ? "font-semibold" : "text-muted-foreground"}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isAnnual ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAnnual ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm ${isAnnual ? "font-semibold" : "text-muted-foreground"}`}>
            Annual
            <Badge
              variant="secondary"
              className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              Save 20%
            </Badge>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Asteroid Free
              </CardTitle>
              {!isPro && <Badge variant="outline">Current Plan</Badge>}
            </div>
            <CardDescription>Essential safety features for every traveler</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {features.free.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full bg-transparent" disabled={!isPro}>
              {!isPro ? "Current Plan" : "Downgrade"}
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="relative border-primary shadow-lg">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1">
              <Star className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Asteroid Pro
              </CardTitle>
              {isPro && <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">Active</Badge>}
            </div>
            <CardDescription>Advanced AI-powered safety for maximum protection</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">${isAnnual ? "8" : "10"}</span>
              <span className="text-muted-foreground">/month</span>
              {isAnnual && <div className="text-sm text-green-600 font-medium">Save $24/year</div>}
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {features.pro.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleUpgrade("pro")}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              disabled={isPro || isUpgrading}
            >
              <Zap className="h-4 w-4 mr-2" />
              {isUpgrading ? "Upgrading..." : isPro ? "Current Plan" : "Upgrade to Pro"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Features</th>
                      <th className="text-center p-4 font-medium">Free</th>
                      <th className="text-center p-4 font-medium">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Emergency SOS", true, true],
                      ["Safety Map", true, true],
                      ["Document Vault", "5 files", "Unlimited"],
                      ["AI Safety Scoring", false, true],
                      ["Hazard Alerts", false, true],
                      ["24/7 AI Assistant", false, true],
                      ["Fall Detection", false, true],
                      ["Offline Maps", false, true],
                      ["Priority Support", false, true],
                    ].map(([feature, free, pro], idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        <td className="p-4 font-medium">{feature}</td>
                        <td className="p-4 text-center">
                          {typeof free === "boolean" ? (
                            free ? (
                              <Check className="h-4 w-4 text-green-600 mx-auto" />
                            ) : (
                              "—"
                            )
                          ) : (
                            free
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof pro === "boolean" ? (
                            pro ? (
                              <Check className="h-4 w-4 text-green-600 mx-auto" />
                            ) : (
                              "—"
                            )
                          ) : (
                            pro
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
