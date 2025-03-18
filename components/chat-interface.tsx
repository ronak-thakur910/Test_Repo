"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendIcon, Trash2Icon } from "lucide-react"
import { sendChatMessage } from "@/lib/actions"
import type { ChatMessage } from "@/lib/types"

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatHistory", JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [scrollAreaRef]) //Corrected dependency

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendChatMessage(input)

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Financial Assistant</h2>
        <Button variant="outline" size="sm" onClick={clearChat}>
          <Trash2Icon className="mr-2 h-4 w-4" />
          Clear Chat
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <svg
                className="h-10 w-10 text-primary"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="16" />
                <line x1="8" x2="16" y1="12" y2="12" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Start a conversation</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask me anything about your finances, investments, or financial planning.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="mt-1 text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-primary"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-primary"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            placeholder="Ask about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </Card>
  )
}

