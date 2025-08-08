import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Crown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoostCard from "./boost-card";

interface BoostManagerProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  superLikesRemaining: number;
  activeBoosts: Array<{
    type: "profile_boost" | "super_boost";
    timeRemaining: string;
  }>;
  onActivateBoost: (type: "super_like" | "profile_boost") => void;
}

export default function BoostManager({
  isOpen,
  onClose,
  isPremium,
  superLikesRemaining,
  activeBoosts,
  onActivateBoost
}: BoostManagerProps) {
  const profileBoost = activeBoosts.find(boost => boost.type === "profile_boost");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[70vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Boosts</h2>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Boost Cards */}
              <div className="space-y-4">
                {/* Super Like */}
                <BoostCard
                  type="super_like"
                  count={superLikesRemaining}
                  onActivate={() => onActivateBoost("super_like")}
                />

                {/* Profile Boost */}
                <BoostCard
                  type="profile_boost"
                  onActivate={() => onActivateBoost("profile_boost")}
                  isActive={!!profileBoost}
                  timeRemaining={profileBoost?.timeRemaining}
                />
              </div>

              {/* Premium Upsell */}
              {!isPremium && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Crown className="w-6 h-6 text-yellow-600" />
                    <h3 className="font-semibold text-gray-800">Premium Boosts</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Premium members get unlimited super likes and priority profile boosting
                  </p>
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
                    Upgrade to Premium
                  </Button>
                </div>
              )}

              {/* How Boosts Work */}
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                <h3 className="font-semibold text-gray-800 mb-3">How Boosts Work</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Super Like:</strong> Stand out with a blue star that shows you really like someone</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Crown className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Profile Boost:</strong> Be one of the top profiles in your area for 30 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}