"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../utils/api"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/LoadingSpinner"
import Layout from "../components/Layout"
import Card from "../components/Card"
import { ArrowLeftIcon, PlayIcon } from "@heroicons/react/24/outline"

const InterviewSetupPage = () => {
  const [formData, setFormData] = useState({
    topic: "",
    experienceLevel: "intermediate",
    difficulty: "medium",
    numberOfQuestions: 5,
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const topics = [
    "React",
    "JavaScript",
    "Node.js",
    "Python",
    "Java",
    "System Design",
    "Data Structures",
    "Algorithms",
    "Database Design",
    "DevOps",
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.post("/interview/generate", formData)

      if (response.data.status === "success") {
        const { sessionId } = response.data.data
        toast.success("Interview session created!")
        navigate(`/interview/${sessionId}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create interview session")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout showSidebar={true} showFooter={false}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold mb-2">Setup Your Interview</h1>
          <p className="text-gray-400">Customize your interview session to match your preparation needs</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Topic Selection */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Interview Topic</label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white"
                >
                  <option value="">Select a topic</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Experience Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {["beginner", "intermediate", "advanced"].map((level) => (
                    <label key={level} className="cursor-pointer">
                      <input
                        type="radio"
                        name="experienceLevel"
                        value={level}
                        checked={formData.experienceLevel === level}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 rounded-lg border text-center transition-all ${
                          formData.experienceLevel === level
                            ? "border-purple-500 bg-purple-500/20 text-purple-300"
                            : "border-gray-600 bg-gray-800/50 hover:border-gray-500 text-gray-300"
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Difficulty</label>
                <div className="grid grid-cols-3 gap-3">
                  {["easy", "medium", "hard"].map((diff) => (
                    <label key={diff} className="cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty"
                        value={diff}
                        checked={formData.difficulty === diff}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-3 rounded-lg border text-center transition-all ${
                          formData.difficulty === diff
                            ? "border-pink-500 bg-pink-500/20 text-pink-300"
                            : "border-gray-600 bg-gray-800/50 hover:border-gray-500 text-gray-300"
                        }`}
                      >
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">
                  Number of Questions: {formData.numberOfQuestions}
                </label>
                <input
                  type="range"
                  name="numberOfQuestions"
                  min="3"
                  max="10"
                  value={formData.numberOfQuestions}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>3</span>
                  <span>10</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <PlayIcon className="mr-2 w-5 h-5" />
                    Start Interview
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default InterviewSetupPage
