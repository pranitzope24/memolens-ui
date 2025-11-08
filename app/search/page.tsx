"use client";
import { ChatUI } from "@/components/ChatUI";
import { motion } from "framer-motion";

export default function SearchPage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-50 to-pink-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">
        Search Your Photos
      </h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Talk to your AI photo assistant. Search using captions,  
        locations, or even familiar faces.
      </p>

      <ChatUI />
    </motion.div>
  );
}
