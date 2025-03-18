"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "@/components/chat-interface"
import { Calculator } from "@/components/calculator"
import { TodoList } from "@/components/todo-list"
import { Reminders } from "@/components/reminders"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-hidden p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="todo">Todo List</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="h-[calc(100%-48px)]">
              <ChatInterface />
            </TabsContent>
            <TabsContent value="calculator" className="h-[calc(100%-48px)]">
              <Calculator />
            </TabsContent>
            <TabsContent value="todo" className="h-[calc(100%-48px)]">
              <TodoList />
            </TabsContent>
            <TabsContent value="reminders" className="h-[calc(100%-48px)]">
              <Reminders />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

