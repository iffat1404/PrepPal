"use client"

import { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import FloatingElements from "./FloatingElements"

const Layout = ({ children, showSidebar = false, showFooter = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      <FloatingElements />
      <Header />

      <div className="flex min-h-[calc(100vh-4rem)]">
        {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

        <main className="flex-1 relative z-10 flex flex-col">
          <div className="flex-1">{children}</div>
        </main>
      </div>

      {showFooter && <Footer />}
    </div>
  )
}

export default Layout
