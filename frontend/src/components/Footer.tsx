import Link from "next/link";

export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h2 className="text-xl font-semibold">About Task Manager</h2>
            <p className="text-gray-400 mt-3">
              A simple, intuitive task management app designed to help you stay organized
              and productive.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold">Quick Links</h2>
            <ul className="mt-3 space-y-2">
              <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link href="/signup" className="hover:text-blue-400">Sign Up</Link></li>
              <li><Link href="/login" className="hover:text-blue-400">Login</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-400">Manage Tasks</Link></li>
            </ul>
          </div>
  
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <p className="text-gray-400 mt-3">Email: o.wicklifeoguda@gmail.com</p>
            <p className="text-gray-400 mt-1">Phone: +2547 9201 5743</p>
          </div>
        </div>
  
        {/* Copyright Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Wicky Task Manager. All rights reserved.
        </div>
      </footer>
    );
  }
  