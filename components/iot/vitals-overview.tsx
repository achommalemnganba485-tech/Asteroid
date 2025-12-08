import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"

interface VitalReading {
  timestamp: number
  heartRate: number
  systolic: number
  diastolic: number
  spO2: number
}

interface VitalsOverviewProps {
  vitals: VitalReading
  getStatus: (type: string, value: number) => string
}

export function VitalsOverview({ vitals, getStatus }: VitalsOverviewProps) {
  const vitalCards = [
    {
      title: "Heart Rate",
      value: vitals.heartRate,
      unit: "bpm",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      status: getStatus("heartRate", vitals.heartRate),
    },
    {
      title: "Blood Pressure",
      value: `${vitals.systolic}/${vitals.diastolic}`,
      unit: "mmHg",
      icon: Activity,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      status: getStatus("bloodPressure", vitals.systolic),
    },
    {
      title: "Blood Oxygen",
      value: vitals.spO2,
      unit: "%",
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      status: getStatus("spO2", vitals.spO2),
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "danger":
        return "destructive"
      case "warning":
        return "outline"
      case "normal":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "danger":
        return "Alert"
      case "warning":
        return "Caution"
      case "normal":
        return "Normal"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {vitalCards.map((vital, index) => (
        <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{vital.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{vital.value}</span>
                  <span className="text-sm text-muted-foreground">{vital.unit}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={cn("p-2 rounded-lg", vital.bgColor)}>
                  <vital.icon className={cn("h-5 w-5", vital.color)} />
                </div>
                <Badge variant={getStatusColor(vital.status) as any} className="text-xs">
                  {getStatusText(vital.status)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
