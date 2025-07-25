"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "../utils/api"
import Layout from "../components/Layout"
import Card from "../components/Card"
import LoadingSpinner from "../components/LoadingSpinner"
import ConfirmationModal from "../components/ConfirmationModal"
import toast from "react-hot-toast" // Import toast for notifications
import { ArrowLeftIcon, TrophyIcon, TrashIcon } from "@heroicons/react/24/outline" // Import TrashIcon

const InterviewHistoryPage = () => {
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState(null)

  useEffect(() => {
    const fetchAllSessions = async () => {
      try {
        const response = await api.get("/user/sessions")
        if (response.data.status === "success") {
          setSessions(response.data.data.sessions)
        }
      } catch (error) {
        console.error("Failed to fetch all sessions:", error)
        toast.error("Could not load your session history.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllSessions()
  }, [])

  const handleDeleteClick = (e, sessionId) => {
    e.preventDefault()
    e.stopPropagation()
    setSessionToDelete(sessionId)
    setIsModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return

    try {
      await api.delete(`/interview/session/${sessionToDelete}`)
      
      setSessions(prevSessions => prevSessions.filter(session => session._id !== sessionToDelete))
      
      toast.success("Interview session deleted successfully.")
    } catch (error) {
      toast.error("Failed to delete the session.")
      console.error("Deletion error:", error)
    } finally {
      setIsModalOpen(false)
      setSessionToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <Layout showSidebar={true} showFooter={false}>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout showSidebar={true} showFooter={false}>
      {/* Pass the correct button text to the modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        confirmButtonText="Delete Session" 
      >
        <p>Are you sure you want to permanently delete this interview session?</p>
        <p className="mt-2 text-sm text-gray-400">This action cannot be undone.</p>
      </ConfirmationModal>

      <div className="p-6">
        {/* Header (No changes needed) */}
        <div className="mb-8">
          <Link to="/dashboard" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Interview History</h1>
          <p className="text-gray-400">Review your past practice sessions and see your progress.</p>
        </div>

        {/* Sessions Grid */}
        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sessions.map((session) => {
              const score = session.feedback?.overallScore
              const scoreColor = score >= 80 ? "text-green-400" : score >= 40 ? "text-yellow-400" : "text-red-400"
              const borderColor = score >= 80 ? "hover:border-green-500/50" : score >= 40 ? "hover:border-yellow-500/50" : "hover:border-red-500/50"

              return (
                // 1. Create a flex container for the card and the button
                <div key={session._id} className="flex items-center gap-2">
                  {/* 2. The Link now only wraps the Card and takes up most of the space */}
                  <Link to={`/summary/${session._id}`} className="flex-grow">
                    <Card className={`p-6 h-full transition-all duration-300 ${borderColor}`} hover>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg">{session.topic}</h3>
                        {score !== undefined ? (
                          <div className={`flex items-center font-bold ${scoreColor}`}>
                            <TrophyIcon className="w-5 h-5 mr-1" />
                            <span>{score}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 px-2 py-1 bg-gray-700 rounded-md">Pending</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-1">
                        Level: <span className="font-medium text-gray-300 capitalize">{session.experienceLevel}</span>
                      </p>
                      <p className="text-sm text-gray-400">
                        Taken on: <span className="font-medium text-gray-300">{new Date(session.createdAt).toLocaleDateString()}</span>
                      </p>
                    </Card>
                  </Link>
                  
                  {/* 3. The delete button is now a separate, always-visible element */}
                  <button
                    onClick={(e) => handleDeleteClick(e, session._id)}
                    className="p-3 rounded-full bg-gray-800/60 text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition-colors self-center"
                    aria-label="Delete session"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-20">
            <h2 className="text-2xl font-semibold mb-2">No History Found</h2>
            <p>Complete your first interview to see your history here.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default InterviewHistoryPage