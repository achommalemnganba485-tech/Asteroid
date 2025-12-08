"use client"

import { useState, useEffect, useRef } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Shield, Building2, Cross, Users, AlertTriangle } from "lucide-react"

interface SafetyMapProps {
  center: { lat: number; lng: number; address: string }
  layers: {
    police: boolean
    hospitals: boolean
    embassies: boolean
    safeZones: boolean
    hazards: boolean
  }
  routeMode: "fastest" | "safest"
  onHazardReport: () => void
}

interface MapMarker {
  id: string
  type: "police" | "hospital" | "embassy" | "safeZone" | "hazard" | "sos"
  lat: number
  lng: number
  title: string
  description?: string
  severity?: "low" | "medium" | "high"
}

export function SafetyMap({ center, layers, routeMode, onHazardReport }: SafetyMapProps) {
  const { addActivity } = useSafeTrekStore()
  const mapRef = useRef<HTMLDivElement>(null)
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [showSOSDispatch, setShowSOSDispatch] = useState(false)

  useEffect(() => {
    // Generate mock markers around the center location
    const mockMarkers: MapMarker[] = [
      // Police stations
      {
        id: "police-1",
        type: "police",
        lat: center.lat + 0.01,
        lng: center.lng + 0.01,
        title: "Central Police Station",
        description: "24/7 Emergency Services",
      },
      {
        id: "police-2",
        type: "police",
        lat: center.lat - 0.015,
        lng: center.lng + 0.02,
        title: "Tourist Police Unit",
        description: "Specialized tourist assistance",
      },
      // Hospitals
      {
        id: "hospital-1",
        type: "hospital",
        lat: center.lat + 0.02,
        lng: center.lng - 0.01,
        title: "City General Hospital",
        description: "Emergency & Trauma Center",
      },
      {
        id: "hospital-2",
        type: "hospital",
        lat: center.lat - 0.01,
        lng: center.lng - 0.02,
        title: "Metro Medical Center",
        description: "24/7 Emergency Care",
      },
      // Embassies
      {
        id: "embassy-1",
        type: "embassy",
        lat: center.lat + 0.025,
        lng: center.lng + 0.015,
        title: "US Embassy",
        description: "Consular Services",
      },
      {
        id: "embassy-2",
        type: "embassy",
        lat: center.lat - 0.02,
        lng: center.lng + 0.025,
        title: "UK High Commission",
        description: "British Consular Services",
      },
      // Safe Zones
      {
        id: "safe-1",
        type: "safeZone",
        lat: center.lat + 0.005,
        lng: center.lng + 0.005,
        title: "Tourist Information Center",
        description: "Safe meeting point with security",
      },
      {
        id: "safe-2",
        type: "safeZone",
        lat: center.lat - 0.008,
        lng: center.lng - 0.005,
        title: "Metro Station Plaza",
        description: "Well-lit area with CCTV coverage",
      },
      // Hazards
      {
        id: "hazard-1",
        type: "hazard",
        lat: center.lat + 0.018,
        lng: center.lng - 0.015,
        title: "Construction Zone",
        description: "Road work in progress - use alternate route",
        severity: "medium",
      },
      {
        id: "hazard-2",
        type: "hazard",
        lat: center.lat - 0.025,
        lng: center.lng + 0.01,
        title: "Reported Incident",
        description: "Avoid area after 10 PM",
        severity: "high",
      },
    ]

    setMarkers(mockMarkers)
  }, [center])

  useEffect(() => {
    // Listen for SOS events to show dispatch simulation
    const handleSOSEvent = () => {
      setShowSOSDispatch(true)

      // Add SOS marker
      const sosMarker: MapMarker = {
        id: "sos-current",
        type: "sos",
        lat: center.lat,
        lng: center.lng,
        title: "SOS Alert Location",
        description: "Emergency services dispatched",
      }

      setMarkers((prev) => [...prev.filter((m) => m.type !== "sos"), sosMarker])

      // Hide after 10 seconds
      setTimeout(() => {
        setShowSOSDispatch(false)
        setMarkers((prev) => prev.filter((m) => m.type !== "sos"))
      }, 10000)
    }

    // Simulate listening to SOS events
    window.addEventListener("safetrek-sos", handleSOSEvent)
    return () => window.removeEventListener("safetrek-sos", handleSOSEvent)
  }, [center])

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "police":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "hospital":
        return <Cross className="h-4 w-4 text-red-600" />
      case "embassy":
        return <Building2 className="h-4 w-4 text-purple-600" />
      case "safeZone":
        return <Users className="h-4 w-4 text-green-600" />
      case "hazard":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "sos":
        return <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getMarkerColor = (type: string, severity?: string) => {
    switch (type) {
      case "police":
        return "bg-blue-100 border-blue-300"
      case "hospital":
        return "bg-red-100 border-red-300"
      case "embassy":
        return "bg-purple-100 border-purple-300"
      case "safeZone":
        return "bg-green-100 border-green-300"
      case "hazard":
        return severity === "high"
          ? "bg-red-100 border-red-400"
          : severity === "medium"
            ? "bg-orange-100 border-orange-300"
            : "bg-yellow-100 border-yellow-300"
      case "sos":
        return "bg-red-200 border-red-500 animate-pulse"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const filteredMarkers = markers.filter((marker) => {
    switch (marker.type) {
      case "police":
        return layers.police
      case "hospital":
        return layers.hospitals
      case "embassy":
        return layers.embassies
      case "safeZone":
        return layers.safeZones
      case "hazard":
        return layers.hazards
      case "sos":
        return true // Always show SOS markers
      default:
        return true
    }
  })

  return (
    <div ref={mapRef} className="w-full h-full bg-gray-100 relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        {/* Grid pattern to simulate map */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Street lines */}
        <svg className="absolute inset-0 w-full h-full">
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#cbd5e1" strokeWidth="2" />

          {/* Route visualization */}
          {routeMode === "safest" && (
            <path
              d="M 25% 30% Q 50% 20% 75% 30% Q 80% 50% 75% 70%"
              stroke="#0052ff"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      {/* Current Location */}
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20" style={{ left: "50%", top: "50%" }}>
        <div className="relative">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute inset-0 w-4 h-4 bg-blue-600 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>

      {/* Markers */}
      {filteredMarkers.map((marker) => {
        const offsetX = (marker.lng - center.lng) * 5000 + 50 // Convert to percentage
        const offsetY = (center.lat - marker.lat) * 5000 + 50 // Convert to percentage

        return (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
            style={{
              left: `${Math.max(5, Math.min(95, offsetX))}%`,
              top: `${Math.max(5, Math.min(95, offsetY))}%`,
            }}
            onClick={() => setSelectedMarker(marker)}
          >
            <div
              className={`p-2 rounded-full border-2 shadow-lg hover:scale-110 transition-transform ${getMarkerColor(
                marker.type,
                marker.severity,
              )}`}
            >
              {getMarkerIcon(marker.type)}
            </div>
          </div>
        )
      })}

      {/* SOS Dispatch Animation */}
      {showSOSDispatch && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <Badge variant="destructive" className="animate-pulse text-sm px-4 py-2">
              🚨 Emergency Services Dispatched - ETA: 8-12 minutes
            </Badge>
          </div>

          {/* Animated dispatch route */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 20% 20% L 50% 50%"
              stroke="#ef4444"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
            <circle cx="20%" cy="20%" r="8" fill="#ef4444" className="animate-pulse">
              <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      )}

      {/* Marker Info Popup */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-background border rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getMarkerIcon(selectedMarker.type)}
                <h3 className="font-semibold text-sm">{selectedMarker.title}</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMarker(null)} className="h-6 w-6 p-0">
                ×
              </Button>
            </div>
            {selectedMarker.description && (
              <p className="text-xs text-muted-foreground mb-3">{selectedMarker.description}</p>
            )}
            {selectedMarker.severity && (
              <Badge
                variant={
                  selectedMarker.severity === "high"
                    ? "destructive"
                    : selectedMarker.severity === "medium"
                      ? "warning"
                      : "secondary"
                }
                className="text-xs mb-3"
              >
                {selectedMarker.severity.toUpperCase()} RISK
              </Badge>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Get Directions
              </Button>
              {selectedMarker.type === "hazard" && (
                <Button size="sm" variant="outline" onClick={onHazardReport} className="text-xs bg-transparent">
                  Report Update
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        Asteroid Map (Simulated)
      </div>
    </div>
  )
}
