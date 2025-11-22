"use client";

import { FileUploader } from "@/components/FileUploader";
import { KnownFaceUploader } from "@/components/KnownFaceUploader";
import { motion } from "framer-motion";
import LottieWrapper from "@/components/LottieWrapper";
import uploadAnim from "@/assets/animations/upload.json";

export default function Page() {
  return (
    <motion.div
      className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-br from-gray-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Animation */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <LottieWrapper animation={uploadAnim} className="w-48 h-48 mb-6" />
      </motion.div>

      {/* Title + Subtitle */}
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">
        Manage Your Photos
      </h2>
      <p className="text-gray-600 mb-10 text-center max-w-xl">
        Upload new photos or add known faces to help the system recognize people in your images.
      </p>

      {/* Two Card Layout */}
      <div
        className="
          grid 
          grid-cols-1 
          lg:grid-cols-2 
          gap-10 
          w-full 
          max-w-6xl 
          auto-rows-fr 
        "
      >
        <div className="flex">
          <FileUploader />

        </div>
        <div className="flex">
          <KnownFaceUploader />
        </div>
      </div>
    </motion.div>
  );
}
