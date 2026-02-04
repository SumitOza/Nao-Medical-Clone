interface ChatBubbleProps {
  message: string
  sender: 'doctor' | 'patient'
  timestamp?: string
}

export function ChatBubble({ message, sender, timestamp }: ChatBubbleProps) {
  const isDoctor = sender === 'doctor'
  
  return (
    <div className={`flex ${isDoctor ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isDoctor
            ? 'bg-blue-100 text-blue-900'
            : 'bg-green-100 text-green-900'
        }`}
      >
        <p className="text-sm">{message}</p>
        {timestamp && (
          <p className="text-xs opacity-60 mt-1">{timestamp}</p>
        )}
      </div>
    </div>
  )
}
