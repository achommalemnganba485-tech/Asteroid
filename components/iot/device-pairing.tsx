"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bluetooth, Watch, Activity, Loader2 } from "lucide-react"

interface DevicePairingProps {
  onConnect: () => void
  isConnecting: boolean
}

export function DevicePairing({ onConnect, isConnecting }: DevicePairingProps) {
  const mockDevices = [
    {
      name: "SafeTrek Watch Pro",
      type: "Smartwatch",
      icon: Watch,
      battery: "89%",
      lastSeen: "2 min ago",
      features: ["Heart Rate", "Blood Pressure", "SpO₂", "Activity"],
    },
    {
      name: "Health Band 5",
      type: "Fitness Tracker",
      icon: Activity,
      battery: "67%",
      lastSeen: "5 min ago",
      features: ["Heart Rate", "SpO₂", "Steps"],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Pairing Instructions */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5 text-primary" />
            Device Pairing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Connect your wearable device to start monitoring your health vitals in real-time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>Turn on Bluetooth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>Enable device pairing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>Click connect below</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockDevices.map((device, index) => (
          <Card
            key={index}
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <device.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{device.name}</h3>
                      <p className="text-sm text-muted-foreground">{device.type}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {device.battery}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {device.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Last seen: {device.lastSeen}</p>
                </div>

                <Button onClick={onConnect} disabled={isConnecting} className="w-full" size="sm">
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Bluetooth className="h-4 w-4 mr-2" />
                      Connect Device
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
