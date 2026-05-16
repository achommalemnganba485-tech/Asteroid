"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSafeTrekStore } from "@/lib/store"
import { Shield, MapPin, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BackgroundCarousel } from "@/components/ui/background-carousel"

export default function HomePage() {
  const router = useRouter()
  const { currentUser } = useSafeTrekStore()

  useEffect(() => {
    // Redirect authenticated users
    if (currentUser.email && currentUser.onboardingDone) {
      router.push("/dashboard")
    } else if (currentUser.email && !currentUser.onboardingDone) {
      router.push("/onboarding")
    }
  }, [currentUser, router])

  const features = [
    {
      icon: Shield,
      title: "AI-Powered Safety",
      description: "Real-time threat detection and personalized safety recommendations",
    },
    {
      icon: MapPin,
      title: "Smart Navigation",
      description: "Safest routes with live hazard updates and emergency locations",
    },
    {
      icon: Users,
      title: "Emergency Network",
      description: "Instant SOS alerts to contacts and local emergency services",
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "5-second emergency activation with GPS location sharing",
    },
  ]

  return (
    <BackgroundCarousel>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-16 w-16 text-primary mr-4" />
              <h1 className="text-5xl font-bold text-foreground">Asteroid</h1>
            </div>
            <p className="text-xl text-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your AI-powered travel safety companion. Get real-time alerts, emergency assistance, and intelligent
              safety insights wherever you go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push("/login")}>
                Get Started Free
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow bg-white/5 backdrop-blur-sm border-white/10"
              >
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/90 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Travel Safer with AI Intelligence</h2>
            <p className="text-lg text-foreground/90 mb-8 max-w-xl mx-auto">
              Join thousands of travelers who trust Asteroid to keep them safe and informed.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push("/login")}>
              Start Your Safe Journey
            </Button>
          </div>
        </div>
      </div>
    </BackgroundCarousel>
  )
}
