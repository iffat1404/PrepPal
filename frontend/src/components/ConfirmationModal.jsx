"use client"

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children,
  confirmButtonText = "Confirm" // Add new prop with a default value
}) => {
  if (!isOpen) return null

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] flex items-center justify-center">
      {/* Modal */}
      <div className="bg-gray-800 border border-purple-500/30 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">{title}</h3>
          {/* The children prop allows for custom text and elements */}
          <div className="text-gray-300">{children}</div>
        </div>
        <div className="bg-gray-900/50 px-6 py-4 flex justify-end items-center gap-4 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
          >
            {/* Use the new prop here instead of hardcoded text */}
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal