import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import Card from "../components/Card"
import { PlayIcon, ChartBarIcon, MicrophoneIcon, SparklesIcon, CheckIcon } from "@heroicons/react/24/outline"

const HomePage = () => {
  const features = [
    {
      icon: MicrophoneIcon,
      title: "Voice Recognition",
      description: "Advanced AI-powered speech recognition for natural interview practice",
    },
    {
      icon: SparklesIcon,
      title: "Smart AI Questions",
      description: "Personalized interview questions based on your role and experience level",
    },
    {
      icon: ChartBarIcon,
      title: "Performance Analytics",
      description: "Detailed feedback and insights to improve your interview skills",
    },
  ]

  const benefits = [
    "Real-time speech-to-text transcription",
    "AI-powered question generation",
    "Comprehensive performance feedback",
    "Practice anytime, anywhere",
    "Track your improvement over time",
    "Industry-specific interview prep",
  ]

  return (
    <Layout showFooter={true}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
              <SparklesIcon className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-purple-300 text-sm font-medium">Help for your interview preparation just arrived</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Boost your{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                interview skills
              </span>{" "}
              with AI.
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Elevate your interview performance effortlessly with AI, where smart technology meets personalized
              preparation tools.
            </p>

            {/* CTA Button */}
            <Link
              to="/signup"
              className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Start for free
            </Link>
          </div>

          {/* Robot Image */}
          <div className="flex justify-center mt-16">
            <div className="relative">
              <img
  src="/images/robo.png"
  alt="AI Robot Assistant"
  className="w-96 h-96 object-contain animate-floatZoom"
/>

              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="container mx-auto px-6 ">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powered by Advanced AI</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our cutting-edge technology provides personalized interview preparation like never before
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center" hover>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto pl-24 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                succeed
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              From AI-powered questions to detailed performance analytics, we've got you covered.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <img src="/images/robo1.png" alt="AI Interview Assistant" className="hidden lg:block max-w-[500px] max-h-[500px]  object-contain" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="p-12 text-center max-w-4xl mx-auto" gradient>
          <div className="flex justify-center mb-8">
          </div>
          <h2 className="text-4xl font-bold mb-6">Ready to ace your next interview?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have improved their interview skills with PrepPal's AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Start practicing now
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center border border-gray-600 px-8 py-4 rounded-lg text-lg font-semibold hover:border-purple-500 transition-all"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </section>
    </Layout>
  )
}

export default HomePage
