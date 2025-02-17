
import { motion } from "framer-motion";
import { useState } from "react";
import JournalEntry from "../components/JournalEntry";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format, isSameDay, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";

interface JournalEntry {
  content: string;
  type: 'incident' | 'feeling' | 'comment' | 'plan';
  date: Date;
  image?: string;
  aiComments?: {
    role: string;
    content: string;
  }[];
}

const Index = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleJournalEntry = async (entry: { 
    content: string; 
    type: 'incident' | 'feeling' | 'comment' | 'plan';
    date: Date;
    image?: File;
  }) => {
    try {
      let imageUrl = "";
      if (entry.image) {
        imageUrl = URL.createObjectURL(entry.image);
      }

      const { data, error } = await supabase.functions.invoke('generate-feedback', {
        body: { 
          content: entry.content, 
          type: entry.type 
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      const newEntry: JournalEntry = {
        ...entry,
        date: entry.date,
        ...(imageUrl && { image: imageUrl }),
        aiComments: data ? [
          {
            role: "心理治療師",
            content: data.therapistFeedback
          },
          {
            role: "生活教練",
            content: data.coachFeedback
          },
          {
            role: "心理健康專家",
            content: data.expertFeedback
          },
          {
            role: "哲學家",
            content: data.philosopherFeedback
          },
          {
            role: "心靈導師",
            content: data.priestFeedback
          }
        ] : undefined
      };

      // Ensure we're adding the new entry while preserving existing entries
      setEntries(prev => {
        // Create a copy of the previous entries array
        const updatedEntries = [...prev];
        // Add the new entry
        updatedEntries.push(newEntry);
        // Sort entries by date to maintain chronological order
        return updatedEntries.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      });
      
      setSelectedDate(entry.date);
      
      toast({
        title: "記錄已儲存！",
        description: "AI 專家已分析您的記錄。",
      });
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "錯誤",
        description: "儲存記錄失敗，請重試。",
        variant: "destructive",
      });
    }
  };

  const filteredEntries = entries.filter(entry => {
    const entryDate = startOfDay(new Date(entry.date));
    const selectedStartOfDay = startOfDay(selectedDate);
    return isSameDay(entryDate, selectedStartOfDay);
  });

  const hasValidAIComments = (entry: JournalEntry) => {
    return entry.aiComments && 
           Array.isArray(entry.aiComments) && 
           entry.aiComments.length > 0 &&
           entry.aiComments.every(comment => comment.role && comment.content);
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
            歡迎使用每日日記
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            你的個人日記與 AI 洞見
          </h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            記錄你的想法，獲得 AI 專業分析。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">日記記錄</h2>
            <JournalEntry onSubmit={handleJournalEntry} />
            
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={`${entry.date}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-border/50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                      {entry.type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), "PPP")}
                    </span>
                  </div>
                  
                  {entry.image && (
                    <div className="mb-4">
                      <img
                        src={entry.image}
                        alt="記錄圖片"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <p className="text-foreground mb-6">{entry.content}</p>
                  
                  {hasValidAIComments(entry) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">專業見解</h3>
                      {entry.aiComments?.map((comment, idx) => (
                        <div key={idx} className="bg-muted p-4 rounded-lg">
                          <h4 className="font-medium text-primary mb-2">{comment.role}</h4>
                          <p className="text-sm text-secondary">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">行事曆</h2>
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-border/50">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
