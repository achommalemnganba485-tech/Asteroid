"use client"

import { useState, useEffect } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, QrCode, Shield, Clock, Hash, Eye, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DTIDPage() {
  const { currentUser, itineraryText, addActivity } = useSafeTrekStore()
  const { toast } = useToast()
  const [digitalId, setDigitalId] = useState<any>(null)
  const [scanLogs, setScanLogs] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Generate initial digital ID
    generateDigitalId()

    // Load mock scan logs
    setScanLogs([
      {
        id: "1",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: "Delhi Airport Security",
        hash: "0x7f9a8b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
        verifier: "Airport Security System",
        status: "verified",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        location: "Hotel Check-in",
        hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        verifier: "Hotel Management System",
        status: "verified",
      },
    ])
  }, [])

  const generateDigitalId = async () => {
    setIsGenerating(true)

    try {
      // Simulate ID generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const tripId = `ST-${Date.now().toString(36).toUpperCase()}`
      const qrData = {
        id: tripId,
        name: currentUser.name,
        email: currentUser.email,
        docType: currentUser.docType,
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        verificationHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      }

      setDigitalId(qrData)

      addActivity({
        type: "DTID_GENERATED",
        time: new Date().toISOString(),
        meta: { tripId, docType: currentUser.docType },
      })

      toast({
        title: "Digital ID Generated",
        description: "Your trip-bound digital identity is ready for verification.",
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleViewQR = () => {
    addActivity({
      type: "DTID_QR_VIEWED",
      time: new Date().toISOString(),
      meta: { tripId: digitalId?.id },
    })

    toast({
      title: "QR Code Displayed",
      description: "Show this QR code to authorized verifiers only.",
    })
  }

  const simulateScan = () => {
    const newScan = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      location: "Tourist Information Center",
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      verifier: "Asteroid Verification System",
      status: "verified",
    }

    setScanLogs([newScan, ...scanLogs])

    addActivity({
      type: "DTID_SCANNED",
      time: new Date().toISOString(),
      meta: {
        tripId: digitalId?.id,
        location: newScan.location,
        hash: newScan.hash,
      },
    })

    toast({
      title: "ID Scanned Successfully",
      description: "Verification logged to blockchain (simulated).",
    })
  }

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`
  }

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-primary" />
              Digital Travel ID
            </h1>
            <p className="text-muted-foreground">Secure, verifiable digital identity for your travels</p>
          </div>
          <Button onClick={generateDigitalId} disabled={isGenerating} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "Generating..." : "Regenerate ID"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Digital ID Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Digital ID Card
              </CardTitle>
              <CardDescription>Your trip-bound digital identity with blockchain verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {digitalId ? (
                <>
                  {/* ID Card Display */}
                  <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">Asteroid Digital ID</h3>
                        <p className="text-primary-foreground/80 text-sm">Travel Identity</p>
                      </div>
                      <Shield className="h-8 w-8 text-primary-foreground/80" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-primary-foreground/80 text-xs uppercase tracking-wide">Name</p>
                        <p className="font-semibold">{digitalId.name}</p>
                      </div>
                      <div>
                        <p className="text-primary-foreground/80 text-xs uppercase tracking-wide">Trip ID</p>
                        <p className="font-mono text-sm">{digitalId.id}</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-primary-foreground/80 text-xs uppercase tracking-wide">Issued</p>
                          <p className="text-sm">{new Date(digitalId.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-primary-foreground/80 text-xs uppercase tracking-wide">Expires</p>
                          <p className="text-sm">{new Date(digitalId.expiryDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="text-center space-y-4">
                    <div className="bg-white p-6 rounded-lg border-2 border-dashed border-border inline-block">
                      <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Verification QR Code</p>
                      <p className="text-xs text-muted-foreground">Scan to verify identity and log to blockchain</p>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" onClick={handleViewQR}>
                          <Eye className="h-3 w-3 mr-1" />
                          View QR
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" onClick={simulateScan}>
                          Simulate Scan
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Verification Hash */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Verification Hash</span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground break-all">{digitalId.verificationHash}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Generating your digital ID...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scan Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Verification Scan Log
              </CardTitle>
              <CardDescription>Tamper-evident log of all ID verifications (blockchain anchored)</CardDescription>
            </CardHeader>
            <CardContent>
              {scanLogs.length > 0 ? (
                <div className="space-y-4">
                  {scanLogs.map((scan, index) => (
                    <div key={scan.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={scan.status === "verified" ? "success" : "secondary"} className="text-xs">
                              {scan.status.toUpperCase()}
                            </Badge>
                            <span className="text-sm font-medium">{scan.location}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {new Date(scan.timestamp).toLocaleString()}
                          </p>
                          <div className="bg-muted/50 p-2 rounded text-xs">
                            <div className="flex items-center gap-1 mb-1">
                              <Hash className="h-3 w-3" />
                              <span className="font-medium">Blockchain Hash:</span>
                            </div>
                            <p className="font-mono text-muted-foreground">{formatHash(scan.hash)}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Verified by: {scan.verifier}</p>
                        </div>
                      </div>
                      {index < scanLogs.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No scans recorded yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Verification history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Blockchain Info */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Blockchain Verification (Simulated)</h3>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Each scan creates an immutable record on the blockchain, ensuring your identity verifications cannot
                  be tampered with. This provides a complete audit trail of your travel identity usage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
