import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline"

const MetricCard = ({ title, value, change, changeType = "positive", icon: Icon, color = "purple" }) => {
  const colorClasses = {
    purple: "from-purple-500 to-pink-500",
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    orange: "from-orange-500 to-red-500",
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}
        >
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        {change && (
          <div
            className={`flex items-center space-x-1 text-sm ${
              changeType === "positive" ? "text-green-400" : "text-red-400"
            }`}
          >
            {changeType === "positive" ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  )
}

export default MetricCard
