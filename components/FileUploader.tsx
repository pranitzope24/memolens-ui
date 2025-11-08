"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);

  // Generate preview URLs for image files and stable ids per file
  const previews = useMemo(() => {
    return files.map((file) => {
      const id = `${file.name}-${file.size}-${file.lastModified}`;
      try {
        return {
          id,
          file,
          // createObjectURL works for most image types
          url: URL.createObjectURL(file),
        };
      } catch (e) {
        return { id, file, url: null };
      }
    });
  }, [files]);

  // Track previews that failed to load so we can show a fallback
  const [erroredPreviews, setErroredPreviews] = useState<Record<string, boolean>>({});

  // Revoke object URLs when files change or on unmount
  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.url) URL.revokeObjectURL(p.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // Remove a single file (and revoke its object URL)
  const removeFile = (id: string) => {
    const preview = previews.find((p) => p.id === id);
    if (preview && preview.url) {
      try {
        URL.revokeObjectURL(preview.url);
      } catch (e) {
        /* ignore */
      }
    }
    setFiles((prev) => prev.filter((f) => `${f.name}-${f.size}-${f.lastModified}` !== id));
    setErroredPreviews((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const inputFiles = Array.from(e.target.files);

    // Process HEIC/HEIF files: convert them client-side to JPEG using heic2any
    const convertAndSet = async () => {
      const converted = await Promise.all(
        inputFiles.map(async (file) => {
          const name = file.name.toLowerCase();
          const isHeic = name.endsWith(".heic") || name.endsWith(".heif") || file.type === "image/heic";
          if (!isHeic) return file;

          try {
            const mod = await import(/* webpackChunkName: "heic2any" */ "heic2any");
            const heic2any = (mod as any).default ?? mod;
            const blob: Blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
            const jpgName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
            const jpgFile = new File([blob], jpgName, { type: "image/jpeg", lastModified: Date.now() });
            return jpgFile;
          } catch (err) {
            // If conversion fails, fall back to the original file so user can still download it
            // Marking preview as errored will show a download link
            return file;
          }
        })
      );

      setFiles(converted);
    };

    void convertAndSet();
  };

  return (
    <motion.div
      className="w-full max-w-lg p-8 bg-white shadow-lg rounded-2xl border border-gray-100"
      whileHover={{ scale: 1.02 }}
    >
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

      {files.length > 0 && (
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
              {/* remove button */}
              <button
                onClick={() => removeFile(p.id)}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white"
                aria-label={`Remove ${p.file.name}`}
                title="Remove"
              >
                <X className="w-3 h-3 text-gray-700" />
              </button>

              {p.url && !erroredPreviews[p.id] ? (
                <img
                  src={p.url}
                  alt={p.file.name}
                  className="w-full h-24 object-cover rounded-md mb-2"
                  onError={() => setErroredPreviews((s) => ({ ...s, [p.id]: true }))}
                />
              ) : p.url && erroredPreviews[p.id] ? (
                <div className="w-full h-24 flex items-center justify-center rounded-md bg-white/60 mb-2">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-1" />
                    <a
                      href={p.url}
                      download={p.file.name}
                      className="text-xs text-blue-600 underline"
                    >
                      Download
                    </a>
                    <div className="text-xs text-gray-500">Preview not available</div>
                  </div>
                </div>
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-500 mb-1" />
              )}
              <p className="truncate max-w-[120px] px-2">{p.file.name}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.button
        className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
        whileTap={{ scale: 0.95 }}
      >
        Upload
      </motion.button>
    </motion.div>
  );
}
