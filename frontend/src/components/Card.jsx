"use client"

const Card = ({ children, className = "", hover = false, gradient = false, onClick }) => {
  const baseClasses = "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl"
  const hoverClasses = hover
    ? "hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
    : ""
  const gradientClasses = gradient ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20" : ""

  return (
    <div className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card
