"use client"

import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface SubSection {
  title: string
  content: string
}

interface LawsuitDetails {
  summary: SubSection[]
  context: SubSection[]
  vulnerabilities: SubSection[]
}

export function LawsuitDetails() {
  const [lawsuitDetails, setLawsuitDetails] = useState<LawsuitDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    context: true,
    vulnerabilities: true,
  })

  useEffect(() => {
    const fetchLawsuitDetails = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setLawsuitDetails({
        summary: [
          { title: "Case Overview", content: "This lawsuit involves a contract dispute between Global Solutions Ltd and TechCorp regarding a software development project." },
          { title: "Key Issues", content: "The main points of contention are project delays, quality of deliverables, and payment schedules." },
        ],
        context: [
          { title: "Background", content: "The contract was signed in January 2023 for a 6-month project to develop a custom CRM system." },
          { title: "Dispute Timeline", content: "Disagreements arose in April 2023 when the first major milestone was missed." },
        ],
        vulnerabilities: [
          { title: "Contract Ambiguities", content: "The contract lacks clear definitions of 'acceptable quality' for deliverables." },
          { title: "Communication Gaps", content: "There's evidence of miscommunication between project managers from both parties." },
        ],
      })
      setLoading(false)
    }

    fetchLawsuitDetails()
  }, [])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center mb-8">
          <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-white mr-4">
            GL
          </div>
          <div>
            <h1 className="text-2xl font-bold">Contract Dispute</h1>
            <p className="text-gray-600">Global Solutions Ltd</p>
          </div>
        </div>

        {['summary', 'context', 'vulnerabilities'].map((section, index) => (
          <div key={section} className={`mb-6 ${index !== 0 ? 'border-t border-gray-200 pt-6' : ''}`}>
            <button
              onClick={() => toggleSection(section as keyof typeof expandedSections)}
              className="w-full flex justify-between items-center mb-4"
            >
              <h2 className="text-xl font-semibold capitalize">{section}</h2>
              {expandedSections[section as keyof typeof expandedSections] ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedSections[section as keyof typeof expandedSections] && (
              <div className="space-y-4">
                {loading ? (
                  <>
                    {[1, 2].map((item) => (
                      <div key={item} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {lawsuitDetails?.[section as keyof LawsuitDetails].map((subSection, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-lg mb-2">{subSection.title}</h3>
                        <p className="text-gray-700">{subSection.content}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}