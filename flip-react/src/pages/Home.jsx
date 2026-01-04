import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center px-6">
      {/* Hero Section */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-4">
          Welcome to FlipBook Library
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          Explore interactive flipbooks with beautiful page curl animations. 
          Click below to see all flipbooks available.
        </p>
      </header>

      {/* Call-to-action */}
      <Link
        to="/flip"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1"
      >
        Browse Flipbooks
      </Link>

      {/* Footer / Notes */}
      <footer className="mt-20 text-center text-gray-500 text-sm">
        © 2026 FlipBook App. All rights reserved.
      </footer>
    </div>
  );
}
