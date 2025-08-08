import { motion } from "framer-motion";
import { Heart, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LikeCounterProps {
  likesRemaining: number;
  isPremium: boolean;
  onUpgrade: () => void;
}

export default function LikeCounter({ 
  likesRemaining, 
  isPremium, 
  onUpgrade 
}: LikeCounterProps) {
  if (isPremium) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full border border-yellow-200">
        <Crown className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-medium text-yellow-800">
          Unlimited Likes
        </span>
      </div>
    );
  }

  const isLow = likesRemaining <= 3;
  const isEmpty = likesRemaining === 0;

  return (
    <motion.div
      animate={isEmpty ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, repeat: isEmpty ? Infinity : 0 }}
      className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${
        isEmpty
          ? "bg-red-50 border-red-200"
          : isLow
          ? "bg-orange-50 border-orange-200"
          : "bg-green-50 border-green-200"
      }`}
    >
      <Heart 
        className={`w-4 h-4 ${
          isEmpty
            ? "text-red-500"
            : isLow
            ? "text-orange-500"
            : "text-green-500"
        }`} 
      />
      <span className={`text-sm font-medium ${
        isEmpty
          ? "text-red-700"
          : isLow
          ? "text-orange-700"
          : "text-green-700"
      }`}>
        {isEmpty ? "0 likes left" : `${likesRemaining} likes`}
      </span>
      
      {(isEmpty || isLow) && (
        <Button
          onClick={onUpgrade}
          size="sm"
          className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-xs px-2 py-1 h-auto"
        >
          Get More
        </Button>
      )}
    </motion.div>
  );
}