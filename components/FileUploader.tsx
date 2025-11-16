"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Loader2, Sparkles, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

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
    setFiles((prev) => prev.filter((f) => `${f.name}-${f.size}-${f.lastModified}` !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadStatus("📸 Please select at least one image to upload.");
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    // 🔧 Backend not ready yet → show "Coming Soon"
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsUploading(false);
    setUploadStatus("🚧 This feature is coming soon! Stay tuned.");

    // Optionally clear selected files after showing message
    setFiles([]);
  };

  return (
    <motion.div
      className="w-full max-w-lg p-8 bg-white shadow-lg rounded-2xl border border-gray-100"
      whileHover={{ scale: 1.02 }}
    >
      {/* Upload area */}
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition"
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
              className="relative rounded-lg bg-gray-100 p-1 flex flex-col items-center text-sm overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <button
                onClick={() => removeFile(p.id)}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white"
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
              <p className="truncate max-w-[120px] px-2">{p.file.name}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Upload button */}
      <motion.button
        className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
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

      {/* Status message */}
      {uploadStatus && (
        <p
          className={`mt-4 text-center text-sm ${
            uploadStatus.includes("🚧")
              ? "text-blue-600"
              : uploadStatus.includes("❌")
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {uploadStatus}
        </p>
      )}
    </motion.div>
  );
}
