"use client"

import { useState, useEffect } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Thermometer, Calendar, AlertTriangle, Users, Shield, TrendingUp, Clock, Navigation, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const { currentUser, itineraryText, contacts, alerts, isAdvanced, calculateTouristSafetyScore } = useSafeTrekStore()
  const [weather, setWeather] = useState({
    temp: 24,
    condition: "Partly Cloudy",
    icon: "⛅",
    location: "New Delhi, India",
  })
  const [todayItinerary, setTodayItinerary] = useState<string[]>([])
  const [touristSafetyScore, setTouristSafetyScore] = useState(85)
  const [isMapOpen, setIsMapOpen] = useState(false)

  useEffect(() => {
    // Simulate weather API call
    const mockWeather = {
      temp: Math.floor(Math.random() * 15) + 20,
      condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
      icon: ["☀️", "⛅", "☁️", "🌧️"][Math.floor(Math.random() * 4)],
      location: "New Delhi, India",
    }
    setWeather(mockWeather)

    // Parse today's itinerary from the full itinerary text
    if (itineraryText) {
      const lines = itineraryText.split("\n").filter((line) => line.trim())
      const todayItems = lines.slice(0, 3) // Show first 3 items as "today"
      setTodayItinerary(todayItems)
    }

    const dynamicScore = calculateTouristSafetyScore()
    setTouristSafetyScore(dynamicScore)
  }, [itineraryText, calculateTouristSafetyScore])

  const stats = [
    {
      title: "Emergency Contacts",
      value: contacts.length.toString(),
      icon: Users,
      description: "Contacts ready",
    },
    {
      title: "Tourist Safety Score",
      value: `${touristSafetyScore}%`,
      icon: Shield,
      description: "Based on travel patterns",
    },
    {
      title: "Active Alerts",
      value: alerts.length.toString(),
      icon: AlertTriangle,
      description: "Monitoring your area",
    },
  ]

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {currentUser.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground">Here's your safety overview for today</p>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {isAdvanced ? "ADVANCED PILOT" : "STANDARD ACCESS"}
          </Badge>
        </div>

        {/* Map & Weather Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{weather.location}</h3>
                  <p className="text-sm text-muted-foreground">Current Location</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-primary" />
                    <span className="text-2xl font-bold">{weather.temp}°C</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{weather.condition}</p>
                </div>
                <div className="text-3xl">{weather.icon}</div>
              </div>
            </div>
            <Button onClick={() => setIsMapOpen(true)} className="w-full" variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Open Safety Map
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Itinerary
              </CardTitle>
              <CardDescription>Your planned activities for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayItinerary.length > 0 ? (
                <div className="space-y-3">
                  {todayItinerary.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-4 w-4 text-primary mt-0.5" />
                      <p className="text-sm flex-1">{item}</p>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/ai/itinerary")}
                    className="w-full mt-3"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View AI Safety Analysis
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No itinerary set</p>
                  <Button variant="outline" size="sm" onClick={() => router.push("/settings")} className="mt-2">
                    Add Itinerary
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Local Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Local Safety Alerts
              </CardTitle>
              <CardDescription>Real-time safety updates for your area</CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          alert.severity === "red"
                            ? "bg-red-500"
                            : alert.severity === "amber"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => router.push("/ai/alerts")} className="w-full">
                    View All Alerts
                  </Button>
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access your most-used safety features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" onClick={() => setIsMapOpen(true)} className="h-20 flex-col">
                <MapPin className="h-6 w-6 mb-2" />
                <span className="text-xs">Safety Map</span>
              </Button>
              <Button variant="outline" onClick={() => router.push("/vault")} className="h-20 flex-col">
                <Shield className="h-6 w-6 mb-2" />
                <span className="text-xs">Document Vault</span>
              </Button>
              <Button variant="outline" onClick={() => router.push("/checklists")} className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-xs">Checklists</span>
              </Button>
              <Button variant="outline" onClick={() => router.push("/dtid")} className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-xs">Digital ID</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {isMapOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="relative w-full h-full">
            <button
              onClick={() => setIsMapOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/90 hover:bg-background shadow"
              aria-label="Close map"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe src="/map" className="w-full h-full bg-background" />
          </div>
        </div>
      )}
    </AppShell>
  )
}
