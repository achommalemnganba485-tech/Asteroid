"use client"

import { useState } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, X } from "lucide-react"
import { toast } from "sonner"

interface AdvancedFeatureBannerProps {
  featureName: string
  description: string
  onEnable?: () => void
}

export function AdvancedFeatureBanner({ featureName, description, onEnable }: AdvancedFeatureBannerProps) {
  const { isAdvanced, setAdvanced, addActivity } = useSafeTrekStore()
  const [isEnabling, setIsEnabling] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  if (isAdvanced || isDismissed) return null

  const handleEnable = async () => {
    setIsEnabling(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setAdvanced(true)
    addActivity({
      type: "Advanced Feature Enabled",
      time: new Date().toLocaleString(),
      meta: { feature: featureName, method: "Banner Enable" },
    })

    setIsEnabling(false)
    onEnable?.()

    toast.success(`🎉 ${featureName} Enabled!`, {
      description: "Advanced features are now active. Enjoy the enhanced functionality!",
      duration: 4000,
    })
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-blue-600" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-900 dark:text-blue-100">{featureName}</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Advanced
                </Badge>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleEnable}
              disabled={isEnabling}
              size="sm"
              className="bg-gradient-to-r from-primary to-blue-600"
            >
              {isEnabling ? "Enabling..." : "Enable Advanced (Demo)"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
