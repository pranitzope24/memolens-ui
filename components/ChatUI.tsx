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
        className="relative w-full max-w-3xl bg-white/95 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.06)] rounded-2xl p-6 flex flex-col space-y-4 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* messages list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-6 max-h-[60vh] custom-scroll px-2 "
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center mt-16 text-center space-y-6">
              <p className="text-gray-500 text-lg">
                Ask anything about your photos. Try one of these:
              </p>

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-3 max-w-xl">
                {[
                  "Show me photos of Pranit",
                  "Fetch all the photos taken in Delhi",
                  "Fetch photos of Aryan from Delhi",
                  "Show me photos of mountains",
                ].map((s, idx) => (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInput(s)}
                    className="
            px-4 py-2 rounded-full text-sm
            bg-gray-100 text-gray-700 border border-gray-200
            hover:bg-gray-200 transition shadow-sm
          "
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
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
                    <div className="grid grid-cols-3 gap-4 ml-1">
                      {m.images.map((url, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.18 }}
                          className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 cursor-pointer hover:shadow-md transition"
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

        <div className="flex items-center gap-3 border-t pt-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search your photos..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
              className="w-full py-3 pl-4 pr-11 text-[0.95rem] bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 shadow-inner focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />

            {/* <Send className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
          </div>

          <motion.button
            onClick={handleSend}
            whileTap={{ scale: 0.9 }}
            disabled={loading}
            className="
      p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500
      text-white shadow-md hover:opacity-90 transition
    "
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
            className="
      absolute bottom-24 right-5 
      bg-white/80 backdrop-blur-md 
      border border-gray-200 
      text-gray-700 
      p-2.5 rounded-full 
      shadow-lg hover:bg-white transition
    "
            title="Scroll to bottom"
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
          </motion.button>
        )}
      </motion.div>
    </>
  );
}

export default ChatUI;
