"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for the hamburger menu

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-blue-400 text-white py-4 px-6 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Wicky Task Manager
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Navigation Links */}
        <div
          className={`absolute lg:static top-16 left-0 w-full lg:w-auto bg-blue-400 lg:flex space-y-4 lg:space-y-0 lg:space-x-6 p-6 lg:p-0 transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <NavLink href="/" label="Home" pathname={pathname} />
          <NavLink href="/dashboard" label="Dashboard" pathname={pathname} />
          <NavLink href="/manage-tasks" label="Manage Tasks" pathname={pathname} />
          <NavLink href="/login" label="Login" pathname={pathname} />
        </div>
      </div>
    </nav>
  );
}

// Navigation Link Component
function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  return (
    <Link
      href={href}
      className={`block lg:inline px-3 py-2 rounded-md text-lg ${
        pathname === href ? "bg-white text-blue-400 font-semibold" : "hover:bg-blue-300"
      }`}
    >
      {label}
    </Link>
  );
}
