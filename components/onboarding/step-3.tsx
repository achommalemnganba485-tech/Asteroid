"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSafeTrekStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bell, FileText, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Step3Props {
  onValidationChange: (isValid: boolean) => void
  onNext: () => void
  onBack: () => void
  isValid: boolean
  currentStep: number
}

export function OnboardingStep3({ onValidationChange, onBack }: Step3Props) {
  const router = useRouter()
  const { permissions, setPermissions, setUser, addActivity } = useSafeTrekStore()
  const { toast } = useToast()
  const [localPermissions, setLocalPermissions] = useState(permissions)
  const [isCompleting, setIsCompleting] = useState(false)

  useEffect(() => {
    const isValid = localPermissions.location && localPermissions.notifications && localPermissions.terms

    onValidationChange(isValid)
  }, [localPermissions, onValidationChange])

  const handlePermissionChange = (permission: keyof typeof localPermissions, checked: boolean) => {
    const updated = { ...localPermissions, [permission]: checked }
    setLocalPermissions(updated)
    setPermissions(updated)
  }

  const handleComplete = async () => {
    if (!localPermissions.location || !localPermissions.notifications || !localPermissions.terms) {
      return
    }

    setIsCompleting(true)

    try {
      // Simulate setup completion
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mark onboarding as complete
      setUser({ onboardingDone: true })

      // Log completion
      addActivity({
        type: "ONBOARDING_COMPLETE",
        time: new Date().toISOString(),
        meta: { permissions: localPermissions },
      })

      toast({
        title: "Setup Complete!",
        description: "Welcome to Asteroid. Your safety companion is ready.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
    }
  }

  const permissionItems = [
    {
      key: "location" as const,
      icon: MapPin,
      title: "Location Access",
      description: "Required for emergency services, safe routing, and location-based alerts",
      required: true,
    },
    {
      key: "notifications" as const,
      icon: Bell,
      title: "Push Notifications",
      description: "Essential for real-time safety alerts and emergency communications",
      required: true,
    },
    {
      key: "terms" as const,
      icon: FileText,
      title: "Terms & Privacy Policy",
      description: "Agreement to our terms of service and privacy policy",
      required: true,
    },
  ]

  return (
    <Card className="bg-background/20 backdrop-blur-md border-border/30 shadow-xl">
      <CardHeader>
        <CardTitle>Permissions & Privacy</CardTitle>
        <CardDescription>Grant essential permissions to enable Asteroid's safety features.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Items */}
        <div className="space-y-4">
          {permissionItems.map((item) => (
            <div
              key={item.key}
              className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={item.key}
                checked={localPermissions[item.key]}
                onCheckedChange={(checked) => handlePermissionChange(item.key, checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-primary" />
                  <label htmlFor={item.key} className="text-sm font-medium cursor-pointer">
                    {item.title}
                  </label>
                  {item.required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Your Privacy Matters</h4>
              <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
                Asteroid uses end-to-end encryption for your data. Location data is only shared during emergencies or
                when you explicitly request assistance. You can revoke permissions anytime in Settings.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={handleComplete}
            disabled={
              !localPermissions.location || !localPermissions.notifications || !localPermissions.terms || isCompleting
            }
            size="lg"
            className="min-w-[200px]"
          >
            {isCompleting ? "Completing Setup..." : "Complete Setup & Secure My Trip"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
