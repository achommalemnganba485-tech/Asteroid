"use client"

import { useState, useEffect } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Users } from "lucide-react"
import { ItineraryPlanForm } from "@/components/itinerary/itinerary-plan-form"

interface Step2Props {
  onValidationChange: (isValid: boolean) => void
  onNext: () => void
  onBack: () => void
  isValid: boolean
  currentStep: number
}

export function OnboardingStep2({ onValidationChange, onNext, onBack }: Step2Props) {
  const { contacts, addContact, updateContact, setItinerary } = useSafeTrekStore()
  const [localContacts, setLocalContacts] = useState(
    contacts.length > 0 ? contacts : [{ name: "", relation: "", phone: "" }],
  )
  const [itineraryCompleted, setItineraryCompleted] = useState(false)
  const [contactsValid, setContactsValid] = useState(false)

  useEffect(() => {
    const contactsAreValid =
      localContacts.length > 0 &&
      localContacts.every(
        (contact) =>
          contact.name.trim().length > 0 && contact.relation.trim().length > 0 && contact.phone.trim().length > 0,
      )

    setContactsValid(contactsAreValid)
    onValidationChange(itineraryCompleted && contactsAreValid)
  }, [localContacts, itineraryCompleted, onValidationChange])

  const handleContactChange = (index: number, field: string, value: string) => {
    const updated = localContacts.map((contact, i) => (i === index ? { ...contact, [field]: value } : contact))
    setLocalContacts(updated)
  }

  const addNewContact = () => {
    if (localContacts.length < 3) {
      setLocalContacts([...localContacts, { name: "", relation: "", phone: "" }])
    }
  }

  const removeContact = (index: number) => {
    if (localContacts.length > 1) {
      setLocalContacts(localContacts.filter((_, i) => i !== index))
    }
  }

  const handleItinerarySubmit = (itineraryData: any) => {
    const itineraryText = `
Trip Dates: ${new Date(itineraryData.startDate).toLocaleDateString()} - ${new Date(itineraryData.endDate).toLocaleDateString()}
Route: ${itineraryData.fromCity}, ${itineraryData.fromState}, ${itineraryData.fromCountry} → ${itineraryData.toCity}, ${itineraryData.toState}, ${itineraryData.toCountry}
Purpose: ${itineraryData.purpose === "famous-places" ? "Famous Places to Visit" : "Visiting Friends"}
${itineraryData.purpose === "famous-places" ? `Attractions: ${itineraryData.selectedAttractions.join(", ")}` : ""}
${itineraryData.purpose === "visiting-friends" ? `Friend's City: ${itineraryData.friendCity}\nFriend's Contact: ${itineraryData.friendContact}` : ""}
    `.trim()

    setItinerary(itineraryText)
    setItineraryCompleted(true)
  }

  const handleNext = () => {
    // Save contacts to store
    localContacts.forEach((contact, index) => {
      if (index < contacts.length) {
        updateContact(index, contact)
      } else {
        addContact(contact)
      }
    })
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Itinerary Plan Form */}
      {!itineraryCompleted ? (
        <ItineraryPlanForm
          onSubmit={handleItinerarySubmit}
          onValidationChange={() => {}} // Handled internally
        />
      ) : (
        <Card className="bg-background/20 backdrop-blur-md border-border/30 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="success">✓</Badge>
                <span className="font-medium">Itinerary Plan Completed</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setItineraryCompleted(false)}>
                Edit Itinerary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Contacts */}
      <Card className="bg-background/20 backdrop-blur-md border-border/30 shadow-xl">
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>Add people to contact in case of emergency during your trip.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <Label>Emergency Contacts</Label>
            </div>
            {localContacts.length < 3 && (
              <Button type="button" variant="outline" size="sm" onClick={addNewContact}>
                <Plus className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
            )}
          </div>

          {localContacts.map((contact, index) => (
            <Card key={index} className="p-4 bg-background/20 backdrop-blur-sm border-border/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">
                  Contact {index + 1}
                  {index === 0 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Primary
                    </Badge>
                  )}
                </h4>
                {localContacts.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeContact(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-3">
                <div className="space-y-1">
                  <Label htmlFor={`contact-name-${index}`}>Full Name</Label>
                  <Input
                    id={`contact-name-${index}`}
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, "name", e.target.value)}
                    placeholder="Enter contact's full name"
                    className="focus-ring"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`contact-relation-${index}`}>Relationship</Label>
                  <Input
                    id={`contact-relation-${index}`}
                    value={contact.relation}
                    onChange={(e) => handleContactChange(index, "relation", e.target.value)}
                    placeholder="e.g., Spouse, Parent, Friend"
                    className="focus-ring"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`contact-phone-${index}`}>Phone Number</Label>
                  <Input
                    id={`contact-phone-${index}`}
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="focus-ring"
                  />
                </div>
              </div>
            </Card>
          ))}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!itineraryCompleted || !contactsValid} size="lg">
              Continue to Permissions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
