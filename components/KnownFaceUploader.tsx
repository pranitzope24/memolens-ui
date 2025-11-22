"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Upload, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { addKnownFace } from "@/lib/apiService";

export function KnownFaceUploader() {
  const [personName, setPersonName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file || !personName.trim()) {
      setStatus("❌ Please enter a name and upload a face image.");
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      await addKnownFace(personName, file);
      setStatus("✅ Face added successfully!");

      setFile(null);
      setPersonName("");
      setPreview(null);
    } catch (err: any) {
      setStatus("❌ Failed: " + err.message);
    }

    setIsUploading(false);
  };

  return (
    <motion.div
      className="w-full h-full p-8 bg-white shadow-xl rounded-2xl border border-gray-100 flex flex-col"
      whileHover={{ scale: 1.01 }}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Known Face</h3>

      {/* Name Field */}
      <input
        type="text"
        placeholder="Enter person's name"
        className="w-full px-3 py-2 border rounded-lg mb-4 focus:border-blue-500 outline-none"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
      />

      {/* Upload */}
      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition">
        <Upload className="w-9 h-9 text-gray-400" />
        <p className="text-gray-600 mt-2">Upload face image</p>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>

      {/* Preview */}
      {preview && (
        <div className="mt-4 flex justify-center">
          <img
            src={preview}
            className="w-32 h-32 object-cover rounded-xl shadow"
            alt="preview"
          />
        </div>
      )}

      {/* Upload Button */}
      <motion.button
        className="mt-5 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
        whileTap={{ scale: 0.95 }}
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" /> Saving...
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" /> Save Known Face
          </>
        )}
      </motion.button>

      {status && (
        <p className="mt-3 text-center text-sm text-gray-700">{status}</p>
      )}
    </motion.div>
  );
}
