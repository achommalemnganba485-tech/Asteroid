"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Activity, Droplets, Bluetooth, BluetoothConnected, Wifi, CheckCircle } from "lucide-react"
import { VitalsChart } from "@/components/iot/vitals-chart"
import { DevicePairing } from "@/components/iot/device-pairing"
import { VitalsOverview } from "@/components/iot/vitals-overview"

interface VitalReading {
  timestamp: number
  heartRate: number
  systolic: number
  diastolic: number
  spO2: number
}

export default function IoTPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [device, setDevice] = useState<BluetoothDevice | null>(null)
  const [vitals, setVitals] = useState<VitalReading[]>([])
  const [currentVitals, setCurrentVitals] = useState<VitalReading | null>(null)

  // Simulate vitals data stream
  const generateVitalReading = useCallback((): VitalReading => {
    const now = Date.now()
    const baseHR = 72
    const baseSystolic = 120
    const baseDiastolic = 80
    const baseSpO2 = 98

    return {
      timestamp: now,
      heartRate: Math.round(baseHR + (Math.random() - 0.5) * 20),
      systolic: Math.round(baseSystolic + (Math.random() - 0.5) * 30),
      diastolic: Math.round(baseDiastolic + (Math.random() - 0.5) * 20),
      spO2: Math.round(baseSpO2 + (Math.random() - 0.5) * 4),
    }
  }, [])

  // Start vitals simulation when connected
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      const newReading = generateVitalReading()
      setCurrentVitals(newReading)
      setVitals((prev) => [...prev.slice(-119), newReading]) // Keep last 120 readings (2 hours at 1min intervals)
    }, 1000) // Update every second for demo

    return () => clearInterval(interval)
  }, [isConnected, generateVitalReading])

  const handleConnect = async () => {
    setIsConnecting(true)

    try {
      // Simulate Web Bluetooth pairing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock device connection
      const mockDevice = {
        name: "SafeTrek Watch Pro",
        id: "st-watch-001",
        gatt: { connected: true },
      } as BluetoothDevice

      setDevice(mockDevice)
      setIsConnected(true)

      // Initialize with first reading
      const initialReading = generateVitalReading()
      setCurrentVitals(initialReading)
      setVitals([initialReading])
    } catch (error) {
      console.error("Connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setDevice(null)
    setIsConnected(false)
    setVitals([])
    setCurrentVitals(null)
  }

  const getVitalStatus = (type: string, value: number) => {
    switch (type) {
      case "heartRate":
        if (value < 60 || value > 100) return "warning"
        return "normal"
      case "bloodPressure":
        // Using systolic value
        if (value > 140) return "danger"
        if (value > 120) return "warning"
        return "normal"
      case "spO2":
        if (value < 95) return "danger"
        if (value < 98) return "warning"
        return "normal"
      default:
        return "normal"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">IoT Health Monitor</h1>
            <p className="text-muted-foreground mt-1">Connect and monitor your wearable devices</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="gap-1">
              {isConnected ? (
                <>
                  <BluetoothConnected className="h-3 w-3" />
                  Connected
                </>
              ) : (
                <>
                  <Bluetooth className="h-3 w-3" />
                  Disconnected
                </>
              )}
            </Badge>
          </div>
        </div>

        <Separator />

        {!isConnected ? (
          <DevicePairing onConnect={handleConnect} isConnecting={isConnecting} />
        ) : (
          <>
            {/* Device Status */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Device Status</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    Disconnect
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">{device?.name}</span>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Wifi className="h-3 w-3" />
                    Signal Strong
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Synced
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Current Vitals Overview */}
            {currentVitals && <VitalsOverview vitals={currentVitals} getStatus={getVitalStatus} />}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VitalsChart
                title="Heart Rate"
                data={vitals}
                dataKey="heartRate"
                color="#ef4444"
                unit="bpm"
                icon={Heart}
                status={currentVitals ? getVitalStatus("heartRate", currentVitals.heartRate) : "normal"}
              />

              <VitalsChart
                title="Blood Oxygen"
                data={vitals}
                dataKey="spO2"
                color="#3b82f6"
                unit="%"
                icon={Droplets}
                status={currentVitals ? getVitalStatus("spO2", currentVitals.spO2) : "normal"}
              />
            </div>

            <VitalsChart
              title="Blood Pressure"
              data={vitals}
              dataKey="systolic"
              secondaryDataKey="diastolic"
              color="#8b5cf6"
              secondaryColor="#06b6d4"
              unit="mmHg"
              icon={Activity}
              status={currentVitals ? getVitalStatus("bloodPressure", currentVitals.systolic) : "normal"}
              className="col-span-full"
            />
          </>
        )}
      </div>
    </div>
  )
}
