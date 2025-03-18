"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BellIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Reminder {
  id: string
  title: string
  date: string
  time: string
  category: string
  completed: boolean
}

export function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("reminders")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [category, setCategory] = useState("bill")
  const [filter, setFilter] = useState("upcoming")

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("reminders", JSON.stringify(reminders))
    }
  }, [reminders])

  useEffect(() => {
    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission()
    }

    // Check for due reminders every minute
    const interval = setInterval(checkReminders, 60000)
    return () => clearInterval(interval)
  }, [])

  const checkReminders = () => {
    const now = new Date()

    reminders.forEach((reminder) => {
      if (reminder.completed) return

      const reminderDate = new Date(`${reminder.date}T${reminder.time}`)
      const timeDiff = reminderDate.getTime() - now.getTime()

      // If reminder is due within the next minute
      if (timeDiff > 0 && timeDiff <= 60000) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Financial Reminder: ${reminder.title}`, {
            body: `Your ${reminder.category} reminder is due now.`,
            icon: "/placeholder.svg?height=64&width=64",
          })
        }
      }
    })
  }

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date || !time) return

    const newReminder: Reminder = {
      id: Date.now().toString(),
      title,
      date,
      time,
      category,
      completed: false,
    }

    setReminders([...reminders, newReminder])
    setTitle("")
    setDate("")
    setTime("")
  }

  const toggleReminder = (id: string) => {
    setReminders(
      reminders.map((reminder) => (reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder)),
    )
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))
  }

  const filteredReminders = reminders.filter((reminder) => {
    const now = new Date()
    const reminderDate = new Date(`${reminder.date}T${reminder.time}`)

    if (filter === "all") return true
    if (filter === "upcoming") return reminderDate > now && !reminder.completed
    if (filter === "completed") return reminder.completed
    if (filter === "overdue") return reminderDate < now && !reminder.completed
    return true
  })

  // Sort reminders by date and time
  filteredReminders.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Financial Reminders</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reminders</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={addReminder} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Reminder Title</Label>
            <Input
              id="title"
              placeholder="Pay credit card bill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bill">Bill Payment</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="tax">Tax Deadline</SelectItem>
                <SelectItem value="budget">Budget Review</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Reminder
          </Button>
        </form>
        <ScrollArea className="h-[calc(100vh-500px)]">
          <div className="space-y-2">
            {filteredReminders.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No reminders yet. Add one above!</p>
            ) : (
              filteredReminders.map((reminder) => {
                const reminderDate = new Date(`${reminder.date}T${reminder.time}`)
                const now = new Date()
                const isOverdue = reminderDate < now && !reminder.completed

                return (
                  <div
                    key={reminder.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      isOverdue ? "border-destructive" : ""
                    } ${reminder.completed ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={reminder.completed ? "outline" : "default"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleReminder(reminder.id)}
                      >
                        <BellIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle reminder</span>
                      </Button>
                      <div>
                        <p className={`font-medium ${reminder.completed ? "line-through text-muted-foreground" : ""}`}>
                          {reminder.title}
                        </p>
                        <div className="flex space-x-2 text-xs text-muted-foreground">
                          <span>{new Date(`${reminder.date}T${reminder.time}`).toLocaleString()}</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-secondary">{reminder.category}</span>
                          {isOverdue && (
                            <span className="px-1.5 py-0.5 rounded-full bg-destructive/20 text-destructive">
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteReminder(reminder.id)}>
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

