"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon, BellIcon } from "@heroicons/react/24/outline"

// Receive 'onLogoutRequest' as a prop
const Header = ({ onLogoutRequest }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuthStore()

  const handleMobileLogout = () => {
    onLogoutRequest();
    setIsMenuOpen(false);
  }

  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PrepPal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/interview/setup" className="text-gray-300 hover:text-white transition-colors">
                  Practice
                </Link>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <BellIcon className="w-5 h-5" />
                  </button>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <UserCircleIcon className="w-5 h-5" />
                    <span className="text-sm">{user?.fullName}</span>
                  </div>
                  {/* Use the passed-in function */}
                  <button onClick={onLogoutRequest} className="text-gray-400 hover:text-white transition-colors">
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                 SignUp
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-300 hover:text-white">
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20">
            {isAuthenticated ? (
              <div className="space-y-4">
                <Link
                  to="/dashboard"
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/interview/setup"
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Practice
                </Link>
                 {/* Use the passed-in function */}
                <button onClick={handleMobileLogout} className="block text-gray-300 hover:text-white transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg text-white font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SignUp
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header