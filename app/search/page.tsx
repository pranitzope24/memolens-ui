"use client";

import { ChatUI } from "@/components/ChatUI";
import { motion } from "framer-motion";
import LottieWrapper from "@/components/LottieWrapper";
import searchAnim from "@/assets/animations/search.json";

export default function SearchPage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-50 to-pink-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Animation */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col items-center"
      >
        <LottieWrapper animation={searchAnim} className="w-52 h-52 mb-6" />

        <h2 className="text-3xl font-semibold mb-3 text-gray-800">
          Search Your Photos
        </h2>

        <p className="text-gray-600 mb-10 text-center max-w-md">
          Talk to your AI photo assistant. Search using captions,
          locations, or even familiar faces.
        </p>
      </motion.div>

      {/* Chat Window Smooth Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="w-full flex justify-center"
      >
        <ChatUI />
      </motion.div>
    </motion.div>
  );
}
