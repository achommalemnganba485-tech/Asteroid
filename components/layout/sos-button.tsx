"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useSafeTrekStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ProgressRing } from "@/components/ui/progress-ring"
import { AlertTriangle, X, CheckCircle2, Home } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SOSButton() {
  const router = useRouter()
  const { addActivity, contacts, calculateTouristSafetyScore } = useSafeTrekStore()
  const { toast } = useToast()

  // UI states
  const [isPressed, setIsPressed] = useState(false)
  const [isPreSOSOpen, setIsPreSOSOpen] = useState(false)
  const [isActiveSOSMode, setIsActiveSOSMode] = useState(false)

  // Countdown (in seconds)
  const TOTAL_SECONDS = 180
  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_SECONDS)
  const timerRef = useRef<number | null>(null)

  const formatTime = (seconds: number) => {
    const clamped = Math.max(0, Math.ceil(seconds))
    const m = Math.floor(clamped / 60)
    const s = clamped % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const getAccelerationFactor = () => {
    const tss = calculateTouristSafetyScore()
    // Map TSS 95 -> 1x, 45 -> 5x (linear)
    const minScore = 45
    const maxScore = 95
    const minFactor = 1
    const maxFactor = 5
    const clamped = Math.max(minScore, Math.min(maxScore, tss))
    const ratio = (maxScore - clamped) / (maxScore - minScore)
    return minFactor + ratio * (maxFactor - minFactor)
  }

  const openPreSOS = () => {
    setIsPreSOSOpen(true)
    setRemainingSeconds(TOTAL_SECONDS)
    addActivity({ type: "SOS_INITIATED", time: new Date().toISOString() })

    // Start adaptive countdown
    const id = window.setInterval(() => {
      const factor = getAccelerationFactor()
      setRemainingSeconds((prev) => {
        const next = prev - factor
        if (next <= 0) {
          window.clearInterval(id)
          timerRef.current = null
          sendSOS()
          return 0
        }
        return next
      })
    }, 1000)
    timerRef.current = id
  }

  const cancelPreSOS = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsPreSOSOpen(false)
    setRemainingSeconds(TOTAL_SECONDS)
    toast({ title: "Cancelled", description: "SOS window dismissed." })
    addActivity({ type: "SOS_CANCELLED", time: new Date().toISOString() })
  }

  const sendSOS = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsPreSOSOpen(false)
    setIsActiveSOSMode(true)

    // Simulated location and dispatch
    const mockLocation = {
      lat: 28.6139,
      lng: 77.209,
      address: "Connaught Place, New Delhi, India",
    }

    addActivity({
      type: "SOS_SENT",
      time: new Date().toISOString(),
      meta: { location: mockLocation, contacts: contacts.length, method: "manual" },
    })

    toast({
      title: "SOS Triggered",
      description: `Emergency alert sent to ${contacts.length} contacts and local services.`,
      variant: "destructive",
    })
  }

  const endActiveSOS = () => {
    setIsActiveSOSMode(false)
    toast({ title: "SOS Cancelled", description: "Active SOS has been cancelled." })
    addActivity({ type: "SOS_ENDED", time: new Date().toISOString() })
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
      }
    }
  }, [])

  // Active SOS Mode Overlay
  if (isActiveSOSMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-background mx-4 w-full max-w-md rounded-2xl p-8 text-center">
          <div className="mb-6 flex items-center justify-center">
            <ProgressRing progress={100} size={120} className="text-red-500">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-red-500" />
              </div>
            </ProgressRing>
          </div>
          <h2 className="mb-2 text-xl font-bold text-red-500">SOS Active</h2>
          <p className="mb-6 text-sm text-muted-foreground">Emergency SOS has been triggered. Help is on the way.</p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button onClick={() => router.push("/dashboard")} variant="secondary" className="w-full">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Button>
            <Button onClick={endActiveSOS} variant="outline" className="w-full">
              <X className="mr-2 h-4 w-4" /> Cancel SOS
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Pre-SOS Window
  if (isPreSOSOpen) {
    const progress = ((TOTAL_SECONDS - Math.max(0, remainingSeconds)) / TOTAL_SECONDS) * 100
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-background mx-4 w-full max-w-md rounded-2xl p-6 text-center">
          <div className="mb-6">
            <ProgressRing progress={progress} size={120} className="text-red-500 mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">{formatTime(remainingSeconds)}</div>
                <div className="text-xs text-muted-foreground">auto-sends</div>
              </div>
            </ProgressRing>
          </div>
          <h2 className="mb-2 text-xl font-bold text-red-500">Emergency SOS</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Press SOS to confirm or wait for the countdown. Lower safety scores accelerate the timer.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button onClick={sendSOS} className="w-full bg-red-500 hover:bg-red-600 text-white">
              <AlertTriangle className="mr-2 h-4 w-4" /> SOS
            </Button>
            <Button onClick={cancelPreSOS} variant="outline" className="w-full">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Floating SOS button (bottom-right)
  return (
    <Button
      onClick={openPreSOS}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`fixed bottom-6 right-6 h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg z-40 transition-transform ${
        isPressed ? "scale-95" : "scale-100"
      }`}
      size="icon"
      aria-label="Emergency SOS"
    >
      <AlertTriangle className="h-8 w-8" />
    </Button>
  )
}
