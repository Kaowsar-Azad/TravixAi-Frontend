"use client";

import { useState } from "react";
import { PiSparkleDuotone, PiPaperPlaneRightDuotone, PiWarningCircleDuotone } from "react-icons/pi";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! I'm your AI travel assistant. How can I help you plan your perfect trip today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages([...newMessages, { role: "assistant", content: "I'm currently in demo mode, but I'd love to help you plan your itinerary! Where are you thinking of going?" }]);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-neutral-bg flex flex-col">
      {/* Header Area */}
      <div className="bg-primary pt-12 pb-24 px-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center rotate-3">
            <PiSparkleDuotone size={32} className="text-white" />
          </div>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-neutral-bg mb-4">
          Travix AI Assistant
        </h1>
        <p className="text-neutral-bg/80 max-w-2xl mx-auto">
          Your personal travel expert. Ask for destination recommendations, customized itineraries, or travel tips.
        </p>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 -mt-12 mb-12 flex flex-col min-h-[500px]">
        <div className="flex-1 bg-surface rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden">
          
          {/* Guest Warning */}
          {!user && (
            <div className="bg-accent/10 border-b border-accent/20 p-4 flex items-center gap-3 text-sm">
              <PiWarningCircleDuotone size={20} className="text-accent shrink-0" />
              <p className="text-text">
                <Link href="/login" className="font-medium text-accent hover:underline">Log in</Link> to save this chat history across sessions and get personalized recommendations.
              </p>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1 shrink-0">
                    <PiSparkleDuotone size={16} className="text-primary" />
                  </div>
                )}
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-[15px] leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-accent text-white rounded-br-none" 
                    : "bg-neutral-bg border border-border text-text rounded-bl-none"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                  <PiSparkleDuotone size={16} className="text-primary" />
                </div>
                <div className="bg-neutral-bg border border-border rounded-2xl rounded-bl-none p-4 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6 border-t border-border bg-surface">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to plan a 5-day trip to Bali..."
                className="w-full pl-6 pr-14 py-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-accent bg-neutral-bg/50 text-text transition-shadow shadow-sm"
              />
              <button 
                type="submit" 
                className="absolute right-2 w-10 h-10 rounded-lg bg-primary text-neutral-bg flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:hover:bg-primary"
                disabled={!input.trim() || isTyping}
              >
                <PiPaperPlaneRightDuotone size={20} />
              </button>
            </form>
            <div className="mt-3 flex gap-2 flex-wrap text-xs text-text-muted justify-center">
              <span className="cursor-pointer hover:text-accent transition-colors">"Suggest budget friendly hostels in Tokyo"</span>
              <span className="hidden sm:inline">•</span>
              <span className="cursor-pointer hover:text-accent transition-colors">"What are the best food options in Paris?"</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
