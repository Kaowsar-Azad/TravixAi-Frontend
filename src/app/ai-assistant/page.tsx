"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiPlus, 
  FiSearch, 
  FiSend, 
  FiCopy, 
  FiRefreshCw, 
  FiThumbsUp, 
  FiThumbsDown, 
  FiMessageSquare
} from 'react-icons/fi';
import { PiSparkleFill } from 'react-icons/pi';

// --- Types ---
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
};

// --- Mock Data ---
const SUGGESTIONS = [
  { prompt: "Suggest a 5-day itinerary for Bali", category: "Travel Planning" },
  { prompt: "What are the visa requirements for Japan?", category: "Information" },
  { prompt: "Help me pack for a winter trip to Iceland", category: "Preparation" },
  { prompt: "Best hidden gem restaurants in Rome", category: "Local Guide" }
];

const HISTORY_GROUPS = [
  { label: "Today", items: ["Bali Itinerary", "Flight cancellation policy"] },
  { label: "Last 7 Days", items: ["Packing list for hiking", "Paris hotels", "Kyoto travel guide"] },
  { label: "Older", items: ["Visa for Turkey", "Weekend getaways near me"] },
];

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle Send
  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Mock Thinking & Streaming
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: "Here is your detailed itinerary...", isStreaming: true }]);
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId ? { ...msg, isStreaming: false, content: "Here is your detailed itinerary. \n\n### Day 1\nArrival and checking into the hotel. Enjoy a relaxed evening at the local market." } : msg
        ));
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] w-full bg-[#FDFBF7] font-sans text-gray-900 overflow-hidden">
      
      {/* ================= SIDEBAR (Twilight Ink) ================= */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-[#0F172A] flex-shrink-0 h-full overflow-hidden z-20"
      >
        <div className="w-[260px] h-full flex flex-col p-4">
          
          {/* New Chat Button */}
          <button 
            onClick={() => setMessages([])}
            className="flex items-center gap-2 w-full bg-[#E8823C] hover:bg-[#d67332] text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm mb-4"
          >
            <FiPlus size={18} />
            New chat
          </button>

          {/* Search */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full bg-[#1E293B] text-gray-200 placeholder:text-gray-500 border border-transparent focus:border-gray-600 focus:outline-none rounded-lg py-2 pl-9 pr-3 text-sm transition-colors"
            />
          </div>

          {/* Chat History Lists */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            {HISTORY_GROUPS.map((group, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">{group.label}</h4>
                <div className="space-y-0.5">
                  {group.items.map((item, i) => (
                    <button key={i} className="w-full flex items-center gap-2 text-left px-2 py-2 text-sm text-gray-300 hover:bg-[#1E293B] hover:text-white rounded-lg transition-colors truncate">
                      <FiMessageSquare size={14} className="text-gray-500 shrink-0" />
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Note: User profile section completely removed from sidebar as requested */}
        </div>
      </motion.aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col relative h-full min-w-0">
        
        {/* Top Navbar */}
        <header className="flex items-center px-4 py-3 bg-[#FDFBF7]/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200/50">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-3"
            title="Toggle Sidebar"
          >
            <FiMenu size={20} />
          </button>
          <h1 className="font-semibold text-gray-800 text-sm">Travix AI Assistant</h1>
        </header>

        {/* Scrollable Messages / Empty State */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 w-full">
            
            <AnimatePresence mode="wait">
              {!hasMessages ? (
                /* --- EMPTY STATE --- */
                <motion.div 
                  key="empty-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center min-h-[50vh]"
                >
                  <h2 className="text-3xl font-bold tracking-tight mb-8 text-center text-gray-900">
                    How can I help you travel better?
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {SUGGESTIONS.map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setInputValue(s.prompt);
                          textareaRef.current?.focus();
                        }}
                        className="group flex flex-col items-start p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#E8823C]/50 hover:shadow-sm transition-all text-left"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <PiSparkleFill className="text-[#E8823C] opacity-70 group-hover:opacity-100 transition-opacity" />
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{s.category}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{s.prompt}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* --- ACTIVE CONVERSATION --- */
                <motion.div 
                  key="active-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col space-y-8 pb-4"
                >
                  {messages.map((msg) => (
                    <MessageItem key={msg.id} message={msg} />
                  ))}
                  
                  {/* Thinking State */}
                  {isThinking && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#0F172A] flex-shrink-0 flex items-center justify-center mt-1">
                        <PiSparkleFill className="text-[#E8823C] text-lg animate-[pulse_2s_ease-in-out_infinite]" />
                      </div>
                      <div className="pt-2 text-sm text-gray-500 font-mono animate-pulse">
                        Travix AI is thinking...
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} className="h-4" />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* ================= FIXED INPUT AREA ================= */}
        <div className="w-full shrink-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7] to-transparent pt-6 pb-6 px-4">
          <div className="max-w-[760px] mx-auto w-full relative">
            
            <div className="relative flex items-end bg-white border border-gray-300 focus-within:border-[#E8823C]/40 focus-within:ring-2 focus-within:ring-[#E8823C]/20 rounded-2xl shadow-sm transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything about your next trip..."
                className="w-full max-h-[200px] py-3.5 pl-4 pr-12 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-gray-800 placeholder:text-gray-400 text-[15px]"
                rows={1}
              />
              
              {/* Dynamic Send Button */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`absolute right-2.5 bottom-2 w-8 h-8 rounded-full transition-all duration-150 flex items-center justify-center
                  ${inputValue.trim() 
                    ? 'bg-[#E8823C] text-white hover:bg-[#d67332]' 
                    : 'bg-gray-100 cursor-not-allowed'}`}
              >
                {inputValue.trim() ? (
                  <FiSend size={15} className="-ml-0.5 mt-0.5" /> 
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                )}
              </button>
            </div>
            
            {/* Guest Access Text */}
            <p className="text-center text-xs text-gray-400 mt-2.5 font-medium">
              No login required — sign in to save your chats.
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}

// --- Message Item Component ---
function MessageItem({ message }: { message: Message }) {
  const isAI = message.role === 'assistant';

  if (!isAI) {
    // USER MESSAGE (Amber Pill)
    return (
      <div className="flex justify-end w-full group">
        <div className="max-w-[80%] bg-[#E8823C]/12 border border-[#E8823C] text-slate-900 px-4 py-2.5 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  // AI MESSAGE (Plain Text + Avatar)
  return (
    <div className="flex items-start gap-4 w-full group">
      {/* Twilight Ink Avatar */}
      <div className="w-8 h-8 rounded-full bg-[#0F172A] flex-shrink-0 flex items-center justify-center mt-1">
        <PiSparkleFill className="text-[#E8823C] text-lg" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="prose prose-slate prose-p:leading-relaxed max-w-none text-gray-800 text-[15px]">
          <div className="whitespace-pre-wrap font-medium">
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 align-middle bg-[#E8823C] animate-[pulse_1s_ease-in-out_infinite] rounded-[1px]" />
            )}
          </div>
        </div>

        {/* Hover Actions */}
        {!message.isStreaming && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ActionBtn icon={<FiCopy />} tooltip="Copy" />
            <ActionBtn icon={<FiRefreshCw />} tooltip="Regenerate" />
            <ActionBtn icon={<FiThumbsUp />} tooltip="Helpful" />
            <ActionBtn icon={<FiThumbsDown />} tooltip="Not helpful" />
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ icon, tooltip }: { icon: React.ReactNode, tooltip: string }) {
  return (
    <button title={tooltip} className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 15 })}
    </button>
  );
}