import API_BASE_URL from "@/lib/apiUrl";
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
  FiMessageSquare,
  FiPaperclip,
  FiX
} from 'react-icons/fi';
import { PiSparkleFill } from 'react-icons/pi';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

// --- Types ---
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
};

type ChatSession = {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
};

// --- Mock Data ---
const SUGGESTIONS = [
  { prompt: "Suggest a 5-day itinerary for Bali", category: "Travel Planning" },
  { prompt: "What are the visa requirements for Japan?", category: "Information" },
  { prompt: "Help me pack for a winter trip to Iceland", category: "Preparation" },
  { prompt: "Best hidden gem restaurants in Rome", category: "Local Guide" }
];

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [savedSessions, setSavedSessions] = useState<ChatSession[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;
  const { user } = useAuth();
  const storageKey = user ? `travix_ai_chats_${user.id || user.email}` : null;
  const [feedback, setFeedback] = useState<{ [key: string]: 'like' | 'dislike' }>({});

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
    setFeedback(prev => {
      const current = prev[messageId];
      if (current === type) {
        const updated = { ...prev };
        delete updated[messageId];
        toast.info("Feedback removed");
        return updated;
      } else {
        toast.success(type === 'like' ? "Thanks for your feedback!" : "Feedback submitted.");
        return {
          ...prev,
          [messageId]: type
        };
      }
    });
  };

  const handleRegenerate = async (messageId: string) => {
    const idx = messages.findIndex(m => m.id === messageId);
    if (idx === -1 || idx === 0) return;
    
    const userMsg = messages[idx - 1];
    if (userMsg.role !== 'user') return;

    const historyBefore = messages.slice(0, idx - 1);
    
    setMessages(messages.slice(0, idx));
    setIsThinking(true);

    try {
      const chatHistoryInput = historyBefore.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
        message: userMsg.content,
        history: chatHistoryInput
      });

      if (res.data && res.data.success) {
        const aiMsgId = Date.now().toString();
        setMessages(prev => {
          const userMsgIndex = prev.findIndex(m => m.id === userMsg.id);
          if (userMsgIndex === -1) return prev;
          return [
            ...prev.slice(0, userMsgIndex + 1),
            { 
              id: aiMsgId, 
              role: 'assistant', 
              content: res.data.response 
            }
          ];
        });
        toast.success("Message regenerated!");
      } else {
        throw new Error("Failed to regenerate");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to regenerate message. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    // Load sessions when storageKey changes (user logs in or out)
    if (storageKey) {
      const sessions = localStorage.getItem(storageKey);
      if (sessions) {
        try {
          setSavedSessions(JSON.parse(sessions));
        } catch (e) {
          setSavedSessions([]);
        }
      } else {
        setSavedSessions([]);
      }
    } else {
      setSavedSessions([]);
      setMessages([]);
      setCurrentSessionId(null);
    }
  }, [storageKey]);

  useEffect(() => {
    // Save session when messages change (only if user is logged in)
    if (storageKey && messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      const sessionId = currentSessionId || Date.now().toString();
      if (!currentSessionId) setCurrentSessionId(sessionId);
      
      const firstMsg = messages[0].content;
      const title = firstMsg.substring(0, 30) + (firstMsg.length > 30 ? '...' : '');
      
      const newSession: ChatSession = {
        id: sessionId,
        title,
        updatedAt: Date.now(),
        messages
      };
      
      setSavedSessions(prev => {
        let newSessions = [...prev];
        const sessionIndex = newSessions.findIndex(s => s.id === sessionId);
        
        if (sessionIndex >= 0) {
          newSessions[sessionIndex] = newSession;
        } else {
          newSessions.unshift(newSession);
        }
        
        localStorage.setItem(storageKey, JSON.stringify(newSessions));
        return newSessions;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, storageKey]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setSelectedFile(null);
  };

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
  };

  const todaySessions = savedSessions.filter(s => Date.now() - s.updatedAt < 86400000);
  const olderSessions = savedSessions.filter(s => Date.now() - s.updatedAt >= 86400000);
  const dynamicHistoryGroups = [];
  if (todaySessions.length > 0) dynamicHistoryGroups.push({ label: 'Today', items: todaySessions });
  if (olderSessions.length > 0) dynamicHistoryGroups.push({ label: 'Older', items: olderSessions });

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
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isThinking]);

  // Handle Send
  const handleSend = async () => {
    if (!inputValue.trim() && !selectedFile) return;

    const userMsgText = inputValue.trim();
    let displayContent = userMsgText;
    if (selectedFile) {
      displayContent += displayContent ? `\n\n[Attached File: ${selectedFile.name}]` : `[Attached File: ${selectedFile.name}]`;
    }
    
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: displayContent };
    setMessages(prev => [...prev, newUserMsg]);
    
    const fileToSend = selectedFile;
    setInputValue("");
    setSelectedFile(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setIsThinking(true);
    try {
      // Map previous messages to format expected by backend (role: user/assistant, content: string)
      const chatHistoryInput = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      let res;
      if (fileToSend) {
        const formData = new FormData();
        formData.append("message", userMsgText);
        formData.append("history", JSON.stringify(chatHistoryInput));
        formData.append("file", fileToSend);
        
        res = await axios.post(`${API_BASE_URL}/api/ai/chat`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        res = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
          message: userMsgText,
          history: chatHistoryInput
        });
      }

      if (res.data && res.data.success) {
        const aiMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { 
          id: aiMsgId, 
          role: 'assistant', 
          content: res.data.response 
        }]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error(err);
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { 
        id: aiMsgId, 
        role: 'assistant', 
        content: "Sorry, I encountered an error while processing your request. Please try again." 
      }]);
    } finally {
      setIsThinking(false);
    }
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
            onClick={handleNewChat}
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
            {dynamicHistoryGroups.map((group, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">{group.label}</h4>
                <div className="space-y-0.5">
                  {group.items.map((session, i) => (
                    <button 
                      key={i} 
                      onClick={() => loadSession(session)}
                      className={`w-full flex items-center gap-2 text-left px-2 py-2 text-sm rounded-lg transition-colors truncate
                        ${currentSessionId === session.id ? 'bg-[#1E293B] text-white' : 'text-gray-300 hover:bg-[#1E293B]/60 hover:text-white'}`}
                    >
                      <FiMessageSquare size={14} className="text-gray-500 shrink-0" />
                      <span className="truncate">{session.title}</span>
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
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
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
                    <MessageItem 
                      key={msg.id} 
                      message={msg} 
                      onCopy={handleCopy}
                      onRegenerate={handleRegenerate}
                      onFeedback={handleFeedback}
                      feedbackStatus={feedback[msg.id]}
                    />
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
            
            {/* Selected File Preview */}
            {selectedFile && (
              <div className="absolute -top-10 left-2 bg-white border border-gray-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm text-gray-700">
                <FiPaperclip size={12} className="text-[#E8823C]" />
                <span className="truncate max-w-[200px] font-medium">{selectedFile.name}</span>
                <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-rose-500 transition-colors ml-1">
                  <FiX size={14} />
                </button>
              </div>
            )}
            
            <div className="relative flex items-end bg-white border border-gray-300 focus-within:border-[#E8823C]/40 focus-within:ring-2 focus-within:ring-[#E8823C]/20 rounded-2xl shadow-sm transition-all duration-200">
              {/* File Upload Button */}
              <label className="absolute left-2.5 bottom-2 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-[#E8823C]">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,.pdf,.doc,.docx,.txt" 
                  onChange={(e) => {
                    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                    e.target.value = ''; // Reset input to allow selecting same file again
                  }} 
                />
                <FiPaperclip size={18} />
              </label>

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
                placeholder="Ask anything about your next trip, or upload a document/image..."
                className="w-full max-h-[200px] py-3.5 pl-12 pr-12 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-gray-800 placeholder:text-gray-400 text-[15px]"
                rows={1}
              />
              
              {/* Dynamic Send Button */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() && !selectedFile}
                className={`absolute right-2.5 bottom-2 w-8 h-8 rounded-full transition-all duration-150 flex items-center justify-center
                  ${(inputValue.trim() || selectedFile)
                    ? 'bg-[#E8823C] text-white hover:bg-[#d67332]' 
                    : 'bg-gray-100 cursor-not-allowed'}`}
              >
                {(inputValue.trim() || selectedFile) ? (
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
type MessageItemProps = {
  message: Message;
  onCopy: (content: string) => void;
  onRegenerate: (id: string) => void;
  onFeedback: (id: string, type: 'like' | 'dislike') => void;
  feedbackStatus?: 'like' | 'dislike';
};

function MessageItem({ message, onCopy, onRegenerate, onFeedback, feedbackStatus }: MessageItemProps) {
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
            <ActionBtn 
              icon={<FiCopy />} 
              tooltip="Copy" 
              onClick={() => onCopy(message.content)} 
            />
            <ActionBtn 
              icon={<FiRefreshCw />} 
              tooltip="Regenerate" 
              onClick={() => onRegenerate(message.id)} 
            />
            <ActionBtn 
              icon={<FiThumbsUp className={feedbackStatus === 'like' ? 'text-green-500 fill-green-500/20' : ''} />} 
              tooltip="Helpful" 
              onClick={() => onFeedback(message.id, 'like')} 
            />
            <ActionBtn 
              icon={<FiThumbsDown className={feedbackStatus === 'dislike' ? 'text-rose-500 fill-rose-500/20' : ''} />} 
              tooltip="Not helpful" 
              onClick={() => onFeedback(message.id, 'dislike')} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ icon, tooltip, onClick }: { icon: React.ReactNode, tooltip: string, onClick?: () => void }) {
  return (
    <button 
      title={tooltip} 
      onClick={onClick}
      className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
    >
      {React.cloneElement(icon as React.ReactElement<any>, { size: 15 })}
    </button>
  );
}