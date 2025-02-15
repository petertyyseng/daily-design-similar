
import { motion } from "framer-motion";
import ContentCard from "../components/ContentCard";
import { Calendar, Bell, MessageCircle, Check } from "lucide-react";

const Index = () => {
  const features = [
    {
      title: "Daily Planning",
      description: "Plan your day efficiently with our intuitive interface",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      title: "Smart Reminders",
      description: "Never miss important tasks with intelligent notifications",
      icon: <Bell className="w-6 h-6" />,
    },
    {
      title: "Team Chat",
      description: "Collaborate seamlessly with your team in real-time",
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      title: "Task Management",
      description: "Keep track of your progress with simple task management",
      icon: <Check className="w-6 h-6" />,
    },
  ];

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
            Organize Your Day
          </h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Streamline your daily routine with our intuitive planning tools and stay on top of your tasks effortlessly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ContentCard {...feature} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <button className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
