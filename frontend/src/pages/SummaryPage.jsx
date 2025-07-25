"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { api } from "../utils/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { ChartBarIcon, TrophyIcon, ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from "@heroicons/react/24/outline"

const SummaryPage = () => {
  const { sessionId } = useParams()
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get(`/interview/summary/${sessionId}`)

        if (response.data.status === "success") {
          setSummary(response.data.data.session)
        }
      } catch (error) {
        console.error("Failed to fetch summary:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Summary Not Found</h2>
          <p className="text-gray-400 mb-6">Unable to load interview summary.</p>
          <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const { feedback } = summary
  const scoreColor =
    feedback.overallScore >= 80 ? "text-green-400" : feedback.overallScore >= 60 ? "text-yellow-400" : "text-red-400"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PrepPal
          </div>
          <div className="flex space-x-4">
            <Link
              to="/interview/setup"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>New Interview</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Interview Complete! 🎉</h1>
            <p className="text-xl text-gray-300">Here's how you performed</p>
          </div>

          {/* Overall Score */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <TrophyIcon className={`w-16 h-16 ${scoreColor}`} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Overall Score</h2>
            <div className={`text-6xl font-bold ${scoreColor} mb-4`}>{feedback.overallScore}%</div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${
                  feedback.overallScore >= 80
                    ? "bg-green-500"
                    : feedback.overallScore >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${feedback.overallScore}%` }}
              ></div>
            </div>
            <p className="text-gray-300">
              {feedback.overallScore >= 80
                ? "Excellent performance! You're well-prepared."
                : feedback.overallScore >= 60
                  ? "Good job! There's room for improvement."
                  : "Keep practicing! You'll get better with time."}
            </p>
          </div>

          {/* Detailed Feedback */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <ChartBarIcon className="w-6 h-6 text-green-400 mr-2" />
                <h3 className="text-xl font-semibold text-green-400">Strengths</h3>
              </div>
              <ul className="space-y-3">
                {feedback.strengths?.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">{strength}</span>
                  </li>
                )) || [
                  <li key="1" className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">Clear communication and articulation</span>
                  </li>,
                  <li key="2" className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">Good technical knowledge demonstration</span>
                  </li>,
                  <li key="3" className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">Structured approach to problem-solving</span>
                  </li>,
                ]}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400 mr-2" />
                <h3 className="text-xl font-semibold text-yellow-400">Areas for Improvement</h3>
              </div>
              <ul className="space-y-3">
                {feedback.improvements?.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">{improvement}</span>
                  </li>
                )) || [
                  <li key="1" className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">Provide more specific examples in answers</span>
                  </li>,
                  <li key="2" className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">Work on reducing filler words</span>
                  </li>,
                  <li key="3" className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-300">Practice explaining complex concepts more clearly</span>
                  </li>,
                ]}
              </ul>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 mb-8">
            <h3 className="text-xl font-semibold mb-6">Performance Breakdown</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">{feedback.technicalScore || 85}%</div>
                <div className="text-sm text-gray-400">Technical Knowledge</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{feedback.communicationScore || 78}%</div>
                <div className="text-sm text-gray-400">Communication</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{feedback.clarityScore || 82}%</div>
                <div className="text-sm text-gray-400">Clarity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400 mb-1">{feedback.confidenceScore || 75}%</div>
                <div className="text-sm text-gray-400">Confidence</div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
            <h3 className="text-2xl font-semibold mb-4">What's Next?</h3>
            <p className="text-gray-300 mb-6">
              Keep practicing to improve your interview skills. Regular practice leads to better performance!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/interview/setup"
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Practice Again
              </Link>
              <Link
                to="/dashboard"
                className="border border-gray-600 px-6 py-3 rounded-lg font-semibold hover:border-gray-500 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryPage
