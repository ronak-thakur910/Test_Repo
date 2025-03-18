"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusIcon, TrashIcon } from "lucide-react"

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [input, setInput] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [category, setCategory] = useState("finance")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(todos))
    }
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      priority,
      category,
    }

    setTodos([...todos, newTodo])
    setInput("")
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true
    if (filter === "completed") return todo.completed
    if (filter === "active") return !todo.completed
    return true
  })

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Financial Tasks</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={addTodo} className="flex space-x-2">
          <Input
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Add</span>
          </Button>
        </form>
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="space-y-2">
            {filteredTodos.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No tasks yet. Add one above!</p>
            ) : (
              filteredTodos.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      id={`todo-${todo.id}`}
                    />
                    <div>
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {todo.text}
                      </label>
                      <div className="flex space-x-2 text-xs text-muted-foreground">
                        <span
                          className={`px-1.5 py-0.5 rounded-full ${
                            todo.priority === "high"
                              ? "bg-destructive/20 text-destructive"
                              : todo.priority === "medium"
                                ? "bg-amber-500/20 text-amber-500"
                                : "bg-green-500/20 text-green-500"
                          }`}
                        >
                          {todo.priority}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full bg-secondary">{todo.category}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteTodo(todo.id)}>
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

