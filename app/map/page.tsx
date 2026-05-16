"use client"

import { useState, useEffect } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { AppShell } from "@/components/layout/app-shell"
import { SafetyMap } from "@/components/map/safety-map"
import { MapControls } from "@/components/map/map-controls"
import { RoutePanel } from "@/components/map/route-panel"
import { HazardReportModal } from "@/components/map/hazard-report-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, AlertTriangle, Shield } from "lucide-react"

export default function MapPage() {
  const { addActivity } = useSafeTrekStore()
  const [mapLayers, setMapLayers] = useState({
    police: true,
    hospitals: true,
    embassies: false,
    safeZones: true,
    hazards: true,
  })
  const [routeMode, setRouteMode] = useState<"fastest" | "safest">("fastest")
  const [showRoutePanel, setShowRoutePanel] = useState(false)
  const [showHazardReport, setShowHazardReport] = useState(false)
  const [currentLocation, setCurrentLocation] = useState({
    lat: 28.6139,
    lng: 77.209,
    address: "Connaught Place, New Delhi, India",
  })

  useEffect(() => {
    // Simulate getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current Location",
          })
        },
        () => {
          // Keep default location if geolocation fails
        },
      )
    }

    // Log map access
    addActivity({
      type: "MAP_ACCESSED",
      time: new Date().toISOString(),
      meta: { location: currentLocation },
    })
  }, [addActivity])

  const handleLayerToggle = (layer: keyof typeof mapLayers) => {
    setMapLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }

  const handleRouteMode = (mode: "fastest" | "safest") => {
    setRouteMode(mode)
  }

  return (
    <AppShell>
      <div className="flex h-full">
        {/* Map Container */}
        <div className="flex-1 relative">
          <SafetyMap
            center={currentLocation}
            layers={mapLayers}
            routeMode={routeMode}
            onHazardReport={() => setShowHazardReport(true)}
          />

          {/* Map Overlay Controls */}
          <div className="absolute top-4 left-4 z-10">
            <Card className="p-4 bg-background/95 backdrop-blur">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Current Location</span>
              </div>
              <p className="text-xs text-muted-foreground">{currentLocation.address}</p>
            </Card>
          </div>

          {/* Route Mode Selector */}
          <div className="absolute top-4 right-4 z-10">
            <Card className="p-3 bg-background/95 backdrop-blur">
              <div className="flex gap-2">
                <Button
                  variant={routeMode === "fastest" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRouteMode("fastest")}
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Fastest
                </Button>
                <Button
                  variant={routeMode === "safest" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRouteMode("safest")}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Safest
                </Button>
              </div>
              {routeMode === "safest" && (
                <p className="text-xs text-muted-foreground mt-2">
                  Routes prioritize well-lit streets and avoid known hazard areas
                </p>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            <Button onClick={() => setShowRoutePanel(true)} className="rounded-full h-12 w-12" size="icon">
              <Navigation className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setShowHazardReport(true)}
              variant="outline"
              className="rounded-full h-12 w-12 bg-background/95 backdrop-blur"
              size="icon"
            >
              <AlertTriangle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 border-l bg-background">
          <MapControls
            layers={mapLayers}
            onLayerToggle={handleLayerToggle}
            routeMode={routeMode}
            onRouteModeChange={handleRouteMode}
          />
        </div>

        {/* Modals */}
        {showRoutePanel && (
          <RoutePanel
            isOpen={showRoutePanel}
            onClose={() => setShowRoutePanel(false)}
            currentLocation={currentLocation}
            routeMode={routeMode}
          />
        )}

        {showHazardReport && (
          <HazardReportModal
            isOpen={showHazardReport}
            onClose={() => setShowHazardReport(false)}
            currentLocation={currentLocation}
          />
        )}
      </div>
    </AppShell>
  )
}
