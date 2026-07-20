import API_BASE_URL from "@/lib/apiUrl";
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import { PiSparkleFill } from 'react-icons/pi';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: "Hi! I'm Travix AI. Need help planning your trip or finding recommendations?"
      }]);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsgText = inputValue.trim();
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userMsgText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsThinking(true);

    try {
      const chatHistoryInput = messages
        .filter(msg => msg.id !== "welcome")
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const res = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
        message: userMsgText,
        history: chatHistoryInput
      });

      if (res.data && res.data.success) {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: res.data.response 
        }]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "Sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-4 py-3 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <PiSparkleFill className="text-[#E8823C]" size={20} />
                <span className="font-semibold text-sm">Travix AI Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FiMinimize2 size={18} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-[#FDFBF7] space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#E8823C] text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E8823C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#E8823C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#E8823C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 bg-white border-t border-gray-200 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder="Ask me anything..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-[#E8823C] focus:ring-1 focus:ring-[#E8823C] transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isThinking}
                  className={`absolute right-1.5 p-1.5 rounded-full transition-colors flex items-center justify-center ${
                    inputValue.trim() && !isThinking
                      ? 'bg-[#E8823C] text-white hover:bg-[#d67332]'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <FiSend size={16} className="-ml-0.5 mt-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors z-50 ${
          isOpen ? 'bg-gray-800 text-white' : 'bg-[#E8823C] text-white hover:bg-[#d67332]'
        }`}
      >
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </motion.button>
    </div>
  );
}
