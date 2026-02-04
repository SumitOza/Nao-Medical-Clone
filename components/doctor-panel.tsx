'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatBubble } from './chat-bubble'
import { Mic, Send } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'doctor' | 'patient'
  timestamp: string
}

export function DoctorPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Good morning. How are you feeling today?',
      sender: 'doctor',
      timestamp: '9:15 AM',
    },
    {
      id: '2',
      text: 'I have been experiencing some headaches and fatigue.',
      sender: 'patient',
      timestamp: '9:16 AM',
    },
  ])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input,
        sender: 'doctor',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages([...messages, newMessage])
      setInput('')
    }
  }

  const handleRecord = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate recording
      setTimeout(() => {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: '[Audio message from doctor]',
          sender: 'doctor',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages([...messages, newMessage])
        setIsRecording(false)
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col h-full bg-blue-50 border-r border-gray-200">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Doctor</h2>
        <p className="text-sm text-blue-100">Dr. Sarah Johnson</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg.text}
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRecord}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
              isRecording
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Mic size={18} />
            {isRecording ? 'Recording...' : 'Record'}
          </button>
          <button
            onClick={handleSend}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
