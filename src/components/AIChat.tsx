
import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface AIChatProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: Array<{ role: 'user' | 'assistant', content: string }>;
}

const AIChat = ({ onSendMessage, messages }: AIChatProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      await onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-border/50"
    >
      <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              msg.role === 'user'
                ? 'bg-primary/10 ml-8'
                : 'bg-muted mr-8'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1"
        />
        <Button type="submit" className="self-end">
          <MessageCircle className="w-4 h-4" />
        </Button>
      </form>
    </motion.div>
  );
};

export default AIChat;
