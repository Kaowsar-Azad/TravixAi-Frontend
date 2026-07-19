"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiSparkleDuotone, PiXDuotone, PiPaperPlaneRightDuotone } from "react-icons/pi";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface AIChatWidgetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AIChatWidget({ isOpen, setIsOpen }: AIChatWidgetProps) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! I'm your AI travel assistant. How can I help you plan your perfect trip today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    // Simulate AI response for UI demonstration
    setTimeout(() => {
      setMessages([...newMessages, { role: "assistant", content: "I'm currently in demo mode, but I'd love to help you plan your itinerary! Where are you thinking of going?" }]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-4 w-[350px] sm:w-[400px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-surface border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-primary text-neutral-bg p-4 flex justify-between items-start">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <PiSparkleDuotone size={20} className="text-accent" />
                <h3 className="font-display font-semibold text-lg">Travix AI Assistant</h3>
              </div>
              <p className="text-xs text-neutral-bg/70 mt-1">Ask me anything about your travel plans.</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-neutral-bg hover:text-accent p-1">
              <PiXDuotone size={20} />
            </button>
          </div>

          {/* Guest Prompt */}
          {!user && !dismissed && (
            <div className="bg-accent/10 border-b border-accent/20 p-3 flex items-start justify-between gap-3 text-sm">
              <p className="text-text">
                <Link href="/login" className="font-medium text-accent hover:underline">Log in</Link> to save this chat and get sharper personalized recommendations.
              </p>
              <button onClick={() => setDismissed(true)} className="text-text-muted hover:text-text shrink-0">
                <PiXDuotone size={16} />
              </button>
            </div>
          )}

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-neutral-bg/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-accent text-white rounded-br-none" 
                    : "bg-surface border border-border text-text rounded-bl-none shadow-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-border bg-surface flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about destinations..."
              className="flex-1 h-10 px-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent text-sm bg-neutral-bg/50 text-text"
            />
            <button 
              type="submit" 
              className="w-10 h-10 rounded-lg bg-primary text-neutral-bg flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-50"
              disabled={!input.trim()}
            >
              <PiPaperPlaneRightDuotone size={20} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
