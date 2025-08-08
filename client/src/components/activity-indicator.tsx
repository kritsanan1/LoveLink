import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface ActivityIndicatorProps {
  lastActive: Date | string;
  className?: string;
}

function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return "1w+ ago";
}

function getActivityColor(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffHours = (now.getTime() - then.getTime()) / (1000 * 60 * 60);
  
  if (diffHours < 1) return "text-green-500";
  if (diffHours < 24) return "text-yellow-500";
  return "text-gray-500";
}

export default function ActivityIndicator({ lastActive, className = "" }: ActivityIndicatorProps) {
  const timeAgo = getTimeAgo(lastActive);
  const colorClass = getActivityColor(lastActive);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center space-x-1 ${className}`}
    >
      <Clock className={`w-3 h-3 ${colorClass}`} />
      <span className={`text-xs ${colorClass}`}>
        {timeAgo}
      </span>
    </motion.div>
  );
}