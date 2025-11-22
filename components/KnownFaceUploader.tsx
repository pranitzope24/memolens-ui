"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, UserPlus, X } from "lucide-react";
import LottieWrapper from "@/components/LottieWrapper";

import successAnim from "@/assets/animations/success.json";
import failureAnim from "@/assets/animations/failure.json";
import { addKnownFace } from "@/lib/apiService";

export function KnownFaceUploader() {
  const [personName, setPersonName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (uploadState === "success" || uploadState === "error") {
      const timer = setTimeout(() => setUploadState("idle"), 1800);
      return () => clearTimeout(timer);
    }
  }, [uploadState]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const f = e.target.files[0];

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setUploadState("idle");
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!file || !personName.trim()) {
      setUploadState("error");
      return;
    }

    setUploadState("uploading");

    try {
      await addKnownFace(personName, file);
      setUploadState("success");

      setFile(null);
      setPreview(null);
      setPersonName("");
    } catch {
      setUploadState("error");
    }
  };

  return (
    <motion.div
      className="w-full p-6 bg-white shadow-lg rounded-2xl border border-gray-100 flex flex-col"
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.01 }}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        Add Known Face
      </h3>

      <input
        type="text"
        placeholder="Enter person's name"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        className="
    w-full px-3 py-2 mb-4
    rounded-lg 
    border border-gray-200 
    bg-gray-50 
    text-gray-800 
    shadow-sm 
    focus:bg-white 
    focus:border-blue-500 
    focus:ring-4 focus:ring-blue-100 
    transition-all
    placeholder:text-gray-400
  "
      />

      {/* Upload box */}
      <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl cursor-pointer hover:border-blue-400 transition">
        <Upload className="w-9 h-9 text-gray-400" />
        <p className="text-gray-600 mt-2">Upload face image</p>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </label>

      {preview && (
        <div className="relative flex justify-center mt-4">
          <img
            src={preview}
            className="w-28 h-28 object-cover rounded-xl shadow-md"
          />
          <button
            onClick={removeFile}
            className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow hover:bg-white"
          >
            <X className="w-4 h-4 text-gray-800" />
          </button>
        </div>
      )}

      {/* Button */}
      <motion.button
        onClick={handleUpload}
        disabled={uploadState === "uploading"}
        whileTap={{ scale: 0.96 }}
        className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
      >
        {uploadState === "uploading" ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" /> Saving...
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" /> Save Known Face
          </>
        )}
      </motion.button>

      {/* Animations */}
      {uploadState === "success" && (
        <div className="flex justify-center mt-4">
          <LottieWrapper
            animation={successAnim}
            className="w-20 h-20"
            loop={false}
          />
        </div>
      )}
      {uploadState === "error" && (
        <div className="flex justify-center mt-4">
          <LottieWrapper
            animation={failureAnim}
            className="w-20 h-20"
            loop={false}
          />
        </div>
      )}
    </motion.div>
  );
}
