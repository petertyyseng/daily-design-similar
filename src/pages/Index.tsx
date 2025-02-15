
import { motion } from "framer-motion";
import { useState } from "react";
import ContentCard from "../components/ContentCard";
import JournalEntry from "../components/JournalEntry";
import AIChat from "../components/AIChat";
import { Calendar, Bell, MessageCircle, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [entries, setEntries] = useState<Array<{
    content: string;
    type: 'incident' | 'feeling' | 'comment' | 'plan';
    feedback?: string;
  }>>([]);

  const handleJournalEntry = async (entry: { content: string; type: 'incident' | 'feeling' | 'comment' | 'plan' }) => {
    try {
      const response = await fetch("/api/generate-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: entry.content, type: entry.type }),
      });

      const data = await response.json();
      
      setEntries([...entries, { ...entry, feedback: data.feedback }]);
      toast({
        title: "Entry saved!",
        description: "AI feedback has been generated for your entry.",
      });
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAIChat = async (message: string) => {
    try {
      setMessages([...messages, { role: 'user', content: message }]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error("Error in AI chat:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4">
            Welcome to Daily
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Your Personal Journal & AI Assistant
          </h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Document your thoughts, get AI feedback, and chat with your personal AI assistant.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Journal Entry</h2>
            <JournalEntry onSubmit={handleJournalEntry} />
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-border/50"
                >
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                      {entry.type}
                    </span>
                  </div>
                  <p className="text-foreground mb-4">{entry.content}</p>
                  {entry.feedback && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-secondary">{entry.feedback}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">AI Assistant</h2>
            <AIChat onSendMessage={handleAIChat} messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
