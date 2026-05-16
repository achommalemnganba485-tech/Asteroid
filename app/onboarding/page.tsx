"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSafeTrekStore } from "@/lib/store"
import { OnboardingStep1 } from "@/components/onboarding/step-1"
import { OnboardingStep2 } from "@/components/onboarding/step-2"
import { OnboardingStep3 } from "@/components/onboarding/step-3"
import { Progress } from "@/components/ui/progress"
import { Shield } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const { currentUser } = useSafeTrekStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isValid, setIsValid] = useState(false)
  const [skipAllowed, setSkipAllowed] = useState({ step2: true, step3: true })

  useEffect(() => {
    // Redirect if not authenticated
    if (!currentUser.email) {
      router.push("/login")
      return
    }

    // Redirect if already onboarded
    if (currentUser.onboardingDone) {
      router.push("/dashboard")
      return
    }
  }, [currentUser, router])

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      setIsValid(false)
    }
  }

  const handleSkip = () => {
    if (currentStep === 2 && skipAllowed.step2) {
      setCurrentStep(3)
      setIsValid(false)
      return
    }
    if (currentStep === 3 && skipAllowed.step3) {
      // mark onboarding done and go to dashboard
      // defer to Step3 completion path by simulating completion with defaults
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setIsValid(false)
    }
  }

  const steps = [
    { number: 1, title: "Identity", component: OnboardingStep1 },
    { number: 2, title: "Trip & Contacts (Optional)", component: OnboardingStep2 },
    { number: 3, title: "Permissions (Optional)", component: OnboardingStep3 },
  ]

  const CurrentStepComponent = steps[currentStep - 1].component

  if (!currentUser.email) {
    return null // Will redirect
  }

  return (
    <>
      <div className="relative min-h-screen">
        {/* Background image */}
        <div aria-hidden="true" className="fixed inset-0 -z-10">
          <img src="/images/setup-bg.jpg" alt="" className="h-full w-full object-cover" />
          {/* light token-based veil to aid contrast, not black */}
          <div className="absolute inset-0 bg-background/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-10 w-10 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-foreground">SAFETREK setup page</h1>
            </div>
            <p className="text-foreground/90">Let's get you set up for safe and secure travels</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">Step {currentStep} out of 3</span>
              <span className="text-sm text-foreground/80">{steps[currentStep - 1].title}</span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </div>

          {/* Step Content */}
          <CurrentStepComponent
            onValidationChange={setIsValid}
            onNext={handleNext}
            onBack={handleBack}
            isValid={isValid}
            currentStep={currentStep}
          />

          {/* Skip button for optional steps */}
          {currentStep > 1 && (
            <div className="mt-4 flex justify-end">
              <button onClick={handleSkip} className="text-sm underline text-muted-foreground">Skip this step</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
