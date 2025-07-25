"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../utils/api"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/LoadingSpinner"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import { MicrophoneIcon, StopIcon, PaperAirplaneIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline"

const InterviewPage = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [isListening, setIsListening] = useState(false)

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()

  useEffect(() => {
    // Load interview session data
    const loadSession = async () => {
      try {
        // In a real app, you'd fetch the session data
        // For now, we'll simulate it
        setQuestions([
          "Tell me about yourself and your experience with React.",
          "How do you handle state management in large React applications?",
          "Explain the difference between controlled and uncontrolled components.",
          "What are React hooks and why are they useful?",
          "How would you optimize the performance of a React application?",
        ])
        setStartTime(Date.now())
        setIsLoading(false)
      } catch (error) {
        toast.error("Failed to load interview session")
        navigate("/dashboard")
      }
    }

    loadSession()
  }, [sessionId, navigate])

  useEffect(() => {
    // Read question aloud when it changes
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const utterance = new SpeechSynthesisUtterance(questions[currentQuestionIndex])
      utterance.rate = 0.8
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }, [currentQuestionIndex, questions])

  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Browser does not support speech recognition")
      return
    }

    resetTranscript()
    SpeechRecognition.startListening({ continuous: true })
    setIsListening(true)
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
    setIsListening(false)
  }

  const submitAnswer = async () => {
    if (!transcript.trim()) {
      toast.error("Please provide an answer before submitting")
      return
    }

    setIsSubmitting(true)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    try {
      const response = await api.post("/interview/submit-answer", {
        sessionId,
        questionIndex: currentQuestionIndex,
        answer: transcript,
        timeSpent,
      })

      if (response.data.status === "success") {
        const { isCompleted } = response.data.data

        if (isCompleted || currentQuestionIndex >= questions.length - 1) {
          toast.success("Interview completed!")
          navigate(`/summary/${sessionId}`)
        } else {
          setCurrentQuestionIndex((prev) => prev + 1)
          resetTranscript()
          setStartTime(Date.now())
          toast.success("Answer submitted!")
        }
      }
    } catch (error) {
      toast.error("Failed to submit answer")
    } finally {
      setIsSubmitting(false)
    }
  }

  const readQuestionAloud = () => {
    if (questions[currentQuestionIndex]) {
      const utterance = new SpeechSynthesisUtterance(questions[currentQuestionIndex])
      utterance.rate = 0.8
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Browser Not Supported</h2>
          <p className="text-gray-400">Your browser does not support speech recognition.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PrepPal Interview
          </div>
          <div className="text-sm text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="container mx-auto px-6 mb-8">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Question Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 mb-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-semibold text-blue-300">Current Question</h2>
              <button
                onClick={readQuestionAloud}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <SpeakerWaveIcon className="w-5 h-5" />
                <span className="text-sm">Read Aloud</span>
              </button>
            </div>
            <p className="text-lg text-gray-200 leading-relaxed">{questions[currentQuestionIndex]}</p>
          </div>

          {/* Speech Controls */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Your Answer</h3>
              <div className="flex space-x-4">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <MicrophoneIcon className="w-5 h-5" />
                    <span>Start Speaking</span>
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <StopIcon className="w-5 h-5" />
                    <span>Stop Speaking</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Status */}
            <div className="mb-4">
              <div
                className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  listening ? "bg-green-600/20 text-green-300" : "bg-gray-600/20 text-gray-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${listening ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
                ></div>
                <span>{listening ? "Listening..." : "Not listening"}</span>
              </div>
            </div>

            {/* Transcript */}
            <textarea
              value={transcript}
              readOnly
              placeholder="Your speech will appear here..."
              className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={submitAnswer}
                disabled={isSubmitting || !transcript.trim()}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span>Submit Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <h4 className="font-semibold mb-3 text-yellow-400">💡 Tips for Better Recognition</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Ensure you're in a quiet environment</li>
              <li>• Keep your microphone close to your mouth</li>
              <li>• Pause briefly between sentences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewPage
