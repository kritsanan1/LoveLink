import { motion, AnimatePresence } from "framer-motion";
import { Crown, X, Zap, Heart, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const premiumFeatures = [
  {
    icon: Heart,
    title: "Unlimited Likes",
    description: "Like as many profiles as you want"
  },
  {
    icon: Zap,
    title: "5 Super Likes per day",
    description: "Get noticed with Super Likes"
  },
  {
    icon: Eye,
    title: "See Who Likes You",
    description: "Skip the guessing game"
  },
  {
    icon: MapPin,
    title: "Location Passport",
    description: "Swipe around the world"
  },
  {
    icon: Crown,
    title: "Profile Boosts",
    description: "Be the top profile in your area for 30 minutes"
  }
];

export default function PremiumModal({ isOpen, onClose, onUpgrade }: PremiumModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 bg-white rounded-3xl z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    HeartSync Premium
                  </h2>
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

              {/* Hero Section */}
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Unlock Premium Features
                </h3>
                <p className="text-gray-600">
                  Get the most out of your dating experience
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {premiumFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl"
                  >
                    <div className="p-2 bg-gradient-to-r from-tinder-red to-tinder-orange rounded-full">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    $9.99
                    <span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Cancel anytime. No commitment.
                  </p>
                  
                  <Button
                    onClick={onUpgrade}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 rounded-xl text-lg"
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center">
                By upgrading, you agree to our Terms of Service and Privacy Policy. 
                Subscription automatically renews unless cancelled.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}