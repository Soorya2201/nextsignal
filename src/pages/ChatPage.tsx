import { useState, useRef, useEffect } from "react";
import { ArrowLeft, MoreVertical, Smile, Paperclip, Mic, Send, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { BottomNav } from "@/components/BottomNav";
import { Avatar } from "@/components/Avatar";
import { SOSBadge } from "@/components/SOSBadge";
import { useAIChat } from "@/hooks/useAIChat";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import avatar1 from "@/assets/avatars/avatar-1.jpg";

export default function ChatPage() {
  const { messages, isLoading, sendMessage, clearChat } = useAIChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="mobile-container flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-lg border-b border-border">
        <Link to="/" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <SOSBadge size="md" pulse />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg text-foreground">Next SIGNAL</h1>
          <p className="text-xs text-status-safe flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-status-safe animate-pulse" />
            AI Assistant Online
          </p>
        </div>
        <button 
          onClick={clearChat}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-secondary/10">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-xl opacity-30" />
              <img src={logo} alt="Next Signal" className="relative w-24 h-24 rounded-3xl" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              Next Signal AI Assistant
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              I'm here to help you stay safe during emergencies. Ask me about evacuation routes, safety tips, or any emergency-related questions.
            </p>
            <div className="mt-6 space-y-2 w-full max-w-xs">
              {[
                "What should I do during a fire?",
                "How do I prepare an emergency kit?",
                "What are the evacuation routes?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="w-full p-3 text-sm text-left rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-slide-up",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {message.role === "assistant" && (
                <Avatar src={logo} alt="AI" size="md" status="online" />
              )}
              
              <div className={cn(
                "flex flex-col",
                message.role === "user" ? "items-end" : "items-start"
              )}>
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-primary">Next Signal Bot</span>
                    <span className="text-xs text-muted-foreground">AI Assistant</span>
                  </div>
                )}
                
                <div className={cn(
                  "chat-bubble",
                  message.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"
                )}>
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  )}
                </div>
                
                <span className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              
              {message.role === "user" && (
                <Avatar src={avatar1} alt="You" size="md" status="online" />
              )}
            </div>
          ))
        )}
        
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3 animate-slide-up">
            <Avatar src={logo} alt="AI" size="md" status="online" />
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-primary">Next Signal Bot</span>
                <span className="text-xs text-muted-foreground">typing...</span>
              </div>
              <div className="chat-bubble chat-bubble-bot">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-card/80 backdrop-blur-lg border-t border-border mb-16">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>
          <input
            type="text"
            placeholder="Ask about safety or emergencies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="input-message"
            disabled={isLoading}
          />
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {input.trim() ? <Send className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
