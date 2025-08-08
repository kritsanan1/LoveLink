import { motion, AnimatePresence } from "framer-motion";
import { User } from "@shared/schema";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User;
  matchedUser?: User;
  onSendMessage: () => void;
  onKeepSwiping: () => void;
}

export default function MatchModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  matchedUser, 
  onSendMessage, 
  onKeepSwiping 
}: MatchModalProps) {
  if (!currentUser || !matchedUser) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-tinder-red to-tinder-orange flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-center text-white p-8 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Match celebration */}
            <div className="relative mb-8">
              <div className="flex justify-center items-center space-x-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={currentUser.photos?.[0] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={matchedUser.photos?.[0] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
                    alt={matchedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Floating heart animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Heart className="w-16 h-16 text-white fill-white animate-pulse" />
              </motion.div>
            </div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mb-4"
            >
              It's a Match!
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8"
            >
              You and {matchedUser.name} like each other
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <Button
                onClick={onSendMessage}
                className="w-full bg-white text-tinder-red py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                size="lg"
              >
                Send Message
              </Button>
              <Button
                onClick={onKeepSwiping}
                variant="outline"
                className="w-full border-2 border-white text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                size="lg"
              >
                Keep Swiping
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
