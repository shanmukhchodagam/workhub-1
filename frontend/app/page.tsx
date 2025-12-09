export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">WorkHub Platform</h1>
        <p className="text-lg text-gray-600 mb-8">AI-powered workflow automation for frontline teams</p>
        <div className="space-x-4">
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </a>
          <a 
            href="/register" 
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}