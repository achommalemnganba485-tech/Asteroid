"use client"

import { useState } from "react"
import { useSafeTrekStore } from "@/lib/store"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckSquare, Plus, Plane, Building, MapPin, Trash2, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ChecklistsPage() {
  const { checklists, updateChecklist, addActivity } = useSafeTrekStore()
  const { toast } = useToast()
  const [newItemText, setNewItemText] = useState("")
  const [activeCategory, setActiveCategory] = useState("pre-flight")

  const checklistCategories = [
    {
      key: "pre-flight",
      title: "Pre-Flight Checklist",
      description: "Essential preparations before your trip",
      icon: Plane,
      color: "text-blue-600",
    },
    {
      key: "hotel-safety",
      title: "Hotel Safety",
      description: "Safety checks when staying at accommodations",
      icon: Building,
      color: "text-green-600",
    },
    {
      key: "day-trip",
      title: "Day Trip Safety",
      description: "Daily safety preparations and checks",
      icon: MapPin,
      color: "text-purple-600",
    },
  ]

  const getProgress = (categoryKey: string) => {
    const items = checklists[categoryKey] || []
    if (items.length === 0) return 0
    const completed = items.filter((item) => item.done).length
    return Math.round((completed / items.length) * 100)
  }

  const handleToggleItem = (categoryKey: string, itemId: string) => {
    const items = checklists[categoryKey] || []
    const updatedItems = items.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item))

    updateChecklist(categoryKey, updatedItems)

    const item = items.find((i) => i.id === itemId)
    if (item) {
      addActivity({
        type: item.done ? "CHECKLIST_UNCHECKED" : "CHECKLIST_CHECKED",
        time: new Date().toISOString(),
        meta: {
          category: categoryKey,
          item: item.text,
        },
      })
    }
  }

  const handleAddItem = (categoryKey: string) => {
    if (!newItemText.trim()) return

    const items = checklists[categoryKey] || []
    const newItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      done: false,
    }

    updateChecklist(categoryKey, [...items, newItem])

    addActivity({
      type: "CHECKLIST_ITEM_ADDED",
      time: new Date().toISOString(),
      meta: {
        category: categoryKey,
        item: newItem.text,
      },
    })

    setNewItemText("")
    toast({
      title: "Item added",
      description: `Added "${newItem.text}" to your checklist.`,
    })
  }

  const handleDeleteItem = (categoryKey: string, itemId: string) => {
    const items = checklists[categoryKey] || []
    const item = items.find((i) => i.id === itemId)
    const updatedItems = items.filter((item) => item.id !== itemId)

    updateChecklist(categoryKey, updatedItems)

    if (item) {
      addActivity({
        type: "CHECKLIST_ITEM_DELETED",
        time: new Date().toISOString(),
        meta: {
          category: categoryKey,
          item: item.text,
        },
      })
    }

    toast({
      title: "Item removed",
      description: "Checklist item has been deleted.",
    })
  }

  const handleResetChecklist = (categoryKey: string) => {
    const items = checklists[categoryKey] || []
    const resetItems = items.map((item) => ({ ...item, done: false }))

    updateChecklist(categoryKey, resetItems)

    addActivity({
      type: "CHECKLIST_RESET",
      time: new Date().toISOString(),
      meta: { category: categoryKey },
    })

    toast({
      title: "Checklist reset",
      description: "All items have been unchecked.",
    })
  }

  const handleMarkAllComplete = (categoryKey: string) => {
    const items = checklists[categoryKey] || []
    const completedItems = items.map((item) => ({ ...item, done: true }))

    updateChecklist(categoryKey, completedItems)

    addActivity({
      type: "CHECKLIST_COMPLETED",
      time: new Date().toISOString(),
      meta: { category: categoryKey },
    })

    toast({
      title: "Checklist completed!",
      description: "All items have been marked as done. Stay safe!",
    })
  }

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CheckSquare className="h-8 w-8 text-primary" />
              Safety Checklists
            </h1>
            <p className="text-muted-foreground">Stay organized and safe with comprehensive travel checklists</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {checklistCategories.map((category) => {
            const progress = getProgress(category.key)
            const items = checklists[category.key] || []
            const completedItems = items.filter((item) => item.done).length

            return (
              <Card key={category.key} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <category.icon className={`h-8 w-8 ${category.color}`} />
                    <Badge variant={progress === 100 ? "success" : "secondary"}>
                      {completedItems}/{items.length}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed Checklists */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-3">
            {checklistCategories.map((category) => (
              <TabsTrigger key={category.key} value={category.key} className="flex items-center gap-2">
                <category.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {checklistCategories.map((category) => (
            <TabsContent key={category.key} value={category.key}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <category.icon className={`h-5 w-5 ${category.color}`} />
                        {category.title}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetChecklist(category.key)}
                        disabled={checklists[category.key]?.every((item) => !item.done)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAllComplete(category.key)}
                        disabled={checklists[category.key]?.every((item) => item.done)}
                      >
                        Mark All Done
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Progress</span>
                      <span>{getProgress(category.key)}%</span>
                    </div>
                    <Progress value={getProgress(category.key)} className="h-2" />
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-3">
                    {(checklists[category.key] || []).map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                          item.done ? "bg-green-50 dark:bg-green-950/20 border-green-200" : "hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          id={item.id}
                          checked={item.done}
                          onCheckedChange={() => handleToggleItem(category.key, item.id)}
                        />
                        <div className="flex w-full items-center justify-between gap-3">
                          <label
                            htmlFor={item.id}
                            className={`flex-1 cursor-pointer text-sm ${item.done ? "text-muted-foreground" : ""}`}
                          >
                            {item.text}
                          </label>
                          {item.done && (
                            <Badge
                              variant="outline"
                              className="text-[10px] border-green-200 bg-green-100 text-green-700"
                            >
                              Completed
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(category.key, item.id)}
                          className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Item */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Input
                      placeholder="Add a new checklist item..."
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddItem(category.key)}
                      className="flex-1"
                    />
                    <Button onClick={() => handleAddItem(category.key)} disabled={!newItemText.trim()} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppShell>
  )
}
