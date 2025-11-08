"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    // Future: Add API call here
  };

  return (
    <motion.div
      className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 flex flex-col space-y-4 border border-gray-100"
      layout
    >
      <div className="flex-1 overflow-y-auto space-y-3 max-h-[60vh] scrollbar-thin">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-20">
            Start typing to search your photos...
          </p>
        ) : (
          messages.map((m, i) => (
            <motion.div
              key={i}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="flex items-center border-t pt-3">
        <input
          type="text"
          className="flex-1 rounded-xl border-gray-200 focus:ring-0 focus:border-blue-400 text-sm p-2"
          placeholder="Search your photos..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <motion.button
          onClick={handleSend}
          whileTap={{ scale: 0.9 }}
          className="ml-2 p-2 rounded-full bg-blue-500 text-white"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
