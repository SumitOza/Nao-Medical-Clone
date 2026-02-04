'use client'

import { useState } from 'react'
import { DoctorPanel } from '@/components/doctor-panel'
import { PatientPanel } from '@/components/patient-panel'
import { Download } from 'lucide-react'

export default function Page() {
  const [showSummary, setShowSummary] = useState(false)

  const handleGenerateSummary = () => {
    setShowSummary(true)
    // In a real app, this would call an API to generate a summary
    setTimeout(() => {
      alert(
        'Summary Generated:\n\nPatient: John Doe\nDate: ' +
          new Date().toLocaleDateString() +
          '\nChief Complaint: Headaches and fatigue\nAssessment: Initial consultation completed. Further tests recommended.\nFollowup: Schedule follow-up appointment in 1 week.',
      )
      setShowSummary(false)
    }, 1500)
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Medical Translation</h1>
          <p className="text-blue-100 text-sm">Real-time Doctor-Patient Communication</p>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={showSummary}
          className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={20} />
          {showSummary ? 'Generating...' : 'Generate Summary'}
        </button>
      </div>

      {/* Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <DoctorPanel />
        </div>
        <div className="flex-1 flex flex-col">
          <PatientPanel />
        </div>
      </div>
    </div>
  )
}
