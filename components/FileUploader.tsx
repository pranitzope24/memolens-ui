"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Loader2, Sparkles, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { uploadFile } from "@/lib/apiService";
import LottieWrapper from "@/components/LottieWrapper";
import successAnim from "@/assets/animations/success.json";
// 👉 If you want a Lottie progress animation, tell me and I’ll integrate it.

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);   // NEW
  const [showSuccess, setShowSuccess] = useState(false);     // NEW

  const previews = useMemo(() => {
    return files.map((file) => {
      const id = `${file.name}-${file.size}-${file.lastModified}`;
      return {
        id,
        file,
        url: URL.createObjectURL(file),
      };
    });
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
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
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setShowSuccess(false);

    try {
      let uploaded = 0;

      for (const file of files) {
        await uploadFile(file, (percent) => {
          const totalProgress =
            ((uploaded + percent / 100) / files.length) * 100;
          setUploadProgress(totalProgress);
        });
        uploaded += 1;
      }

      setUploadProgress(100);

      // Show success animation
      setShowSuccess(true);

      // hide animation after 1.8s
      setTimeout(() => {
        setShowSuccess(false);
        setFiles([]);
      }, 1800);

    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      className="w-full h-full p-8 bg-white shadow-xl rounded-2xl border border-gray-100 flex flex-col relative"
      whileHover={{ scale: 1.01 }}
    >
      {/* SUCCESS LOTTIE */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-2xl z-50">
          <LottieWrapper animation={successAnim} className="w-40 h-40" />
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Upload Photos
      </h3>

      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition"
      >
        <Upload className="w-9 h-9 text-gray-400" />
        <p className="text-gray-600 mt-2">Click to select images</p>

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
        <div className="mt-5 grid grid-cols-3 gap-3 flex-1 overflow-y-auto pr-1">
          {previews.map((p) => (
            <motion.div
              key={p.id}
              className="relative rounded-lg bg-gray-100 p-1 overflow-hidden shadow-sm"
              whileHover={{ scale: 1.04 }}
            >
              <button
                onClick={() => removeFile(p.id)}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white"
              >
                <X className="w-3 h-3 text-gray-700" />
              </button>

              <img
                src={p.url}
                alt={p.file.name}
                className="w-full h-24 object-cover rounded-md"
              />

              <p className="truncate text-xs text-center px-1 mt-1">
                {p.file.name}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* PROGRESS BAR */}
      {isUploading && (
        <div className="mt-4 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Upload button */}
      {!showSuccess && (
        <motion.button
          className="mt-5 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
          whileTap={{ scale: 0.95 }}
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
      )}
    </motion.div>
  );
}
