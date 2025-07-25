"use client"

import { Link, useLocation } from "react-router-dom"
import {
  HomeIcon,
  ChartBarIcon,
  PlayIcon,
  DocumentTextIcon,
  CogIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", path: "/dashboard" },
    { icon: PlayIcon, label: "Start Interview", path: "/interview/setup" },
    { icon: ChartBarIcon, label: "Analytics", path: "/analytics" },
    { icon: DocumentTextIcon, label: "Interview History", path: "/history" },
    { icon: CogIcon, label: "Settings", path: "/settings" },
    { icon: QuestionMarkCircleIcon, label: "Help", path: "/help" },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-gray-900/90 backdrop-blur-md border-r border-purple-500/20 transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto lg:h-auto flex flex-col`}
      >
        <div className="flex-1 p-6">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* AI Assistant Card */}
      
      </aside>
    </>
  )
}

export default Sidebar
