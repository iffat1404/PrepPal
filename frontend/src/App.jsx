"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast" 
import { useAuthStore } from "./store/authStore"
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import InterviewSetupPage from "./pages/InterviewSetupPage"
import InterviewPage from "./pages/InterviewPage"
import SummaryPage from "./pages/SummaryPage"
import DetailedFeedbackPage from "./pages/DetailedFeedbackPage"
import ProtectedRoute from "./components/ProtectedRoute"
import LoadingSpinner from "./components/LoadingSpinner"
import InterviewHistoryPage from "./pages/InterviewHistoryPage" 
import NotFoundPage from "./pages/NotFound"
function App() {
  const { checkAuth, isLoading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white">
              {/* Add Toaster for sitewide notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#1F2937", // gray-800
            color: "#fff",
            border: "1px solid #4B5563", // gray-600
          },
        }}
      />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/setup"
            element={
              <ProtectedRoute>
                <InterviewSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/:sessionId"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary/:sessionId"
            element={
              <ProtectedRoute>
                <SummaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary/detailed/:sessionId"
            element={
              <ProtectedRoute>
                <DetailedFeedbackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/history"
            element={
              <ProtectedRoute>
                <InterviewHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
          
      </div>
    </Router>
  )
}

export default App
