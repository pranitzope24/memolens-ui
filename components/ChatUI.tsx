"use client";

import typingAnim from "@/assets/animations/chat.json";
import LottieWrapper from "@/components/LottieWrapper";
import { searchPhotos } from "@/lib/apiService";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
  images?: string[];
}

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Show typing animation
    setMessages((prev) => [...prev, { text: "__loading__", sender: "bot" }]);

    try {
      const response = await searchPhotos(input);

      // Remove loader
      setMessages((prev) => prev.filter((m) => m.text !== "__loading__"));

      const summary = response.summary || "Here are the results.";
      const photos = response.photos || [];

      // Extract URLs
      const urls = photos.map((p: any) => p.thumbnail_url);

      const botMessage: Message = {
        text: summary,
        sender: "bot",
        images: urls,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { text: "❌ Error: " + error.message, sender: "bot" },
      ]);
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 flex flex-col space-y-4 border border-gray-100"
      layout
    >
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto space-y-6 max-h-[60vh] scrollbar-thin">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-20">
            Start typing to search your photos...
          </p>
        ) : (
          messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Chat Bubble */}
              <div
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {m.text !== "__loading__" ? (
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs whitespace-pre-wrap ${m.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {m.text}
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-2xl p-2 px-4 flex items-center justify-center w-20">
                    <LottieWrapper animation={typingAnim} className="w-12 h-6" />
                  </div>
                )}
              </div>

              {/* Image Grid */}
              {m.images && m.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 ml-2">
                  {m.images.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="thumbnail"
                      className="rounded-xl w-full h-auto border shadow-sm object-contain bg-gray-50"
                    />
                  ))}
                </div>

              )}
            </motion.div>
          ))
        )}
      </div>

      {/* INPUT BAR */}
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
          className={`ml-2 p-2 rounded-full ${loading ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
