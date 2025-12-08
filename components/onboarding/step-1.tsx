"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Step1Props {
  onValidationChange: (isValid: boolean) => void
  onNext: () => void
  onBack: () => void
  isValid: boolean
  currentStep: number
}

export function OnboardingStep1({ onValidationChange, onNext }: Step1Props) {
  const { currentUser, setUser } = useSafeTrekStore()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: currentUser.name || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
    docType: currentUser.docType || ("" as "Passport" | "Aadhaar" | ""),
  })
  const [uploadedDoc, setUploadedDoc] = useState<File | null>(null)

  useEffect(() => {
    const isValid =
      formData.name.trim().length > 0 &&
      formData.email.trim().length > 0 &&
      formData.phone.trim().length > 0 &&
      formData.docType !== "" &&
      uploadedDoc !== null

    onValidationChange(isValid)
  }, [formData, uploadedDoc, onValidationChange])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDocTypeSelect = (docType: "Passport" | "Aadhaar") => {
    setFormData((prev) => ({ ...prev, docType }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, or PDF file.",
          variant: "destructive",
        })
        return
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      setUploadedDoc(file)
      toast({
        title: "Document uploaded",
        description: "Your ID document has been securely uploaded.",
      })
    }
  }

  const handleNext = () => {
    // Save data to store
    setUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      docType: formData.docType,
    })
    onNext()
  }

  return (
    <Card className="bg-background/20 backdrop-blur-md border-border/30 shadow-xl">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>We need some basic information to verify your identity and keep you safe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="focus-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-foreground/90">Email cannot be changed after sign-in</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="focus-ring"
            />
          </div>
        </div>

        {/* Document Type Selection */}
        <div className="space-y-3">
          <Label>ID Document Type</Label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleDocTypeSelect("Passport")}
              className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                formData.docType === "Passport"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Passport</div>
            </button>
            <button
              type="button"
              onClick={() => handleDocTypeSelect("Aadhaar")}
              className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                formData.docType === "Aadhaar" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Aadhaar</div>
            </button>
          </div>
        </div>

        {/* Document Upload */}
        {formData.docType && (
          <div className="space-y-3">
            <Label>Upload {formData.docType}</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center relative">
              {uploadedDoc ? (
                <div className="space-y-2">
                  <FileText className="h-8 w-8 mx-auto text-green-500" />
                  <p className="text-sm font-medium">{uploadedDoc.name}</p>
                  <p className="text-xs text-muted-foreground">{(uploadedDoc.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Badge variant="success">Uploaded</Badge>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-foreground/80" />
                  <p className="text-sm">Drag and drop your {formData.docType} or click to browse</p>
                  <p className="text-xs text-foreground/90">JPEG, PNG, or PDF up to 5MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                style={{ bottom: "auto" }}
              />
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="flex justify-end pt-4 relative z-20">
          <Button
            onClick={handleNext}
            disabled={!formData.name || !formData.phone || !formData.docType || !uploadedDoc}
            size="lg"
          >
            Continue to Trip Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
