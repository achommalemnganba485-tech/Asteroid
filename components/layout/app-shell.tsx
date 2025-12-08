"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSafeTrekStore } from "@/lib/store"
import { AppSidebar } from "./app-sidebar"
import { TopBar } from "./top-bar"
import { SOSButton } from "./sos-button"
import { SidebarProvider } from "@/components/ui/sidebar"
import { BackgroundCarousel } from "@/components/ui/background-carousel"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { currentUser } = useSafeTrekStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication and onboarding status
    if (!currentUser.email) {
      router.push("/login")
      return
    }

    if (!currentUser.onboardingDone) {
      router.push("/onboarding")
      return
    }

    setIsLoading(false)
  }, [currentUser, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <BackgroundCarousel>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
          <SOSButton />
        </div>
      </SidebarProvider>
    </BackgroundCarousel>
  )
}
