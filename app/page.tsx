"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Send, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

// 1. Define the shape of a message
type Message = {
  id: string
  sender: 'doctor' | 'patient'
  originalText: string
  translatedText: string
  timestamp: string
  isAudio?: boolean
}

export default function MedicalTranslator() {
  // 2. The "Master List" (Shared State)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // 3. Load from LocalStorage on mount (Persistence Requirement)
  useEffect(() => {
    const saved = localStorage.getItem('medical-chat-history')
    if (saved) setMessages(JSON.parse(saved))
  }, [])

  // 4. Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('medical-chat-history', JSON.stringify(messages))
  }, [messages])

  // 5. The Send Function (Handles Translation)
  const handleSend = async (role: 'doctor' | 'patient', text: string) => {
    if (!text.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: role,
      originalText: text,
      translatedText: "Translating...", // Temporary placeholder
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Update UI immediately (Optimistic)
    setMessages(prev => [...prev, newMessage])

    try {
      // Call your API
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetRole: role === 'doctor' ? 'patient' : 'doctor' })
      })
      
      const data = await response.json()
      
      // Update with real translation
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, translatedText: data.translation } : msg
      ))
    } catch (error) {
      console.error("Translation failed", error)
    }
  }

  // 6. Audio Handler (Web Speech API)
  const startListening = (role: 'doctor' | 'patient') => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Browser does not support speech recognition. Use Chrome.")
      return
    }
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = role === 'doctor' ? 'en-US' : 'es-ES' // English or Spanish
    recognition.start()
    setIsRecording(true)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      handleSend(role, transcript)
      setIsRecording(false)
    }
    recognition.onerror = () => setIsRecording(false)
  }

  // 7. Handle Summary Generation
  const handleSummary = async () => {
    if (messages.length === 0) {
      alert("No conversation to summarize yet!")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      })
      
      const data = await response.json()
      
      if (data.summary) {
        alert("📝 CLINICAL SUMMARY:\n\n" + data.summary)
      } else {
        alert("Failed to generate summary.")
      }
    } catch (error) {
      console.error(error)
      alert("Error generating summary.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Nao Medical Translator</h1>
        </div>
        <Button variant="outline" 
          disabled={isGenerating} 
          onClick={handleSummary}
        >
          <FileText className="mr-2 h-4 w-4" /> 
          {isGenerating ? "Generating..." : "Generate Summary"}
        </Button>
      </header>

      {/* Main Split Screen */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDE: DOCTOR (Blue) */}
        <ChatPanel 
          role="doctor"
          messages={messages}
          onSend={(text) => handleSend('doctor', text)}
          onRecord={() => startListening('doctor')}
          isRecording={isRecording}
          theme="blue"
        />

        {/* RIGHT SIDE: PATIENT (Green) */}
        <ChatPanel 
          role="patient"
          messages={messages}
          onSend={(text) => handleSend('patient', text)}
          onRecord={() => startListening('patient')}
          isRecording={isRecording}
          theme="green"
        />
      </div>
    </div>
  )
}

// Reusable Component for both sides
function ChatPanel({ role, messages, onSend, onRecord, isRecording, theme }: any) {
  const [input, setInput] = useState("")
  const isDoctor = role === 'doctor'
  const bgColor = isDoctor ? 'bg-blue-50' : 'bg-green-50'
  const headerColor = isDoctor ? 'bg-blue-600' : 'bg-green-600'
  const bubbleColor = isDoctor ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'

  return (
    <div className={`flex flex-1 flex-col border-r ${bgColor}`}>
      <div className={`${headerColor} p-4 text-white shadow-md`}>
        <h2 className="font-bold text-lg">{isDoctor ? "Doctor (English)" : "Patient (Spanish)"}</h2>
        <p className="text-sm opacity-90">{isDoctor ? "Dr. Sarah Johnson" : "John Doe"}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg: Message) => {
            // LOGIC: What does this person see?
            // If I am the sender, I see my 'originalText'.
            // If I am the receiver, I see the 'translatedText'.
            const displayText = msg.sender === role ? msg.originalText : msg.translatedText
            
            return (
              <div key={msg.id} className={`flex ${msg.sender === role ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 px-4 shadow-sm ${msg.sender === role ? 'bg-white' : bubbleColor}`}>
                  <p className="text-sm font-medium">{displayText}</p>
                  <span className="mt-1 block text-xs opacity-50">{msg.timestamp}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className={isRecording ? "animate-pulse text-red-500" : ""}
            onClick={onRecord}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type a message..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSend(input)
                setInput("")
              }
            }}
          />
          <Button onClick={() => { onSend(input); setInput("") }}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}