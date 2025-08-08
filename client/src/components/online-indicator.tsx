import { motion } from "framer-motion";

interface OnlineIndicatorProps {
  isOnline: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function OnlineIndicator({ 
  isOnline, 
  size = "md",
  className = "" 
}: OnlineIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        ${sizeClasses[size]}
        ${isOnline ? 'bg-green-400' : 'bg-gray-400'}
        rounded-full
        border-2 border-white
        ${className}
      `}
    >
      {isOnline && (
        <motion.div
          className="w-full h-full bg-green-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
}