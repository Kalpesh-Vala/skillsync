import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          SkillSync
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Track, sync, and grow your professional skills
        </p>
        <div className="flex gap-4 justify-center mb-12">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
          >
            Register
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why SkillSync?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your skill development with detailed progress tracking and analytics
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Set Goals</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Define clear learning objectives and milestone achievements
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Get Insights</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Receive personalized recommendations based on your learning patterns
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to enhance your skills?</h2>
        <a
          href="/register"
          className="inline-block px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Get Started Now
        </a>
      </div>
    </div>
  );
}
