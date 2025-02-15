
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface JournalEntryProps {
  onSubmit: (entry: {
    content: string;
    type: 'incident' | 'feeling' | 'comment' | 'plan';
  }) => void;
}

const JournalEntry = ({ onSubmit }: JournalEntryProps) => {
  const [content, setContent] = useState("");
  const [type, setType] = useState<'incident' | 'feeling' | 'comment' | 'plan'>('feeling');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({ content, type });
      setContent("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-border/50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 mb-4">
          {(['incident', 'feeling', 'comment', 'plan'] as const).map((t) => (
            <Button
              key={t}
              type="button"
              variant={type === t ? "default" : "outline"}
              onClick={() => setType(t)}
              className="capitalize"
            >
              {t}
            </Button>
          ))}
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts..."
          className="min-h-[120px]"
        />
        <Button type="submit" className="w-full">
          Save Entry
        </Button>
      </form>
    </motion.div>
  );
};

export default JournalEntry;
