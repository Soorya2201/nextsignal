import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";

interface ChatMessageProps {
  content: string;
  timestamp: string;
  isUser?: boolean;
  sender?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  images?: string[];
}

export function ChatMessage({ 
  content, 
  timestamp, 
  isUser = false, 
  sender,
  images 
}: ChatMessageProps) {
  return (
    <div className={cn(
      "flex gap-3 animate-slide-up",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {sender?.avatar && !isUser && (
        <Avatar src={sender.avatar} alt={sender.name} size="md" status="online" />
      )}
      
      <div className={cn(
        "flex flex-col",
        isUser ? "items-end" : "items-start"
      )}>
        {sender && !isUser && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-primary">{sender.name}</span>
            {sender.role && (
              <span className="text-xs text-muted-foreground">{sender.role}</span>
            )}
          </div>
        )}
        
        <div className={cn(
          "chat-bubble",
          isUser ? "chat-bubble-user" : "chat-bubble-bot"
        )}>
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
        
        {images && images.length > 0 && (
          <div className={cn(
            "grid gap-2 mt-2",
            images.length === 1 && "grid-cols-1",
            images.length === 2 && "grid-cols-2",
            images.length >= 3 && "grid-cols-2"
          )}>
            {images.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt="Shared image" 
                className="rounded-xl object-cover w-full h-32"
              />
            ))}
          </div>
        )}
        
        <span className="text-xs text-muted-foreground mt-1">{timestamp}</span>
      </div>
      
      {isUser && sender?.avatar && (
        <Avatar src={sender.avatar} alt={sender.name} size="md" status="online" />
      )}
    </div>
  );
}
