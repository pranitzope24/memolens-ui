// src/components/ChatUI.tsx
"use client";

import aiTypingAnim from "@/assets/animations/ai.json";
import LottieWrapper from "@/components/LottieWrapper";
import { searchPhotos } from "@/lib/apiService";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ImageViewerModal from "@/components/ImageViewerModal";

interface Message {
  text: string;
  sender: "user" | "bot";
  images?: string[];
  streaming?: boolean;
}

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  // scrolling refs + state
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // open image viewer
  const openViewer = (images: string[], index: number) => {
    setViewerImages(images);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  // Stream text one char at a time into the last message
  const streamMessage = (fullText: string) => {
    let index = 0;
    // Add an interval that updates the last message text
    const interval = setInterval(() => {
      index++;
      setMessages((prev) => {
        if (prev.length === 0) return prev;
        // update the last message
        return prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, text: fullText.slice(0, index) } : m
        );
      });
      if (index >= fullText.length) {
        clearInterval(interval);
        // remove streaming flag from the last message
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, streaming: false } : m
          )
        );
      }
    }, 18); // ~18ms per char -> tweak for speed
  };

  // send message handler
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { text: input.trim(), sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Put a "typing" marker (we'll render Lottie instead of gray bubble)
    setMessages((prev) => [...prev, { text: "__loading__", sender: "bot" }]);

    try {
      const response = await searchPhotos(userMessage.text);

      // drop loading marker
      setMessages((prev) => prev.filter((m) => m.text !== "__loading__"));

      const summary = response.summary || "Here are the results.";
      const photos = response.photos || [];
      const urls = photos.map(
        (p: any) => p.photo_url || p.thumbnail_url || p.url
      );

      // add a bot message placeholder for streaming
      setMessages((prev) => [
        ...prev,
        { text: "", sender: "bot", images: urls, streaming: true },
      ]);

      // stream the summary into the last message
      streamMessage(summary);
    } catch (err: any) {
      // drop loading marker
      setMessages((prev) => prev.filter((m) => m.text !== "__loading__"));

      setMessages((prev) => [
        ...prev,
        { text: "❌ Error: " + (err?.message || "Unknown"), sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // AUTO SCROLL: scroll to bottom when messages change
  useEffect(() => {
    // small delay to let layout update then scroll
    const t = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 40);
    return () => clearTimeout(t);
  }, [messages]);

  // show/hide floating button based on scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 60;
      setShowScrollButton(!atBottom);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    // initial check
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Viewer */}
      {viewerOpen && (
        <ImageViewerModal
          photos={viewerImages}
          activeIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}

      <motion.div
        className="relative w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 flex flex-col space-y-4 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* messages list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-6 max-h-[60vh] custom-scroll px-1"
        >
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center mt-20">
              Start typing to search your photos...
            </p>
          ) : (
            messages.map((m, i) => {
              const isLoadingMarker = m.text === "__loading__";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* TEXT ROW */}
                  <div
                    className={`flex ${
                      m.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {isLoadingMarker ? (
                      // SHOW only the Lottie animation while typing — no gray bubble
                      <div className="flex items-center">
                        <LottieWrapper
                          animation={aiTypingAnim}
                          className="w-12 h-12"
                        />
                      </div>
                    ) : (
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[70%] whitespace-pre-wrap break-words ${
                          m.sender === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {m.text}
                        {/* streaming cursor */}
                        {m.streaming && (
                          <span
                            aria-hidden
                            className="inline-block w-1.5 h-3 bg-gray-500 ml-2 rounded animate-pulse align-middle"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* IMAGES GRID (under the bubble) */}
                  {m.images && m.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 ml-2">
                      {m.images.map((url, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.03 }}
                          className="aspect-square rounded-xl overflow-hidden border shadow-sm bg-gray-100 cursor-pointer"
                          onClick={() => openViewer(m.images!, idx)}
                        >
                          <img
                            src={url}
                            alt={`photo-${idx}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}

          {/* invisible anchor for scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* input row */}
        <div className="flex items-center border-t pt-3">
          <input
            type="text"
            className="flex-1 rounded-xl border-gray-200 focus:ring-0 focus:border-blue-400 text-sm p-2"
            placeholder="Search your photos..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <motion.button
            onClick={handleSend}
            whileTap={{ scale: 0.9 }}
            disabled={loading}
            className={`ml-2 p-2 rounded-full ${
              loading ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            aria-label="send"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        {showScrollButton && (
          <motion.button
            onClick={scrollToBottom}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-20 right-4 bg-white/90 border border-gray-200 
               text-gray-700 p-2 rounded-full shadow-md hover:bg-white transition"
            title="Scroll to bottom"
          >
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                ease: "easeInOut",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </motion.button>
        )}
      </motion.div>
    </>
  );
}

export default ChatUI;
