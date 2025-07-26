"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../utils/api"
import { useAuthStore } from "../store/authStore"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/LoadingSpinner"
import FloatingElements from "../components/FloatingElements"
import Header from "../components/Header"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
        console.log("Form submitted, default action PREVENTED. If you see this, the code is new.")
    setIsLoading(true)

    try {
      const response = await api.post("/auth/login", formData)

      if (response.data.status === "success") {
        const { user, token } = response.data.data
        login(user, token)
        toast.success("Welcome back!")
        navigate("/dashboard")
      }
    } catch (error) {
      // This line correctly handles displaying login errors
        console.error("Login API call failed with error:", error)

      // 2. Safely check if a specific message exists from our backend.
      if (error.response && error.response.data && error.response.data.message) {
   
        toast.error(error.response.data.message)
      } else {
        // If it's a network error or any other kind of error, display a generic message.
        toast.error("An error occurred. Please check your connection and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <FloatingElements />
      {/* Passing a dummy function or nothing is fine here since user is not authenticated yet */}
      <Header onLogoutRequest={() => {}} />

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6 py-12">
        <div className="max-w-md w-full relative z-10">
          <div className="bg-gray-900/80 backdrop-blur-md border border-purple-500/20 p-8 rounded-xl shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">PP</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PrepPal
                </span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to continue your AI interview preparation</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder-gray-400"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
                  />
                
                </div>

              
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg"
              >
                {isLoading ? <LoadingSpinner size="small" /> : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage