"use client"

import { useState, useEffect } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { AppShell } from "@/components/layout/app-shell"
import { AdvancedFeatureBanner } from "@/components/ui/advanced-feature-banner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Bell, MapPin, Clock, Shield } from "lucide-react"

export default function AIAlertsPage() {
  const { isAdvanced, alerts, addAlert } = useSafeTrekStore()
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [locationAlerts, setLocationAlerts] = useState(true)
  const [weatherAlerts, setWeatherAlerts] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)

  useEffect(() => {
    if (alerts.length === 0) {
      const demoAlerts = [
        {
          time: "2 hours ago",
          source: "AI" as const,
          severity: "amber" as const,
          title: "Weather Alert",
          text: "Heavy rainfall expected in your area between 6-8 PM. Consider indoor activities.",
        },
        {
          time: "4 hours ago",
          source: "Community" as const,
          severity: "green" as const,
          title: "Area Update",
          text: "Tourist area security increased. Safe to visit popular attractions.",
        },
        {
          time: "6 hours ago",
          source: "AI" as const,
          severity: "red" as const,
          title: "Security Alert",
          text: "Avoid downtown area after 9 PM due to increased incident reports.",
        },
      ]

      demoAlerts.forEach((alert) => addAlert(alert))
    }
  }, [alerts.length, addAlert])

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Hazard Alerts</h1>
            <p className="text-muted-foreground">Real-time safety notifications powered by AI</p>
          </div>
          {isAdvanced && (
            <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">ADVANCED ACTIVE</Badge>
          )}
        </div>

        {!isAdvanced && (
          <AdvancedFeatureBanner
            featureName="AI Hazard Alerts"
            description="Get real-time AI-powered safety alerts and hazard notifications for your location."
          />
        )}

        {/* Alert Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alert Settings
            </CardTitle>
            <CardDescription>Configure your AI alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Master Alerts</p>
                <p className="text-sm text-muted-foreground">Enable all AI-powered alerts</p>
              </div>
              <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Location-based Alerts</p>
                <p className="text-sm text-muted-foreground">Alerts based on your current location</p>
              </div>
              <Switch checked={locationAlerts} onCheckedChange={setLocationAlerts} disabled={!alertsEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weather Alerts</p>
                <p className="text-sm text-muted-foreground">Severe weather and travel disruptions</p>
              </div>
              <Switch checked={weatherAlerts} onCheckedChange={setWeatherAlerts} disabled={!alertsEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Security Alerts</p>
                <p className="text-sm text-muted-foreground">Safety incidents and security updates</p>
              </div>
              <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} disabled={!alertsEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts
            </CardTitle>
            <CardDescription>Current safety alerts for your area</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${
                        alert.severity === "red"
                          ? "bg-red-500"
                          : alert.severity === "amber"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{alert.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {alert.source}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.text}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Current Area
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-muted-foreground">All clear in your area</p>
                <p className="text-xs text-muted-foreground mt-1">No active safety alerts</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
