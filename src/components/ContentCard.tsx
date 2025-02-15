
import { motion } from "framer-motion";

interface ContentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ContentCard = ({ title, description, icon }: ContentCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all duration-300"
    >
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-secondary text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default ContentCard;
