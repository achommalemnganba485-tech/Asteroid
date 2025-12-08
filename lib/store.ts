import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  name: string
  email: string
  phone: string
  docType: "Passport" | "Aadhaar" | ""
  onboardingDone: boolean
}

export interface Contact {
  name: string
  relation: string
  phone: string
}

export interface Alert {
  id: string
  time: string
  source: "AI" | "Community"
  severity: "green" | "amber" | "red"
  text: string
  title: string
}

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface VaultItem {
  id: string
  name: string
  size: number
  date: string
  type: string
}

export interface ActivityLog {
  id: string
  type: string
  time: string
  hash: string
  meta?: Record<string, any>
}

export interface UISettings {
  language: string
  contrast: "normal" | "high"
  textScale: "md" | "lg" | "xl"
  theme: "light" | "dark"
}

export interface AISettings {
  weather: boolean
  unrest: boolean
  health: boolean
}

interface SafeTrekStore {
  // User & Auth
  currentUser: User
  contacts: Contact[]
  itineraryText: string
  permissions: {
    location: boolean
    notifications: boolean
    terms: boolean
  }
  isAdvanced: boolean

  // Features
  alerts: Alert[]
  checklists: Record<string, ChecklistItem[]>
  vault: VaultItem[]
  aiSettings: AISettings
  activity: ActivityLog[]
  ui: UISettings

  // Actions
  setUser: (user: Partial<User>) => void
  addContact: (contact: Contact) => void
  updateContact: (index: number, contact: Contact) => void
  setItinerary: (text: string) => void
  setPermissions: (permissions: Partial<SafeTrekStore["permissions"]>) => void
  setAdvanced: (isAdvanced: boolean) => void
  addAlert: (alert: Omit<Alert, "id">) => void
  updateChecklist: (category: string, items: ChecklistItem[]) => void
  addVaultItem: (item: Omit<VaultItem, "id">) => void
  removeVaultItem: (id: string) => void
  updateAISettings: (settings: Partial<AISettings>) => void
  addActivity: (activity: Omit<ActivityLog, "id" | "hash">) => void
  updateUI: (settings: Partial<UISettings>) => void
  logout: () => void
  calculateTouristSafetyScore: () => number
}

export const useSafeTrekStore = create<SafeTrekStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: {
        name: "",
        email: "",
        phone: "",
        docType: "",
        onboardingDone: false,
      },
      contacts: [],
      itineraryText: "",
      permissions: {
        location: false,
        notifications: false,
        terms: false,
      },
      isAdvanced: true,
      alerts: [],
      checklists: {
        "pre-flight": [
          { id: "1", text: "Check passport validity (6+ months)", done: false },
          { id: "2", text: "Verify visa requirements", done: false },
          { id: "3", text: "Purchase travel insurance", done: false },
          { id: "4", text: "Notify bank of travel plans", done: false },
        ],
        "hotel-safety": [
          { id: "1", text: "Check emergency exits location", done: false },
          { id: "2", text: "Test room locks and security", done: false },
          { id: "3", text: "Store valuables in hotel safe", done: false },
          { id: "4", text: "Share room details with emergency contact", done: false },
        ],
        "day-trip": [
          { id: "1", text: "Check weather conditions", done: false },
          { id: "2", text: "Plan return route and timing", done: false },
          { id: "3", text: "Carry emergency contact info", done: false },
          { id: "4", text: "Inform someone of your plans", done: false },
        ],
      },
      vault: [],
      aiSettings: {
        weather: true,
        unrest: true,
        health: true,
      },
      activity: [],
      ui: {
        language: "en",
        contrast: "normal",
        textScale: "md",
        theme: "light",
      },

      // Actions
      setUser: (user) =>
        set((state) => ({
          currentUser: { ...state.currentUser, ...user },
        })),

      addContact: (contact) =>
        set((state) => ({
          contacts: [...state.contacts, contact],
        })),

      updateContact: (index, contact) =>
        set((state) => ({
          contacts: state.contacts.map((c, i) => (i === index ? contact : c)),
        })),

      setItinerary: (text) => set({ itineraryText: text }),

      setPermissions: (permissions) =>
        set((state) => ({
          permissions: { ...state.permissions, ...permissions },
        })),

      setAdvanced: (isAdvanced) => set({ isAdvanced }),

      addAlert: (alert) =>
        set((state) => ({
          alerts: [{ ...alert, id: Date.now().toString() }, ...state.alerts],
        })),

      updateChecklist: (category, items) =>
        set((state) => ({
          checklists: { ...state.checklists, [category]: items },
        })),

      addVaultItem: (item) =>
        set((state) => ({
          vault: [...state.vault, { ...item, id: Date.now().toString() }],
        })),

      removeVaultItem: (id) =>
        set((state) => ({
          vault: state.vault.filter((item) => item.id !== id),
        })),

      updateAISettings: (settings) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, ...settings },
        })),

      addActivity: (activity) => {
        const hash = `sha256:${Math.random().toString(36).substring(2, 15)}`
        set((state) => ({
          activity: [{ ...activity, id: Date.now().toString(), hash }, ...state.activity],
        }))
      },

      updateUI: (settings) =>
        set((state) => ({
          ui: { ...state.ui, ...settings },
        })),

      logout: () =>
        set({
          currentUser: {
            name: "",
            email: "",
            phone: "",
            docType: "",
            onboardingDone: false,
          },
          contacts: [],
          itineraryText: "",
          permissions: {
            location: false,
            notifications: false,
            terms: false,
          },
          isAdvanced: true,
          alerts: [],
          vault: [],
          activity: [],
        }),

      calculateTouristSafetyScore: () => {
        const state = get()
        let baseScore = 85 // Base safety score

        // Adjust based on itinerary complexity
        if (state.itineraryText) {
          const itineraryLines = state.itineraryText.split("\n").filter((line) => line.trim())
          if (itineraryLines.length > 10) baseScore -= 5 // Complex itinerary
          if (itineraryLines.length < 3) baseScore += 5 // Simple itinerary
        }

        // Adjust based on emergency contacts
        if (state.contacts.length === 0) baseScore -= 10
        else if (state.contacts.length >= 3) baseScore += 5

        // Adjust based on document preparation
        if (state.currentUser.docType) baseScore += 5

        // Adjust based on active alerts
        const highRiskAlerts = state.alerts.filter((alert) => alert.severity === "red").length
        const mediumRiskAlerts = state.alerts.filter((alert) => alert.severity === "amber").length
        baseScore -= highRiskAlerts * 10 + mediumRiskAlerts * 5

        // Adjust based on safety checklist completion
        const allChecklists = Object.values(state.checklists).flat()
        const completedItems = allChecklists.filter((item) => item.done).length
        const completionRate = allChecklists.length > 0 ? completedItems / allChecklists.length : 0
        baseScore += Math.floor(completionRate * 10)

        // Ensure score stays within bounds
        return Math.max(45, Math.min(95, baseScore))
      },
    }),
    {
      name: "safetrek-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
        contacts: state.contacts,
        itineraryText: state.itineraryText,
        permissions: state.permissions,
        isAdvanced: state.isAdvanced,
        checklists: state.checklists,
        vault: state.vault,
        aiSettings: state.aiSettings,
        activity: state.activity,
        ui: state.ui,
      }),
    },
  ),
)

export const useStore = useSafeTrekStore
