"use client"

import { useState } from "react"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"

const SearchBar = ({ placeholder = "Search...", onSearch, className = "" }) => {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  const clearSearch = () => {
    setQuery("")
    if (onSearch) {
      onSearch("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div
        className={`relative flex items-center bg-gray-800/50 border rounded-lg transition-all ${
          isFocused ? "border-purple-500 ring-1 ring-purple-500/20" : "border-gray-700"
        }`}
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 ml-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:outline-none"
        />
        {query && (
          <button type="button" onClick={clearSearch} className="p-2 text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  )
}

export default SearchBar
