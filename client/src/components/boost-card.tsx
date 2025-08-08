import { motion } from "framer-motion";
import { Zap, Crown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BoostCardProps {
  type: "super_like" | "profile_boost";
  count?: number;
  onActivate: () => void;
  isActive?: boolean;
  timeRemaining?: string;
}

export default function BoostCard({ 
  type, 
  count = 0, 
  onActivate, 
  isActive = false,
  timeRemaining 
}: BoostCardProps) {
  const boostConfig = {
    super_like: {
      icon: Zap,
      title: "Super Like",
      description: "Stand out with a Super Like",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    profile_boost: {
      icon: Crown,
      title: "Profile Boost",
      description: "Be a top profile for 30 minutes",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    }
  };

  const config = boostConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${config.bgColor} rounded-2xl p-4 border-2 ${
        isActive ? 'border-green-400' : 'border-transparent'
      } transition-colors`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 bg-gradient-to-r ${config.color} rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {config.title}
            </h3>
            <p className="text-sm text-gray-600">
              {config.description}
            </p>
            {type === "super_like" && count > 0 && (
              <p className="text-xs font-medium text-blue-600 mt-1">
                {count} remaining today
              </p>
            )}
            {isActive && timeRemaining && (
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  {timeRemaining} remaining
                </span>
              </div>
            )}
          </div>
        </div>
        
        <Button
          onClick={onActivate}
          disabled={isActive || (type === "super_like" && count === 0)}
          size="sm"
          className={`${
            isActive 
              ? "bg-green-100 text-green-600 cursor-not-allowed" 
              : `bg-gradient-to-r ${config.color} hover:opacity-90`
          } font-semibold rounded-xl px-4`}
        >
          {isActive ? "Active" : type === "super_like" ? "Use" : "Boost"}
        </Button>
      </div>
    </motion.div>
  );
}