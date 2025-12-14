"use client";

import { FileUploader } from "@/components/FileUploader";
import { KnownFaceUploader } from "@/components/KnownFaceUploader";
import { motion } from "framer-motion";
import LottieWrapper from "@/components/LottieWrapper";
import uploadAnim from "@/assets/animations/upload.json";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {

  const router = useRouter();
const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setCheckedAuth(true);
    }
  }, [router]);

  // Prevent UI flash before auth check
  if (!checkedAuth) return null;

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section (simple fade-in) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col items-center"
      >
        <LottieWrapper animation={uploadAnim} className="w-52 h-52 mb-6" />

        <h2 className="text-3xl font-semibold mb-3 text-gray-800">
          Manage Your Photos
        </h2>
        <p className="text-gray-600 mb-10 text-center max-w-xl">
          Upload new photos or add known faces to help the system recognize people in your images.
        </p>
      </motion.div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-5xl auto-rows-fr">
        
        {/* Upload Photos Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="flex"
        >
          <FileUploader />
        </motion.div>

        {/* Known Face Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="flex"
        >
          <KnownFaceUploader />
        </motion.div>

      </div>
    </motion.div>
  );
}
