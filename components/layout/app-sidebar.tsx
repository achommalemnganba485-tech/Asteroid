"use client"

import { useRouter, usePathname } from "next/navigation"
import { useSafeTrekStore } from "@/lib/store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Home,
  Map,
  FileText,
  CheckSquare,
  CreditCard,
  Brain,
  Route,
  MessageSquare,
  Settings,
  LogOut,
  Radio,
} from "lucide-react"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { currentUser, isAdvanced, logout } = useSafeTrekStore()

  const freeTools = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Trip Itinerary", url: "/ai/itinerary", icon: Route },
    { title: "Document Vault", url: "/vault", icon: FileText },
    { title: "Safety Checklists", url: "/checklists", icon: CheckSquare },
    { title: "Digital ID", url: "/dtid", icon: CreditCard },
    { title: "IoT Monitoring", url: "/iot", icon: Radio }, // expose IoT feature in essential tools
  ]

  const advancedFeatures = [
    { title: "AI Hazard Alerts", url: "/ai/alerts", icon: Brain },
    { title: "AI Itinerary Safety", url: "/ai/itinerary", icon: Route },
    { title: "AI Safety Assistant", url: "/ai/chat", icon: MessageSquare },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleNavigation = (url: string) => {
    router.push(url)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-bold">Asteroid</h2>
            <p className="text-xs text-muted-foreground">Stay Safe, Travel Smart</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Profile Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mx-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary to-blue-600 text-white">
                    ADVANCED
                  </Badge>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Free Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>Essential Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {freeTools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    isActive={pathname === item.url}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            Advanced Features
            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary to-blue-600 text-white">
              PILOT
            </Badge>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {advancedFeatures.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    isActive={pathname === item.url}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("/settings")}
                  isActive={pathname === "/settings"}
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button onClick={() => router.push("/advanced")} className="w-full" size="sm" variant="outline">
          <Brain className="h-4 w-4 mr-2" />
          Advanced Pilot Info
        </Button>
      </SidebarFooter>
    </Sidebar
  )
}
