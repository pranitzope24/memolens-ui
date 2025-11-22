"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Upload, Loader2, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import LottieWrapper from "@/components/LottieWrapper";

// LOTTIES — your uploaded files
import successAnim from "@/assets/animations/success.json";
import failureAnim from "@/assets/animations/failure.json";

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const previews = useMemo(() => {
    return files.map((file) => {
      const id = `${file.name}-${file.size}-${file.lastModified}`;
      try {
        return { id, file, url: URL.createObjectURL(file) };
      } catch {
        return { id, file, url: null };
      }
    });
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.url) URL.revokeObjectURL(p.url);
      });
    };
  }, [previews]);

  const removeFile = (id: string) => {
    const preview = previews.find((p) => p.id === id);
    if (preview?.url) URL.revokeObjectURL(preview.url);

    setFiles((prev) =>
      prev.filter((f) => `${f.name}-${f.size}-${f.lastModified}` !== id)
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadState("error");
      return;
    }

    setIsUploading(true);

    try {
      // TODO: integrate real upload logic here
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setUploadState("success");
      setFiles([]);
    } catch {
      setUploadState("error");
    }

    setIsUploading(false);
  };

  // Reset animation after it plays ONCE
  const handleAnimComplete = () => {
    setTimeout(() => {
      setUploadState("idle");
    }, 300);
  };
  // return (<></>);
  return (
    <motion.div
      className="w-full max-w-lg p-8 bg-white shadow-lg rounded-2xl border border-gray-100 flex flex-col"
      whileHover={{ scale: 1.01 }}
    >
      <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
        Upload Photos
      </h3>

      {/* Drag & Drop Box */}
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition bg-gray-50"
      >
        <Upload className="w-10 h-10 text-gray-400" />
        <p className="text-gray-600 mt-2">Drag & drop or click to upload</p>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.heic,.heif"
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {/* Previews */}
      {previews.length > 0 && (
        <motion.div
          className="mt-6 grid grid-cols-3 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {previews.map((p) => (
            <motion.div
              key={p.id}
              className="relative rounded-lg bg-gray-100 p-1 flex flex-col items-center overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <button
                onClick={() => removeFile(p.id)}
                className="absolute top-1 right-1 bg-white/90 rounded-full p-1 hover:bg-white"
              >
                <X className="w-3 h-3 text-gray-700" />
              </button>

              {p.url ? (
                <img
                  src={p.url}
                  alt={p.file.name}
                  className="w-full h-24 object-cover rounded-md mb-2"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-500 mb-1" />
              )}

              <p className="truncate max-w-[120px] px-2 text-xs">
                {p.file.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Upload Button */}
      <motion.button
        className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
        whileTap={{ scale: 0.96 }}
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" /> Uploading...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" /> Upload
          </>
        )}
      </motion.button>

      {/* Success Animation */}
      {uploadState === "success" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center mt-5 overflow-visible"
        >
          <LottieWrapper
            animation={successAnim}
            className="w-24 h-24"
            loop={false}
            onComplete={handleAnimComplete}
          />
        </motion.div>
      )}

      {/* Failure Animation */}
      {uploadState === "error" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-5 overflow-visible"
        >
          <LottieWrapper
            animation={failureAnim}
            className="w-24 h-24"
            loop={false}
            onComplete={handleAnimComplete}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
