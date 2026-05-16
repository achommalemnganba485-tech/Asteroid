"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Star, Phone } from "lucide-react"

interface ItineraryFormData {
  startDate: string
  endDate: string
  fromCountry: string
  fromState: string
  fromCity: string
  toCountry: string
  toState: string
  toCity: string
  purpose: "famous-places" | "visiting-friends" | ""
  selectedAttractions: string[]
  friendCity: string
  friendContact: string
}

interface ItineraryPlanFormProps {
  onSubmit: (data: ItineraryFormData) => void
  onValidationChange: (isValid: boolean) => void
}

// Mock data for countries, states, cities, and attractions
const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia"]

const STATES: Record<string, string[]> = {
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ],
  "United States": ["California", "New York", "Texas", "Florida", "Illinois", "Pennsylvania"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
  Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"],
}

const CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar"],
  Bihar: ["Patna", "Gaya", "Bhagalpur"],
  Chhattisgarh: ["Raipur", "Bilaspur", "Jagdalpur"],
  Goa: ["Panaji", "Margao", "Vasco da Gama"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Haryana: ["Gurugram", "Faridabad", "Karnal"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Manipur: ["Imphal", "Churachandpur", "Thoubal"],
  Meghalaya: ["Shillong", "Cherrapunji", "Tura"],
  Mizoram: ["Aizawl", "Lunglei", "Champhai"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung"],
  Odisha: ["Bhubaneswar", "Cuttack", "Puri"],
  Punjab: ["Amritsar", "Ludhiana", "Jalandhar"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
  Sikkim: ["Gangtok", "Namchi", "Pelling"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
  Tripura: ["Agartala", "Udaipur", "Dharmanagar"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra"],
  Uttarakhand: ["Dehradun", "Nainital", "Haridwar"],
  "West Bengal": ["Kolkata", "Darjeeling", "Siliguri"],
  "Andaman and Nicobar Islands": ["Port Blair", "Havelock Island", "Neil Island"],
  Chandigarh: ["Chandigarh", "Mohali", "Panchkula"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa", "Diu"],
  Delhi: ["New Delhi", "Old Delhi", "Dwarka"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Gulmarg"],
  Ladakh: ["Leh", "Kargil", "Diskit"],
  Lakshadweep: ["Kavaratti", "Agatti", "Minicoy"],
  Puducherry: ["Puducherry", "Karaikal", "Auroville"],
  California: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany"],
  England: ["London", "Manchester", "Birmingham", "Liverpool"],
}

const ATTRACTIONS: Record<string, string[]> = {
  "Andhra Pradesh": ["Araku Valley", "Sri Venkateswara Temple", "Borra Caves"],
  "Arunachal Pradesh": ["Tawang Monastery", "Ziro Valley", "Sela Pass"],
  Assam: ["Kaziranga National Park", "Kamakhya Temple", "Majuli Island"],
  Bihar: ["Mahabodhi Temple", "Nalanda Ruins", "Vikramshila Site"],
  Chhattisgarh: ["Chitrakote Falls", "Barnawapara Sanctuary", "Bhoramdeo Temple"],
  Goa: ["Basilica of Bom Jesus", "Calangute Beach", "Dudhsagar Falls"],
  Gujarat: ["Statue of Unity", "Gir National Park", "Sabarmati Ashram"],
  Haryana: ["Kingdom of Dreams", "Sultanpur Bird Sanctuary", "Kurukshetra"],
  "Himachal Pradesh": ["Shimla Ridge", "Rohtang Pass", "Spiti Valley"],
  Jharkhand: ["Betla National Park", "Hundru Falls", "Jagannath Temple"],
  Karnataka: ["Mysore Palace", "Hampi", "Coorg"],
  Kerala: ["Alleppey Backwaters", "Fort Kochi", "Munnar Tea Estates"],
  "Madhya Pradesh": ["Khajuraho Temples", "Sanchi Stupa", "Bandhavgarh Park"],
  Maharashtra: ["Gateway of India", "Ajanta Caves", "Marine Drive"],
  Manipur: ["Loktak Lake", "Kangla Fort", "Dzukou Valley"],
  Meghalaya: ["Living Root Bridges", "Umiam Lake", "Laitlum Canyon"],
  Mizoram: ["Phawngpui (Blue Mountain)", "Reiek", "Vantawng Falls"],
  Nagaland: ["Kohima War Cemetery", "Hornbill Festival Grounds", "Dzükou Valley"],
  Odisha: ["Konark Sun Temple", "Jagannath Puri", "Chilika Lake"],
  Punjab: ["Golden Temple", "Wagah Border", "Jallianwala Bagh"],
  Rajasthan: ["Amber Fort", "City Palace Udaipur", "Jaisalmer Fort"],
  Sikkim: ["Nathu La Pass", "Gurudongmar Lake", "Rumtek Monastery"],
  "Tamil Nadu": ["Meenakshi Temple", "Mahabalipuram Shore Temple", "Ooty Gardens"],
  Telangana: ["Charminar", "Golconda Fort", "Ramoji Film City"],
  Tripura: ["Ujjayanta Palace", "Neermahal", "Unakoti"],
  "Uttar Pradesh": ["Taj Mahal", "Varanasi Ghats", "Lucknow Residency"],
  Uttarakhand: ["Jim Corbett Park", "Har Ki Pauri", "Valley of Flowers"],
  "West Bengal": ["Victoria Memorial", "Sundarbans", "Howrah Bridge"],
  "Andaman and Nicobar Islands": ["Radhanagar Beach", "Cellular Jail", "Ross Island"],
  Chandigarh: ["Rock Garden", "Sukhna Lake", "Rose Garden"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Devka Beach", "Diu Fort", "Vanganga Lake"],
  Delhi: ["India Gate", "Qutub Minar", "Red Fort"],
  "Jammu and Kashmir": ["Dal Lake", "Gulmarg", "Vaishno Devi"],
  Ladakh: ["Pangong Lake", "Magnetic Hill", "Hemis Monastery"],
  Lakshadweep: ["Bangaram Atoll", "Agatti Island", "Minicoy Lighthouse"],
  Puducherry: ["Promenade Beach", "Sri Aurobindo Ashram", "Paradise Beach"],
  California: ["Golden Gate Bridge", "Hollywood Sign", "Yosemite National Park", "Disneyland", "Alcatraz Island"],
  "New York": ["Statue of Liberty", "Times Square", "Central Park", "Empire State Building", "Brooklyn Bridge"],
  England: ["Big Ben", "Tower of London", "Buckingham Palace", "Stonehenge", "Windsor Castle"],
}

export function ItineraryPlanForm({ onSubmit, onValidationChange }: ItineraryPlanFormProps) {
  const [formData, setFormData] = useState<ItineraryFormData>({
    startDate: "",
    endDate: "",
    fromCountry: "",
    fromState: "",
    fromCity: "",
    toCountry: "",
    toState: "",
    toCity: "",
    purpose: "",
    selectedAttractions: [],
    friendCity: "",
    friendContact: "",
  })

  const [showSummary, setShowSummary] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validation logic
  useEffect(() => {
    const newErrors: Record<string, string> = {}

    // Date validation
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.endDate) newErrors.endDate = "End date is required"
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date"
    }

    // Route validation
    if (!formData.fromCountry) newErrors.fromCountry = "Origin country is required"
    if (!formData.fromState) newErrors.fromState = "Origin state is required"
    if (!formData.fromCity) newErrors.fromCity = "Origin city is required"
    if (!formData.toCountry) newErrors.toCountry = "Destination country is required"
    if (!formData.toState) newErrors.toState = "Destination state is required"
    if (!formData.toCity) newErrors.toCity = "Destination city is required"

    // Purpose validation (only when destination state is selected)
    if (formData.toState && !formData.purpose) {
      newErrors.purpose = "Please select your purpose for visiting"
    }

    // Purpose-specific validation
    if (formData.purpose === "famous-places" && formData.selectedAttractions.length === 0) {
      newErrors.attractions = "Please select at least one attraction"
    }
    if (formData.purpose === "visiting-friends") {
      if (!formData.friendCity) newErrors.friendCity = "Friend's city is required"
      if (!formData.friendContact) newErrors.friendContact = "Friend's contact is required"
    }

    setErrors(newErrors)
    const isValid =
      Object.keys(newErrors).length === 0 &&
      formData.startDate &&
      formData.endDate &&
      formData.fromCountry &&
      formData.fromState &&
      formData.fromCity &&
      formData.toCountry &&
      formData.toState &&
      formData.toCity &&
      formData.purpose &&
      (formData.purpose === "famous-places"
        ? formData.selectedAttractions.length > 0
        : formData.purpose === "visiting-friends"
          ? formData.friendCity && formData.friendContact
          : false)

    onValidationChange(isValid)
  }, [formData, onValidationChange])

  const handleInputChange = (field: keyof ItineraryFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Reset dependent fields when parent changes
    if (field === "fromCountry") {
      setFormData((prev) => ({ ...prev, fromState: "", fromCity: "" }))
    }
    if (field === "fromState") {
      setFormData((prev) => ({ ...prev, fromCity: "" }))
    }
    if (field === "toCountry") {
      setFormData((prev) => ({
        ...prev,
        toState: "",
        toCity: "",
        purpose: "",
        selectedAttractions: [],
        friendCity: "",
        friendContact: "",
      }))
    }
    if (field === "toState") {
      setFormData((prev) => ({
        ...prev,
        toCity: "",
        purpose: "",
        selectedAttractions: [],
        friendCity: "",
        friendContact: "",
      }))
    }
    if (field === "purpose") {
      setFormData((prev) => ({ ...prev, selectedAttractions: [], friendCity: "", friendContact: "" }))
    }
  }

  const handleAttractionToggle = (attraction: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedAttractions: prev.selectedAttractions.includes(attraction)
        ? prev.selectedAttractions.filter((a) => a !== attraction)
        : [...prev.selectedAttractions, attraction],
    }))
  }

  const handleSubmit = () => {
    if (Object.keys(errors).length === 0) {
      setShowSummary(true)
    }
  }

  const handleConfirm = () => {
    onSubmit(formData)
  }

  if (showSummary) {
    return (
      <Card className="bg-background/20 backdrop-blur-md border-border/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Trip Summary
          </CardTitle>
          <CardDescription>Please review your itinerary details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">Travel Dates:</span>
              <span>
                {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Route:</span>
              <span>
                {formData.fromCity}, {formData.fromState}, {formData.fromCountry} → {formData.toCity},{" "}
                {formData.toState}, {formData.toCountry}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">Purpose:</span>
              <Badge variant="outline">
                {formData.purpose === "famous-places" ? "Famous Places to Visit" : "Visiting Friends"}
              </Badge>
            </div>

            {formData.purpose === "famous-places" && (
              <div className="space-y-2">
                <span className="font-medium">Selected Attractions:</span>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedAttractions.map((attraction) => (
                    <Badge key={attraction} variant="secondary">
                      {attraction}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {formData.purpose === "visiting-friends" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">Friend's City:</span>
                  <span>{formData.friendCity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">Friend's Contact:</span>
                  <span>{formData.friendContact}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowSummary(false)}>
              Edit Details
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Confirm Itinerary
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background/20 backdrop-blur-md border-border/30 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Itinerary Plan
        </CardTitle>
        <CardDescription>Plan your trip with structured details for better safety analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trip Dates */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <Label className="text-base font-medium">Trip Dates</Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
            </div>
          </div>
        </div>

        {/* Route Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <Label className="text-base font-medium">Route</Label>
          </div>

          {/* Origin */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">From (Origin)</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="fromCountry">Country</Label>
                <Select value={formData.fromCountry} onValueChange={(value) => handleInputChange("fromCountry", value)}>
                  <SelectTrigger className={errors.fromCountry ? "border-red-500" : ""}>
                    <SelectValue placeholder="Choose country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fromCountry && <p className="text-xs text-red-500">{errors.fromCountry}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromState">State</Label>
                <Select
                  value={formData.fromState}
                  onValueChange={(value) => handleInputChange("fromState", value)}
                  disabled={!formData.fromCountry}
                >
                  <SelectTrigger className={errors.fromState ? "border-red-500" : ""}>
                    <SelectValue placeholder="Choose state" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.fromCountry &&
                      STATES[formData.fromCountry]?.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.fromState && <p className="text-xs text-red-500">{errors.fromState}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromCity">City</Label>
                <Select
                  value={formData.fromCity}
                  onValueChange={(value) => handleInputChange("fromCity", value)}
                  disabled={!formData.fromState}
                >
                  <SelectTrigger className={errors.fromCity ? "border-red-500" : ""}>
                    <SelectValue placeholder="Choose city" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.fromState &&
                      CITIES[formData.fromState]?.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.fromCity && <p className="text-xs text-red-500">{errors.fromCity}</p>}
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">To (Destination)</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="toCountry">Country</Label>
                <Select value={formData.toCountry} onValueChange={(value) => handleInputChange("toCountry", value)}>
                  <SelectTrigger className={errors.toCountry ? "border-red-500" : ""}>
                    <SelectValue placeholder="Choose country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.toCountry && <p className="text-xs text-red-500">{errors.toCountry}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="toState">State</Label>
                <Select
                  value={formData.toState}
                  onValueChange={(value) => handleInputChange("toState", value)}
                  disabled={!formData.toCountry}
                >
                  <SelectTrigger className={errors.toState ? "border-red-500" : ""}>
                    <SelectValue placeholder="Choose state" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.toCountry &&
                      STATES[formData.toCountry]?.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.toState && <p className="text-xs text-red-500">{errors.toState}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="toCity">City</Label>
                <Select
                  value={formData.toCity}
                  onValueChange={(value) => handleInputChange("toCity", value)}
                  disabled={!formData.toState}
                >
                  <SelectTrigger className={errors.toCity ? "border-red-500" : ""}>
                    <SelectValue placeholder="Choose city" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.toState &&
                      CITIES[formData.toState]?.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.toCity && <p className="text-xs text-red-500">{errors.toCity}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Purpose Selection (shown when destination state is selected) */}
        {formData.toState && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <Label className="text-base font-medium">Purpose of Visit</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange("purpose", "famous-places")}
                className={`p-4 border-2 rounded-lg transition-colors text-left ${
                  formData.purpose === "famous-places"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Star className="h-5 w-5 mb-2 text-primary" />
                <div className="font-medium">Famous Places to Visit</div>
                <div className="text-xs text-muted-foreground">Explore popular attractions</div>
              </button>

              <button
                type="button"
                onClick={() => handleInputChange("purpose", "visiting-friends")}
                className={`p-4 border-2 rounded-lg transition-colors text-left ${
                  formData.purpose === "visiting-friends"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Users className="h-5 w-5 mb-2 text-primary" />
                <div className="font-medium">Visiting Friends</div>
                <div className="text-xs text-muted-foreground">Meet friends or family</div>
              </button>
            </div>
            {errors.purpose && <p className="text-xs text-red-500">{errors.purpose}</p>}
          </div>
        )}

        {/* Famous Places Selection */}
        {formData.purpose === "famous-places" && formData.toState && ATTRACTIONS[formData.toState] && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Attractions to Visit</Label>
            <div className="grid grid-cols-2 gap-3">
              {ATTRACTIONS[formData.toState].map((attraction) => (
                <div key={attraction} className="flex items-center space-x-2">
                  <Checkbox
                    id={attraction}
                    checked={formData.selectedAttractions.includes(attraction)}
                    onCheckedChange={() => handleAttractionToggle(attraction)}
                  />
                  <Label htmlFor={attraction} className="text-sm cursor-pointer">
                    {attraction}
                  </Label>
                </div>
              ))}
            </div>
            {errors.attractions && <p className="text-xs text-red-500">{errors.attractions}</p>}
          </div>
        )}

        {/* Visiting Friends Details */}
        {formData.purpose === "visiting-friends" && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Friend's Details</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="friendCity">Friend's City</Label>
                <Input
                  id="friendCity"
                  value={formData.friendCity}
                  onChange={(e) => handleInputChange("friendCity", e.target.value)}
                  placeholder="Enter friend's city"
                  className={errors.friendCity ? "border-red-500" : ""}
                />
                {errors.friendCity && <p className="text-xs text-red-500">{errors.friendCity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="friendContact">Friend's Contact</Label>
                <Input
                  id="friendContact"
                  value={formData.friendContact}
                  onChange={(e) => handleInputChange("friendContact", e.target.value)}
                  placeholder="Phone or email"
                  className={errors.friendContact ? "border-red-500" : ""}
                />
                {errors.friendContact && <p className="text-xs text-red-500">{errors.friendContact}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit} disabled={Object.keys(errors).length > 0} size="lg">
            Review Itinerary
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
