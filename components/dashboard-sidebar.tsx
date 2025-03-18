"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  BarChart3Icon,
  CalculatorIcon,
  CalendarIcon,
  CheckSquareIcon,
  ClockIcon,
  HelpCircleIcon,
  MessageSquareIcon,
  PieChartIcon,
  SettingsIcon,
} from "lucide-react"

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  const sidebarItems = [
    {
      id: "chat",
      label: "AI Chat",
      icon: MessageSquareIcon,
    },
    {
      id: "calculator",
      label: "Calculator",
      icon: CalculatorIcon,
    },
    {
      id: "todo",
      label: "Todo List",
      icon: CheckSquareIcon,
    },
    {
      id: "reminders",
      label: "Reminders",
      icon: ClockIcon,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3Icon,
      disabled: true,
    },
    {
      id: "investments",
      label: "Investments",
      icon: PieChartIcon,
      disabled: true,
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: CalendarIcon,
      disabled: true,
    },
  ]

  const bottomItems = [
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircleIcon,
    },
  ]

  return (
    <aside className="border-r bg-card w-64 hidden md:flex md:flex-col">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-primary">Dashboard</h2>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn("w-full justify-start", item.disabled && "opacity-50 cursor-not-allowed")}
              onClick={() => !item.disabled && setActiveTab(item.id)}
              disabled={item.disabled}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-2">
        {bottomItems.map((item) => (
          <Button key={item.id} variant="ghost" className="w-full justify-start" onClick={() => {}}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </aside>
  )
}

