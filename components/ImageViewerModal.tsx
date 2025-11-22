"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function ImageViewerModal({
  photos,
  activeIndex,
  onClose,
}: {
  photos: string[];
  activeIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(activeIndex);

  const next = () => setIndex((i) => (i + 1) % photos.length);
  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl p-4 relative w-[90vw] max-w-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image */}
          <img
            src={photos[index]}
            className="rounded-xl w-full max-h-[70vh] object-contain"
          />

          {/* Prev Button */}
          <button
            onClick={prev}
            className="absolute top-1/2 left-3 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={next}
            className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* 🔢 Image Count Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-700 bg-white/80 px-3 py-1 rounded-full shadow">
            {index + 1} / {photos.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
