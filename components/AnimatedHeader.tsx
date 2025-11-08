"use client";
import { motion } from "framer-motion";

export default function AnimatedHeader() {
  return (
    <header className="p-4 shadow-md bg-white flex justify-between items-center">
      <motion.h1
        className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        MemoLens
      </motion.h1>
      <nav className="space-x-6 text-gray-700">
        <a href="/" className="hover:text-blue-500">Upload</a>
        <a href="/search" className="hover:text-blue-500">Search</a>
      </nav>
    </header>
  );
}
