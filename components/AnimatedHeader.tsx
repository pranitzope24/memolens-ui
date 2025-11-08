"use client";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function AnimatedHeader() {
  return (
    <header className="fixed w-full top-0 left-0 right-0 p-4 shadow-md bg-white/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="outline-none focus:ring-2 focus:ring-blue-300 rounded-lg transition">
          <motion.div layoutId="logoWrapper" className="flex items-center gap-2 px-2">
            <motion.div layoutId="logoImage">
              <Image src={logo} alt="MemoLens Logo" width={40} height={40} />
            </motion.div>
            <motion.span
              layoutId="logoText"
              className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
            >
              MemoLens
            </motion.span>
          </motion.div>
        </Link>

        <nav className="flex items-center gap-2 ml-4">
          <Link 
            href="/upload"
            className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload
          </Link>
          <Link 
            href="/search"
            className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-all duration-200 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search Memories
          </Link>
        </nav>
      </div>
    </header>
  );
}
