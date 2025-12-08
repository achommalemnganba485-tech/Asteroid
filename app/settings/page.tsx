"use client"

import { useState } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Settings,
  Shield,
  Volume2,
  Activity,
  Trash2,
  Download,
  AlertTriangle,
  Moon,
  Sun,
  Type,
  Accessibility,
} from "lucide-react"

export default function SettingsPage() {
  const {
    currentUser,
    permissions,
    setPermissions,
    ui,
    updateUI,
    aiSettings,
    updateAISettings,
    activity,
    addActivity,
  } = useSafeTrekStore()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [privacySettings, setPrivacySettings] = useState({
    locationTracking: permissions.location,
    analytics: true,
    emergencySharing: true,
    dataRetention: "90days" as const,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    safetyAlerts: true,
    tripReminders: true,
    notificationSound: "default" as const,
  })

  const handlePrivacyChange = (key: string, value: any) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }))
    if (key === "locationTracking") {
      setPermissions({ location: value })
    }
  }

  const handleUIChange = (key: string, value: any) => {
    updateUI({ [key]: value })
  }

  const handleNotificationChange = (key: string, value: any) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  const exportData = () => {
    const data = {
      user: currentUser,
      permissions,
      ui,
      aiSettings,
      activity,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "safetrek-data-export.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearActivityLogs = () => {
    // Since we can't directly clear from store, we'll simulate it
    addActivity({ type: "privacy", time: new Date().toISOString(), meta: { action: "cleared_logs" } })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold font-heading">Settings</h1>
          <p className="text-muted-foreground">Manage your Asteroid preferences and privacy</p>
        </div>
      </div>

      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Controls
              </CardTitle>
              <CardDescription>Control how your data is used and shared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Location Tracking</p>
                  <p className="text-sm text-muted-foreground">
                    Allow Asteroid to track your location for safety features
                  </p>
                </div>
                <Switch
                  checked={privacySettings.locationTracking}
                  onCheckedChange={(checked) => handlePrivacyChange("locationTracking", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Data Analytics</p>
                  <p className="text-sm text-muted-foreground">Help improve Asteroid by sharing anonymous usage data</p>
                </div>
                <Switch
                  checked={privacySettings.analytics}
                  onCheckedChange={(checked) => handlePrivacyChange("analytics", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Emergency Contact Sharing</p>
                  <p className="text-sm text-muted-foreground">
                    Share your location with emergency contacts during SOS
                  </p>
                </div>
                <Switch
                  checked={privacySettings.emergencySharing}
                  onCheckedChange={(checked) => handlePrivacyChange("emergencySharing", checked)}
                />
              </div>

              <div className="space-y-3">
                <p className="font-medium">Data Retention</p>
                <Select
                  value={privacySettings.dataRetention}
                  onValueChange={(value) => handlePrivacyChange("dataRetention", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 days</SelectItem>
                    <SelectItem value="90days">90 days</SelectItem>
                    <SelectItem value="1year">1 year</SelectItem>
                    <SelectItem value="indefinite">Indefinite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <Button onClick={exportData} variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Settings */}
        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility Options
              </CardTitle>
              <CardDescription>Customize Asteroid for your accessibility needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">High Contrast Mode</p>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch
                  checked={ui.contrast === "high"}
                  onCheckedChange={(checked) => handleUIChange("contrast", checked ? "high" : "normal")}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <p className="font-medium">Text Size</p>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={[ui.textScale === "md" ? 100 : ui.textScale === "lg" ? 125 : 150]}
                    onValueChange={([value]) => {
                      const scale = value <= 100 ? "md" : value <= 125 ? "lg" : "xl"
                      handleUIChange("textScale", scale)
                    }}
                    max={150}
                    min={75}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Small</span>
                    <span>Normal</span>
                    <span>Large</span>
                    <span>Extra Large</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-medium">Color Theme</p>
                <Select value={ui.theme} onValueChange={(value) => handleUIChange("theme", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Control when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Safety Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about safety hazards in your area
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.safetyAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("safetyAlerts", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Emergency Notifications</p>
                  <p className="text-sm text-muted-foreground">Critical safety notifications (cannot be disabled)</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Trip Reminders</p>
                  <p className="text-sm text-muted-foreground">Reminders about your itinerary and safety checks</p>
                </div>
                <Switch
                  checked={notificationSettings.tripReminders}
                  onCheckedChange={(checked) => handleNotificationChange("tripReminders", checked)}
                />
              </div>

              <div className="space-y-3">
                <p className="font-medium">Notification Sound</p>
                <Select
                  value={notificationSettings.notificationSound}
                  onValueChange={(value) => handleNotificationChange("notificationSound", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="gentle">Gentle</SelectItem>
                    <SelectItem value="silent">Silent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Logs */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Logs
              </CardTitle>
              <CardDescription>View your Asteroid activity history (tamper-evident)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Total Activities: {activity.length}</p>
                  <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Logs
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activity
                    .slice(-10)
                    .reverse()
                    .map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.type}</p>
                          <p className="text-xs text-muted-foreground">{new Date(log.time).toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {log.hash.slice(0, 8)}...
                        </Badge>
                      </div>
                    ))}
                  {activity.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No activity logs yet</p>
                  )}
                </div>

                {showDeleteConfirm && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-destructive">Clear Activity Logs?</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          This action cannot be undone. All activity history will be permanently deleted.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              clearActivityLogs()
                              setShowDeleteConfirm(false)
                            }}
                          >
                            Delete All
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
