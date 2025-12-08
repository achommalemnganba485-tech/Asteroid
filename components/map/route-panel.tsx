"use client"

import { useState } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navigation, MapPin, Clock, Shield, AlertTriangle } from "lucide-react"

interface RoutePanelProps {
  isOpen: boolean
  onClose: () => void
  currentLocation: { lat: number; lng: number; address: string }
  routeMode: "fastest" | "safest"
}

export function RoutePanel({ isOpen, onClose, currentLocation, routeMode }: RoutePanelProps) {
  const { addActivity } = useSafeTrekStore()
  const [destination, setDestination] = useState("")
  const [routes, setRoutes] = useState<any[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  const handleCalculateRoute = async () => {
    if (!destination.trim()) return

    setIsCalculating(true)

    // Simulate route calculation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockRoutes = [
      {
        id: "fastest",
        type: "fastest",
        duration: "12 mins",
        distance: "3.2 km",
        description: "Via Main Street and Central Avenue",
        warnings: ["Heavy traffic expected"],
        safetyScore: 75,
      },
      {
        id: "safest",
        type: "safest",
        duration: "16 mins",
        distance: "3.8 km",
        description: "Via well-lit streets, avoiding reported hazard areas",
        warnings: [],
        safetyScore: 95,
      },
    ]

    setRoutes(mockRoutes)
    setIsCalculating(false)

    // Log route calculation
    addActivity({
      type: "ROUTE_CALCULATED",
      time: new Date().toISOString(),
      meta: {
        from: currentLocation.address,
        to: destination,
        mode: routeMode,
        routesFound: mockRoutes.length,
      },
    })
  }

  const handleStartNavigation = (route: any) => {
    addActivity({
      type: "NAVIGATION_STARTED",
      time: new Date().toISOString(),
      meta: {
        routeType: route.type,
        destination,
        safetyScore: route.safetyScore,
      },
    })

    // In a real app, this would start turn-by-turn navigation
    alert(`Starting ${route.type} navigation to ${destination}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Route Planning
          </DialogTitle>
          <DialogDescription>Plan your safest route to your destination</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* From/To Inputs */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm truncate">{currentLocation.address}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                placeholder="Enter destination address..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="focus-ring"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <Button onClick={handleCalculateRoute} disabled={!destination.trim() || isCalculating} className="w-full">
            {isCalculating ? "Calculating Routes..." : "Calculate Routes"}
          </Button>

          {/* Route Results */}
          {routes.length > 0 && (
            <div className="space-y-3">
              <Separator />
              <h4 className="font-medium">Available Routes</h4>

              {routes.map((route) => (
                <div key={route.id} className="border rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {route.type === "fastest" ? (
                        <Navigation className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Shield className="h-4 w-4 text-green-600" />
                      )}
                      <span className="font-medium capitalize">{route.type} Route</span>
                    </div>
                    <Badge
                      variant={
                        route.safetyScore >= 90 ? "success" : route.safetyScore >= 75 ? "warning" : "destructive"
                      }
                      className="text-xs"
                    >
                      {route.safetyScore}% Safe
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {route.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {route.distance}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">{route.description}</p>

                  {route.warnings.length > 0 && (
                    <div className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                      <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5" />
                      <div className="text-xs text-yellow-700 dark:text-yellow-200">{route.warnings.join(", ")}</div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleStartNavigation(route)}
                    variant={route.type === "safest" ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    Start Navigation
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
