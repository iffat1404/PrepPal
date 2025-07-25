"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { Toaster, toast } from "react-hot-toast"

import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import FloatingElements from "./FloatingElements"
import ConfirmationModal from "./ConfirmationModal"

const Layout = ({ children, showSidebar = false, showFooter = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  // 1. Function to open the logout confirmation modal
  const handleLogoutRequest = () => {
    setIsLogoutModalOpen(true)
  }

  // 2. Function to execute when logout is confirmed
  const handleConfirmLogout = () => {
    logout()
    setIsLogoutModalOpen(false)
    navigate("/")
    toast.success("You have been logged out.")
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
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

      {/* Add the modal to the layout, controlled by state */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
      >
        Are you sure you want to log out of your PrepPal account?
      </ConfirmationModal>
      
      <FloatingElements />

      {/* 3. Pass the function to open the modal down to the Header */}
      <Header onLogoutRequest={handleLogoutRequest} />

      <div className="flex min-h-[calc(100vh-4rem)]">
        {showSidebar && (
          // 4. Pass the function to open the modal down to the Sidebar
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            onLogoutRequest={handleLogoutRequest} 
          />
        )}

        <main className="flex-1 relative z-10 flex flex-col">
          <div className="flex-1">{children}</div>
        </main>
      </div>

      {showFooter && <Footer />}
    </div>
  )
}

export default Layout