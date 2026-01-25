import { useState, useRef, useEffect } from "react";
import { ArrowLeft, MoreVertical, Smile, Paperclip, Mic, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { ChatMessage } from "@/components/ChatMessage";
import { SOSBadge } from "@/components/SOSBadge";

import avatar1 from "@/assets/avatars/avatar-1.jpg";
import avatar2 from "@/assets/avatars/avatar-2.jpg";
import logo from "@/assets/logo.png";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isUser: boolean;
  sender?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  images?: string[];
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "The Forest Fire has started, from the west start evacuating from 9:00 AM PST to avoid Commotion.",
    timestamp: "16:04",
    isUser: false,
    sender: {
      name: "Mike Mazowski",
      avatar: avatar2,
      role: "admin",
    },
  },
  {
    id: "2",
    content: "Can I leave at 9 AM PST?",
    timestamp: "16:04",
    isUser: true,
    sender: {
      name: "You",
      avatar: avatar1,
    },
  },
  {
    id: "3",
    content: "Yes, that would be ideal. Please use the East exit and follow the evacuation markers. I'll send you the safest route now.",
    timestamp: "16:05",
    isUser: false,
    sender: {
      name: "Next Signal Bot",
      avatar: logo,
      role: "AI Assistant",
    },
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
      sender: {
        name: "You",
        avatar: avatar1,
      },
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your concern. Based on current conditions, I recommend taking the stairwell B route. It's currently clear and leads directly to the assembly point. Would you like me to share the route map?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUser: false,
        sender: {
          name: "Next Signal Bot",
          avatar: logo,
          role: "AI Assistant",
        },
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="mobile-container flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 bg-card border-b border-border">
        <Link to="/" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <SOSBadge size="md" pulse />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg text-foreground">Next SIGNAL</h1>
          <p className="text-xs text-status-safe flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-status-safe" />
            1 update
          </p>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            timestamp={message.timestamp}
            isUser={message.isUser}
            sender={message.sender}
            images={message.images}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Channel indicator */}
      <div className="px-4 py-2 bg-card border-t border-border">
        <button className="flex items-center gap-2 text-sm text-primary font-medium">
          <span className="text-muted-foreground">#</span>
          General
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* Input */}
      <div className="p-4 bg-card border-t border-border mb-16">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>
          <input
            type="text"
            placeholder="Write a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="input-message"
          />
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          <button 
            onClick={handleSend}
            className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform"
          >
            {input.trim() ? <Send className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
