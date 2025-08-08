import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: UserPreferences) => void;
  currentPreferences?: UserPreferences;
}

interface UserPreferences {
  dealBreakers: string[];
  lifestylePrefs: {
    smoking: string;
    drinking: string;
    exercise: string;
    pets: string;
  };
  notifications: {
    matches: boolean;
    messages: boolean;
    likes: boolean;
    superLikes: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  dealBreakers: [],
  lifestylePrefs: {
    smoking: "never",
    drinking: "socially",
    exercise: "sometimes",
    pets: "love_them"
  },
  notifications: {
    matches: true,
    messages: true,
    likes: true,
    superLikes: true
  }
};

export default function PreferencesModal({ 
  isOpen, 
  onClose, 
  onSave,
  currentPreferences = defaultPreferences
}: PreferencesModalProps) {
  const [preferences, setPreferences] = useState(currentPreferences);

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  const dealBreakerOptions = [
    "Smoking", "Heavy Drinking", "No Education", "Unemployed", 
    "Lives with Parents", "Has Kids", "Wants Kids", "Different Religion"
  ];

  const toggleDealBreaker = (dealBreaker: string) => {
    setPreferences(prev => ({
      ...prev,
      dealBreakers: prev.dealBreakers.includes(dealBreaker)
        ? prev.dealBreakers.filter(db => db !== dealBreaker)
        : [...prev.dealBreakers, dealBreaker]
    }));
  };

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
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Settings className="w-6 h-6 text-tinder-red" />
                  <h2 className="text-2xl font-bold text-gray-800">Preferences</h2>
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

              {/* Deal Breakers */}
              <div className="mb-6">
                <Label className="text-lg font-semibold text-gray-700 mb-3 block">
                  Deal Breakers
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {dealBreakerOptions.map((dealBreaker) => (
                    <button
                      key={dealBreaker}
                      onClick={() => toggleDealBreaker(dealBreaker)}
                      className={`p-2 rounded-lg text-sm transition-colors ${
                        preferences.dealBreakers.includes(dealBreaker)
                          ? "bg-red-100 text-red-700 border-2 border-red-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {dealBreaker}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lifestyle Preferences */}
              <div className="mb-6">
                <Label className="text-lg font-semibold text-gray-700 mb-4 block">
                  Lifestyle Preferences
                </Label>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-2 block">Smoking</Label>
                    <Select 
                      value={preferences.lifestylePrefs.smoking} 
                      onValueChange={(value) => setPreferences(prev => ({ 
                        ...prev, 
                        lifestylePrefs: { ...prev.lifestylePrefs, smoking: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="occasionally">Occasionally</SelectItem>
                        <SelectItem value="regularly">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-2 block">Drinking</Label>
                    <Select 
                      value={preferences.lifestylePrefs.drinking} 
                      onValueChange={(value) => setPreferences(prev => ({ 
                        ...prev, 
                        lifestylePrefs: { ...prev.lifestylePrefs, drinking: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="socially">Socially</SelectItem>
                        <SelectItem value="regularly">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-2 block">Exercise</Label>
                    <Select 
                      value={preferences.lifestylePrefs.exercise} 
                      onValueChange={(value) => setPreferences(prev => ({ 
                        ...prev, 
                        lifestylePrefs: { ...prev.lifestylePrefs, exercise: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="sometimes">Sometimes</SelectItem>
                        <SelectItem value="regularly">Regularly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-2 block">Pets</Label>
                    <Select 
                      value={preferences.lifestylePrefs.pets} 
                      onValueChange={(value) => setPreferences(prev => ({ 
                        ...prev, 
                        lifestylePrefs: { ...prev.lifestylePrefs, pets: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="love_them">Love them</SelectItem>
                        <SelectItem value="like_them">Like them</SelectItem>
                        <SelectItem value="allergic">Allergic</SelectItem>
                        <SelectItem value="no_pets">Don't want pets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="mb-8">
                <Label className="text-lg font-semibold text-gray-700 mb-4 block">
                  Notifications
                </Label>
                <div className="space-y-4">
                  {Object.entries(preferences.notifications).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, [key]: checked }
                        }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                className="w-full gradient-bg text-white font-semibold py-3 rounded-xl"
              >
                Save Preferences
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}