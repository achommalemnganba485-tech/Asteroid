"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSafeTrekStore } from "@/lib/store"
import { Shield, Mail, AlertCircle, Phone, Fingerprint, IdCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { setUser, addActivity } = useSafeTrekStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [regId, setRegId] = useState("")
  const [aadhaar, setAadhaar] = useState("")
  const [passport, setPassport] = useState("")
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [showPhoneLogin, setShowPhoneLogin] = useState(false)
  const [showIdLogin, setShowIdLogin] = useState(false)
  const [showAadhaarLogin, setShowAadhaarLogin] = useState(false)
  const [showPassportLogin, setShowPassportLogin] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    // Simulate Google Sign-In (stub implementation)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful Google auth
      const mockUser = {
        name: "John Traveler",
        email: "john.traveler@gmail.com",
        phone: "",
        docType: "" as const,
        onboardingDone: false,
      }

      setUser(mockUser)
      addActivity({
        type: "AUTH_LOGIN",
        time: new Date().toISOString(),
        meta: { method: "google" },
      })

      toast({
        title: "Welcome to SafeTrek!",
        description: "Let's get you set up for safe travels.",
      })

      router.push("/onboarding")
    } catch (error) {
      toast({
        title: "Sign-in failed",
        description: "Please try again or use email login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser = {
        name: email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        email,
        phone: "",
        docType: "" as const,
        onboardingDone: false,
      }

      setUser(mockUser)
      addActivity({
        type: "AUTH_LOGIN",
        time: new Date().toISOString(),
        meta: { method: "email" },
      })

      toast({
        title: "Welcome to SafeTrek!",
        description: "Let's get you set up for safe travels.",
      })

      router.push("/onboarding")
    } catch (error) {
      toast({
        title: "Sign-in failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const unifiedLogin = async (identifier: string, method: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockUser = {
        name: method === "email" ? identifier.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Registered Traveler",
        email: method === "email" ? identifier : `${method}@example.com`,
        phone: method === "phone" ? identifier : "",
        docType: "" as const,
        onboardingDone: false,
      }
      setUser(mockUser)
      addActivity({ type: "AUTH_LOGIN", time: new Date().toISOString(), meta: { method } })
      toast({ title: "Welcome to Asteroid!", description: "Let's get you set up for safe travels." })
      router.push("/onboarding")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/login-bg.jpg"
          alt="Snow-capped alpine mountains above green valleys with clouds"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <Card className="w-full max-w-md bg-background/20 backdrop-blur-md border-white/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Welcome to Asteroid</CardTitle>
          <CardDescription className="text-foreground/90">
            Sign in to access your AI-powered travel safety companion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Demo mode: Google Sign-In is simulated. Click to continue with mock authentication.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full shadow-[0_0_24px_rgba(56,189,248,0.55)] ring-1 ring-white/40 hover:shadow-[0_0_36px_rgba(56,189,248,0.75)] transition-shadow"
            size="lg"
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                <svg className="w-5 h-5 mr-2 drop-shadow" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/70 px-2 text-foreground/80">Or</span>
            </div>
          </div>

          {!showEmailLogin && !showPhoneLogin && !showIdLogin && !showAadhaarLogin && !showPassportLogin ? (
            <div className="grid gap-2">
              <Button variant="outline" onClick={() => setShowEmailLogin(true)} className="w-full" size="lg">
                <Mail className="w-4 h-4 mr-2" /> Continue with Email
              </Button>
              <Button variant="outline" onClick={() => setShowPhoneLogin(true)} className="w-full" size="lg">
                <Phone className="w-4 h-4 mr-2" /> Continue with Phone
              </Button>
              <Button variant="outline" onClick={() => setShowIdLogin(true)} className="w-full" size="lg">
                <Fingerprint className="w-4 h-4 mr-2" /> Continue with Website Registration ID
              </Button>
              <Button variant="outline" onClick={() => setShowAadhaarLogin(true)} className="w-full" size="lg">
                <IdCard className="w-4 h-4 mr-2" /> Continue with Aadhaar Number
              </Button>
              <Button variant="outline" onClick={() => setShowPassportLogin(true)} className="w-full" size="lg">
                <IdCard className="w-4 h-4 mr-2" /> Continue with Passport Number
              </Button>
            </div>
          ) : showEmailLogin ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus-ring"
                />
              </div>
              <Button type="submit" disabled={isLoading || !email} className="w-full" size="lg">
                {isLoading ? "Signing in..." : "Continue"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowEmailLogin(false)} className="w-full">
                Back
              </Button>
            </form>
          ) : showPhoneLogin ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (phone) unifiedLogin(phone, "phone")
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required className="focus-ring" />
              </div>
              <Button type="submit" disabled={isLoading || !phone} className="w-full" size="lg">
                {isLoading ? "Signing in..." : "Continue"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowPhoneLogin(false)} className="w-full">
                Back
              </Button>
            </form>
          ) : showIdLogin ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (regId) unifiedLogin(regId, "registrationId")
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="regid">Website Registration ID</Label>
                <Input id="regid" placeholder="Enter registration ID" value={regId} onChange={(e) => setRegId(e.target.value)} required className="focus-ring" />
              </div>
              <Button type="submit" disabled={isLoading || !regId} className="w-full" size="lg">
                {isLoading ? "Signing in..." : "Continue"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowIdLogin(false)} className="w-full">
                Back
              </Button>
            </form>
          ) : showAadhaarLogin ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (aadhaar) unifiedLogin(aadhaar, "aadhaar")
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input id="aadhaar" placeholder="Enter Aadhaar" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} required className="focus-ring" />
              </div>
              <Button type="submit" disabled={isLoading || !aadhaar} className="w-full" size="lg">
                {isLoading ? "Signing in..." : "Continue"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowAadhaarLogin(false)} className="w-full">
                Back
              </Button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (passport) unifiedLogin(passport, "passport")
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="passport">Passport Number</Label>
                <Input id="passport" placeholder="Enter Passport number" value={passport} onChange={(e) => setPassport(e.target.value)} required className="focus-ring" />
              </div>
              <Button type="submit" disabled={isLoading || !passport} className="w-full" size="lg">
                {isLoading ? "Signing in..." : "Continue"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowPassportLogin(false)} className="w-full">
                Back
              </Button>
            </form>
          )}

          <p className="text-xs text-foreground/90 text-center">
            By continuing, you agree to our{" "}
            <button onClick={() => router.push("/privacy")} className="underline hover:text-foreground">
              Terms of Service
            </button>{" "}
            and{" "}
            <button onClick={() => router.push("/privacy")} className="underline hover:text-foreground">
              Privacy Policy
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
