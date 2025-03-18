"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Calculator() {
  const [display, setDisplay] = useState("0")
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)

  // Financial calculator states
  const [principal, setPrincipal] = useState("")
  const [rate, setRate] = useState("")
  const [time, setTime] = useState("")
  const [result, setResult] = useState<number | null>(null)

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit)
      setWaitingForSecondOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.")
      setWaitingForSecondOperand(false)
      return
    }

    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clearDisplay = () => {
    setDisplay("0")
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const handleOperator = (nextOperator: string) => {
    const inputValue = Number.parseFloat(display)

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = performCalculation()
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setWaitingForSecondOperand(true)
    setOperator(nextOperator)
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (operator === "+") {
      return firstOperand! + inputValue
    } else if (operator === "-") {
      return firstOperand! - inputValue
    } else if (operator === "*") {
      return firstOperand! * inputValue
    } else if (operator === "/") {
      return firstOperand! / inputValue
    }

    return inputValue
  }

  const handleEquals = () => {
    if (!operator || firstOperand === null) return

    const result = performCalculation()
    setDisplay(String(result))
    setFirstOperand(result)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const calculateCompoundInterest = () => {
    const p = Number.parseFloat(principal)
    const r = Number.parseFloat(rate) / 100
    const t = Number.parseFloat(time)

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      setResult(null)
      return
    }

    const amount = p * Math.pow(1 + r, t)
    setResult(amount)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Financial Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="rounded-md bg-secondary p-4 text-right text-2xl font-bold">{display}</div>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" onClick={clearDisplay}>
                  C
                </Button>
                <Button variant="outline" onClick={() => setDisplay(String(Number.parseFloat(display) * -1))}>
                  +/-
                </Button>
                <Button variant="outline" onClick={() => setDisplay(String(Number.parseFloat(display) / 100))}>
                  %
                </Button>
                <Button variant="secondary" onClick={() => handleOperator("/")}>
                  ÷
                </Button>

                <Button variant="outline" onClick={() => inputDigit("7")}>
                  7
                </Button>
                <Button variant="outline" onClick={() => inputDigit("8")}>
                  8
                </Button>
                <Button variant="outline" onClick={() => inputDigit("9")}>
                  9
                </Button>
                <Button variant="secondary" onClick={() => handleOperator("*")}>
                  ×
                </Button>

                <Button variant="outline" onClick={() => inputDigit("4")}>
                  4
                </Button>
                <Button variant="outline" onClick={() => inputDigit("5")}>
                  5
                </Button>
                <Button variant="outline" onClick={() => inputDigit("6")}>
                  6
                </Button>
                <Button variant="secondary" onClick={() => handleOperator("-")}>
                  -
                </Button>

                <Button variant="outline" onClick={() => inputDigit("1")}>
                  1
                </Button>
                <Button variant="outline" onClick={() => inputDigit("2")}>
                  2
                </Button>
                <Button variant="outline" onClick={() => inputDigit("3")}>
                  3
                </Button>
                <Button variant="secondary" onClick={() => handleOperator("+")}>
                  +
                </Button>

                <Button variant="outline" onClick={() => inputDigit("0")} className="col-span-2">
                  0
                </Button>
                <Button variant="outline" onClick={inputDecimal}>
                  .
                </Button>
                <Button variant="primary" onClick={handleEquals}>
                  =
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="financial" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="principal">Principal Amount</Label>
                  <Input
                    id="principal"
                    placeholder="Enter principal amount"
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rate">Interest Rate (%)</Label>
                  <Input
                    id="rate"
                    placeholder="Enter interest rate"
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time Period (years)</Label>
                  <Input
                    id="time"
                    placeholder="Enter time period"
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={calculateCompoundInterest} className="w-full">
                Calculate Compound Interest
              </Button>
              {result !== null && (
                <div className="rounded-md bg-secondary p-4 text-center">
                  <p className="text-sm text-muted-foreground">Final Amount</p>
                  <p className="text-2xl font-bold">${result.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Interest: ${(result - Number.parseFloat(principal)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

