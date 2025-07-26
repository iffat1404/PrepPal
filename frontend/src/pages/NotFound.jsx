"use client"

import { Link } from "react-router-dom"
import { ArrowLeftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import FloatingElements from "../components/FloatingElements"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden flex items-center justify-center text-center px-6">
      <FloatingElements />
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center mb-6">
          <ExclamationTriangleIcon className="w-16 h-16 text-yellow-400" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-semibold mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-400 mb-8 max-w-lg mx-auto">
          Oops! The page you're looking for doesn't seem to exist. It might have been moved, deleted, or you may have typed the address incorrectly.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Go Back Home</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage