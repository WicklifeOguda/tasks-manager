"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      {/* Hero Section */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
        Organize Your Tasks Effortlessly
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mt-4">
        A simple and intuitive task manager to boost your productivity.
      </p>

      {/* Call to Action */}
      <button
        onClick={() => router.push("/signup")}
        className="mt-6 bg-blue-400 hover:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
      >
        Get Started
      </button>

      {/* Feature Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <div className="p-6 bg-white rounded-lg shadow-md border">
          <h2 className="text-xl text-gray-800 font-semibold">Easy Task Management</h2>
          <p className="text-gray-600 mt-2">
            Create, update, and organize your tasks in just a few clicks.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md border">
          <h2 className="text-xl text-gray-800 font-semibold">Progress Tracking</h2>
          <p className="text-gray-600 mt-2">
            Monitor task status and stay on top of your productivity.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md border">
          <h2 className="text-xl text-gray-800 font-semibold">Secure & Fast</h2>
          <p className="text-gray-600 mt-2">
            Your data is safe, and the app runs lightning-fast.
          </p>
        </div>
      </div>
    </div>
  );
}
