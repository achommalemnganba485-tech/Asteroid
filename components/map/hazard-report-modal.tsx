"use client"

import type React from "react"

import { useState } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, MapPin, Camera, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HazardReportModalProps {
  isOpen: boolean
  onClose: () => void
  currentLocation: { lat: number; lng: number; address: string }
}

export function HazardReportModal({ isOpen, onClose, currentLocation }: HazardReportModalProps) {
  const { addActivity } = useSafeTrekStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    severity: "",
    title: "",
    description: "",
    location: currentLocation.address,
  })

  const hazardTypes = [
    { value: "construction", label: "Construction/Road Work" },
    { value: "accident", label: "Traffic Accident" },
    { value: "crime", label: "Criminal Activity" },
    { value: "weather", label: "Weather Hazard" },
    { value: "infrastructure", label: "Infrastructure Issue" },
    { value: "crowd", label: "Large Crowd/Event" },
    { value: "other", label: "Other" },
  ]

  const severityLevels = [
    { value: "low", label: "Low - Minor inconvenience", color: "text-green-600" },
    { value: "medium", label: "Medium - Moderate risk", color: "text-yellow-600" },
    { value: "high", label: "High - Significant danger", color: "text-red-600" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.type || !formData.severity || !formData.title.trim()) return

    setIsSubmitting(true)

    try {
      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Log the hazard report
      addActivity({
        type: "HAZARD_REPORTED",
        time: new Date().toISOString(),
        meta: {
          hazardType: formData.type,
          severity: formData.severity,
          location: currentLocation,
          title: formData.title,
        },
      })

      toast({
        title: "Hazard Report Submitted",
        description: "Thank you for helping keep the community safe. Your report is under review.",
      })

      // Reset form and close
      setFormData({
        type: "",
        severity: "",
        title: "",
        description: "",
        location: currentLocation.address,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Report Safety Hazard
          </DialogTitle>
          <DialogDescription>
            Help keep the community safe by reporting hazards and incidents in your area.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm">{formData.location}</span>
            </div>
            <p className="text-xs text-muted-foreground">Report will be tagged to your current location</p>
          </div>

          {/* Hazard Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Hazard Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select hazard type" />
              </SelectTrigger>
              <SelectContent>
                {hazardTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label htmlFor="severity">Severity Level *</Label>
            <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                {severityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <span className={level.color}>{level.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Brief Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Road construction blocking lane"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={100}
              className="focus-ring"
            />
            <p className="text-xs text-muted-foreground">{formData.title.length}/100 characters</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Additional Details</Label>
            <Textarea
              id="description"
              placeholder="Provide more details about the hazard, when it occurred, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              maxLength={500}
              className="focus-ring"
            />
            <p className="text-xs text-muted-foreground">{formData.description.length}/500 characters</p>
          </div>

          {/* Photo Upload Placeholder */}
          <div className="space-y-2">
            <Label>Photo Evidence (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Tap to add photo</p>
              <p className="text-xs text-muted-foreground">Helps verify the report</p>
            </div>
          </div>

          {/* Moderation Notice */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Community Moderation</p>
                <p className="text-xs text-blue-700 dark:text-blue-200">
                  All reports are reviewed by our safety team before being published to ensure accuracy.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.type || !formData.severity || !formData.title.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
