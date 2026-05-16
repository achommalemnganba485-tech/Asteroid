"use client"

import { useState } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { AppShell } from "@/components/layout/app-shell"
import { AdvancedFeatureBanner } from "@/components/ui/advanced-feature-banner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Route, Shield, MapPin, AlertTriangle, Zap } from "lucide-react"

export default function AIItineraryPage() {
  const { isAdvanced, itineraryText, setItinerary, calculateTouristSafetyScore } = useSafeTrekStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const handleAnalyzeItinerary = async () => {
    setIsAnalyzing(true)

    setTimeout(() => {
      const safetyScore = calculateTouristSafetyScore()
      const results = {
        overallScore: safetyScore,
        riskAreas: [
          { location: "Downtown Market", risk: "Medium", reason: "Crowded area, pickpocket reports" },
          { location: "Beach Road", risk: "Low", reason: "Well-patrolled tourist area" },
          { location: "Old City", risk: "High", reason: "Narrow streets, limited emergency access" },
        ],
        recommendations: [
          "Avoid Old City area after sunset",
          "Use main roads when traveling to Downtown Market",
          "Beach Road is safe for evening activities",
          "Keep emergency contacts readily available",
        ],
        timeAnalysis: {
          safestHours: "10 AM - 6 PM",
          riskHours: "After 9 PM",
          peakSafety: "2 PM - 4 PM",
        },
      }
      setAnalysisResults(results)
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Itinerary Safety</h1>
            <p className="text-muted-foreground">AI-powered safety analysis of your travel plans</p>
          </div>
          {isAdvanced && (
            <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">ADVANCED ACTIVE</Badge>
          )}
        </div>

        {!isAdvanced && (
          <AdvancedFeatureBanner
            featureName="AI Itinerary Safety"
            description="Get AI-powered safety analysis of your travel itinerary with risk assessments and recommendations."
          />
        )}

        {/* Itinerary Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Your Itinerary
            </CardTitle>
            <CardDescription>Enter your travel plans for AI safety analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your travel itinerary here... (e.g., 9 AM - Visit Red Fort, 12 PM - Lunch at Chandni Chowk, 3 PM - India Gate, etc.)"
              value={itineraryText}
              onChange={(e) => setItinerary(e.target.value)}
              className="min-h-[120px]"
            />
            <Button onClick={handleAnalyzeItinerary} disabled={!itineraryText.trim() || isAnalyzing} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              {isAnalyzing ? "Analyzing Safety..." : "Analyze Itinerary Safety"}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResults && (
          <>
            {/* Overall Safety Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Tourist Safety Score
                </CardTitle>
                <CardDescription>Overall safety assessment of your itinerary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Overall Safety Score</span>
                    <span
                      className={`text-3xl font-bold ${
                        analysisResults.overallScore >= 85
                          ? "text-green-600"
                          : analysisResults.overallScore >= 70
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {analysisResults.overallScore}/100
                    </span>
                  </div>
                  <Progress value={analysisResults.overallScore} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <p className="font-medium">
                        {analysisResults.overallScore >= 85
                          ? "Low"
                          : analysisResults.overallScore >= 70
                            ? "Medium"
                            : "High"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Safest Time</p>
                      <p className="font-medium">{analysisResults.timeAnalysis.safestHours}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Areas Analyzed</p>
                      <p className="font-medium">{analysisResults.riskAreas.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Risk Analysis
                </CardTitle>
                <CardDescription>Safety assessment for each location in your itinerary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResults.riskAreas.map((area: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${
                          area.risk === "High"
                            ? "bg-red-500"
                            : area.risk === "Medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{area.location}</h3>
                          <Badge
                            variant={
                              area.risk === "High" ? "destructive" : area.risk === "Medium" ? "secondary" : "outline"
                            }
                          >
                            {area.risk} Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{area.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Safety Recommendations
                </CardTitle>
                <CardDescription>AI-generated safety tips for your itinerary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResults.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!analysisResults && itineraryText && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Route className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                Click "Analyze Itinerary Safety" to get AI-powered safety insights
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
