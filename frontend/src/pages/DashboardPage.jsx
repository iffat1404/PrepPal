
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import Card from "../components/Card"
import MetricCard from "../components/MetricCard"
import SearchBar from "../components/SearchBar"
import { useAuthStore } from "../store/authStore"
import {
  PlayIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  StarIcon,
} from "@heroicons/react/24/outline"
import { getRandomTip } from "../utils/interviewTips"
import { api } from "../utils/api" // Import your api utility
import LoadingSpinner from "../components/LoadingSpinner"

const DashboardPage = () => {
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTip, setCurrentTip] = useState("")

  useEffect(() => {
    setCurrentTip(getRandomTip()) // Pass no argument for the first tip
  }, [])

  const [recentSessions, setRecentSessions] = useState([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
 useEffect(() => {
    setCurrentTip(getRandomTip())

    // 2. Function to fetch real recent sessions
    const fetchRecentSessions = async () => {
      try {
        // Call your API, but limit the results to 3 for the dashboard
        const response = await api.get("/user/sessions?limit=3&sortBy=createdAt")
        if (response.data.status === "success") {
          setRecentSessions(response.data.data.sessions)
        }
      } catch (error) {
        console.error("Failed to fetch recent sessions:", error)
      } finally {
        setIsLoadingSessions(false)
      }
    }

    fetchRecentSessions()
  }, [])

  const quickActions = [
    {
      title: "Start New Interview",
      description: "Begin a new AI-powered interview session",
      icon: PlayIcon,
      color: "purple",
      path: "/interview/setup",
    },
    {
      title: "View Analytics",
      description: "Check your performance metrics",
      icon: ChartBarIcon,
      color: "blue",
      path: "/analytics",
    },
    {
      title: "Interview History",
      description: "Review past interview sessions",
      icon: DocumentTextIcon,
      color: "green",
      path: "/interview/history",
    },
  ]
  const handleGetNewTip = () => {
    setCurrentTip(getRandomTip(currentTip)) // Pass the current tip to avoid repetition
  }

  return (
    <Layout showSidebar={true} showFooter={false}>
      <div className="px-4 pt-10 pb-10 lg:px-6 xl:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {user?.fullName?.split(" ")[0]}
                </span>
                ! 👋
              </h1>
              <p className="text-gray-400">Ready to practice and improve your interview skills?</p>
            </div>

          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Success Rate"
            value="89.5%"
            change="+5.2%"
            changeType="positive"
            icon={TrophyIcon}
            color="purple"
          />
          <MetricCard
            title="Practice Sessions"
            value="156"
            change="+12"
            changeType="positive"
            icon={MicrophoneIcon}
            color="blue"
          />
          <MetricCard
            title="Avg. Score"
            value="85.2"
            change="+3.1"
            changeType="positive"
            icon={StarIcon}
            color="green"
          />
          <MetricCard
            title="Time Practiced"
            value="24.5h"
            change="+2.3h"
            changeType="positive"
            icon={ClockIcon}
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.path}>
                  <Card className="p-6 h-full" hover>
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${
                        action.color === "purple"
                          ? "from-purple-500 to-pink-500"
                          : action.color === "blue"
                            ? "from-blue-500 to-cyan-500"
                            : "from-green-500 to-emerald-500"
                      } rounded-lg flex items-center justify-center mb-4`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Recent Sessions */}
            <h2 className="text-xl font-semibold mb-6">Recent Sessions</h2>
            <Card className="p-6">
              {isLoadingSessions ? (
                <div className="flex justify-center items-center h-40">
                  <LoadingSpinner />
                </div>
              ) : recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {/* 4. Map over the REAL recentSessions state */}
                  {recentSessions.map((session) => {
                    const score = session.feedback?.overallScore
                    const scoreColor = score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400"
                    
                    return (
                      <Link to={`/summary/${session._id}`} key={session._id}>
                        <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <PlayIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium">{session.topic}</h3>
                              <p className="text-sm text-gray-400">
                                {new Date(session.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {score !== undefined ? (
                            <div className="text-right">
                              <div className={`text-lg font-semibold ${scoreColor}`}>
                                {score}%
                              </div>
                              <p className="text-xs text-gray-400">Score</p>
                            </div>
                          ) : (
                             <div className="text-right">
                                <span className="text-sm text-gray-400 px-2 py-1 bg-gray-700 rounded-md">Pending</span>
                             </div>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-10">
                  <p>You haven't completed any interviews yet.</p>
                  <p>Start one to see your history here!</p>
                </div>
              )}
              <div className="mt-6 text-center">
                <Link to="/interview/history" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  View all sessions →
                </Link>
              </div>
            </Card>
          </div>
          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Performance Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Performance Trend</h3>
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
              </div>
              <div className="h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg relative overflow-hidden mb-4">
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-t-lg"></div>
                <div className="absolute bottom-0 right-0 w-3/4 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-tl-lg"></div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">+15%</div>
                <p className="text-sm text-gray-400">Improvement this week</p>
              </div>
            </Card>

            {/* AI Tips */}
             <Card className="p-6" gradient>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">AI</span>
                </div>
                <h3 className="font-semibold">AI Tip of the Day</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4 h-24">{currentTip}</p> {/* Adjusted height for potentially longer tips */}
              <button
                onClick={handleGetNewTip}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Get Another Tip
              </button>
            </Card>

          
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage
