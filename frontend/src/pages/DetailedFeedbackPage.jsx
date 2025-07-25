"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { api } from "../utils/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { ArrowLeftIcon, ChatBubbleBottomCenterTextIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"

const DetailedFeedbackPage = () => {
  const { sessionId } = useParams()
  const [sessionData, setSessionData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // We fetch the same summary endpoint because it contains all the data we need
    const fetchDetailedSummary = async () => {
      try {
        const response = await api.get(`/interview/summary/${sessionId}`)
        if (response.data.status === "success") {
          setSessionData(response.data.data.session)
        }
      } catch (error) {
        console.error("Failed to fetch detailed summary:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetailedSummary()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!sessionData) {
    // ... (Error handling if session not found)
  }

  const { questions, feedback } = sessionData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to={`/summary/${sessionId}`}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Summary</span>
            </Link>
            <h1 className="text-4xl font-bold mb-2">Detailed Interview Analysis</h1>
            <p className="text-gray-400">A breakdown of your performance on each question.</p>
          </div>

          {/* Overall AI Detailed Feedback */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 mb-10">
            <div className="flex items-center mb-4">
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-purple-400 mr-3" />
              <h3 className="text-2xl font-semibold text-purple-300">PrepPal's Overall Feedback</h3>
            </div>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{feedback.detailedFeedback}</p>
          </div>
          
          {/* Question-by-Question Breakdown */}
          <div className="space-y-8">
            {feedback.questionFeedback.map((fb, index) => {
              const questionInfo = questions[fb.questionIndex];
              const scoreColor = fb.score >= 7 ? 'text-green-400' : fb.score >= 4 ? 'text-yellow-400' : 'text-red-400';
              
              return (
                <div key={index} className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-semibold text-blue-300">Question {fb.questionIndex + 1}</h4>
                    <div className={`text-2xl font-bold ${scoreColor}`}>{fb.score}/10</div>
                  </div>
                  
                  <p className="text-lg text-gray-200 mb-4 italic">"{questionInfo.question}"</p>

                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <h5 className="font-semibold text-gray-300 mb-2">Your Answer:</h5>
                    <p className="text-gray-400 bg-gray-900/40 p-3 rounded-lg">"{questionInfo.answer}"</p>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4 mt-4">
                     <h5 className="font-semibold text-gray-300 mb-2">AI Feedback:</h5>
                     <p className="text-gray-300">{fb.feedback}</p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}

export default DetailedFeedbackPage