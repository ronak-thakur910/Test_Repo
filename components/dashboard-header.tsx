"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { UserButton } from "@/components/user-button"
import { BellIcon } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">FinanceAI Assistant</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <BellIcon className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  )
}

