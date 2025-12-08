import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface VitalReading {
  timestamp: number
  heartRate: number
  systolic: number
  diastolic: number
  spO2: number
}

interface VitalsChartProps {
  title: string
  data: VitalReading[]
  dataKey: keyof VitalReading
  secondaryDataKey?: keyof VitalReading
  color: string
  secondaryColor?: string
  unit: string
  icon: LucideIcon
  status: string
  className?: string
}

export function VitalsChart({
  title,
  data,
  dataKey,
  secondaryDataKey,
  color,
  secondaryColor,
  unit,
  icon: Icon,
  status,
  className,
}: VitalsChartProps) {
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

  const formatXAxisTick = (tickItem: number) => {
    return new Date(tickItem).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">{new Date(label).toLocaleString()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {unit}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const currentValue = data.length > 0 ? data[data.length - 1][dataKey] : 0
  const secondaryValue = secondaryDataKey && data.length > 0 ? data[data.length - 1][secondaryDataKey] : null

  return (
    <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className="h-5 w-5" style={{ color }} />
            {title}
          </CardTitle>
          <Badge variant={getStatusColor(status) as any} className="text-xs">
            {getStatusText(status)}
          </Badge>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">
            {typeof currentValue === "number" ? currentValue : 0}
            {secondaryValue && `/${secondaryValue}`}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxisTick}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {secondaryDataKey && <Legend />}
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
                name={secondaryDataKey ? "Systolic" : title}
              />
              {secondaryDataKey && secondaryColor && (
                <Line
                  type="monotone"
                  dataKey={secondaryDataKey}
                  stroke={secondaryColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: secondaryColor, strokeWidth: 2 }}
                  name="Diastolic"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
