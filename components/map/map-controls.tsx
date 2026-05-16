"use client"

import { useSafeTrekStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Cross, Building2, Users, AlertTriangle, Navigation, MapPin, Info } from "lucide-react"

interface MapControlsProps {
  layers: {
    police: boolean
    hospitals: boolean
    embassies: boolean
    safeZones: boolean
    hazards: boolean
  }
  onLayerToggle: (layer: keyof MapControlsProps["layers"]) => void
  routeMode: "fastest" | "safest"
  onRouteModeChange: (mode: "fastest" | "safest") => void
}

export function MapControls({ layers, onLayerToggle, routeMode, onRouteModeChange }: MapControlsProps) {
  const { alerts } = useSafeTrekStore()

  const layerControls = [
    {
      key: "police" as const,
      label: "Police Stations",
      icon: Shield,
      color: "text-blue-600",
      count: 2,
    },
    {
      key: "hospitals" as const,
      label: "Hospitals",
      icon: Cross,
      color: "text-red-600",
      count: 2,
    },
    {
      key: "embassies" as const,
      label: "Embassies",
      icon: Building2,
      color: "text-purple-600",
      count: 2,
    },
    {
      key: "safeZones" as const,
      label: "Safe Zones",
      icon: Users,
      color: "text-green-600",
      count: 2,
    },
    {
      key: "hazards" as const,
      label: "Hazard Reports",
      icon: AlertTriangle,
      color: "text-orange-600",
      count: 2,
    },
  ]

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Map Layers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Map Layers
          </CardTitle>
          <CardDescription>Toggle visibility of safety locations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {layerControls.map((control) => (
            <div key={control.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <control.icon className={`h-4 w-4 ${control.color}`} />
                <div className="flex-1">
                  <Label htmlFor={control.key} className="text-sm font-medium cursor-pointer">
                    {control.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{control.count} nearby</p>
                </div>
              </div>
              <Switch
                id={control.key}
                checked={layers[control.key]}
                onCheckedChange={() => onLayerToggle(control.key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Route Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Route Options
          </CardTitle>
          <CardDescription>Choose your preferred routing method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                routeMode === "fastest" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => onRouteModeChange("fastest")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  <span className="font-medium">Fastest Route</span>
                </div>
                {routeMode === "fastest" && <div className="w-2 h-2 bg-primary rounded-full" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Shortest travel time</p>
            </div>

            <div
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                routeMode === "safest" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => onRouteModeChange("safest")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Safest Route</span>
                </div>
                {routeMode === "safest" && <div className="w-2 h-2 bg-primary rounded-full" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Well-lit streets, avoids hazard areas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Alerts
            <Badge variant="secondary" className="text-xs">
              {alerts.length}
            </Badge>
          </CardTitle>
          <CardDescription>Real-time safety updates in your area</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-2 border rounded-lg">
                  <div
                    className={`w-3 h-3 rounded-full mt-2 ${
                      alert.severity === "red"
                        ? "bg-red-500"
                        : alert.severity === "amber"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.text}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
              {alerts.length > 3 && (
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All {alerts.length} Alerts
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">All clear in your area</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            Map Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>SOS Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Safe Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Hazard</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
