"use client";
import { FileUploader } from "@/components/FileUploader";
import { motion } from "framer-motion";
import LottieWrapper from "@/components/LottieWrapper";
import uploadAnim from "@/assets/animations/upload.json";

export default function Page() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <LottieWrapper animation={uploadAnim} className="w-64 h-64 mb-6" />
      </motion.div>

      <h2 className="text-3xl font-semibold mb-4 text-gray-800">
        Upload Your Photos
      </h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Upload one or more images (JPG, JPEG, PNG, HEIC, HEIF).  
        AI will analyze and organize them intelligently.
      </p>

      <FileUploader />
    </motion.div>
  );
}
