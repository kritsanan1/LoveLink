import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SAMPLE_INTERESTS } from "@/lib/constants";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    ageRange: [number, number];
    maxDistance: number;
    interests: string[];
    education: string;
    lookingFor: string;
  }) => void;
  currentFilters?: {
    ageRange: [number, number];
    maxDistance: number;
    interests: string[];
    education: string;
    lookingFor: string;
  };
}

export default function FilterModal({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  currentFilters = {
    ageRange: [18, 35],
    maxDistance: 25,
    interests: [],
    education: "any",
    lookingFor: "serious"
  }
}: FilterModalProps) {
  const [filters, setFilters] = useState(currentFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters = {
      ageRange: [18, 35] as [number, number],
      maxDistance: 25,
      interests: [],
      education: "any",
      lookingFor: "serious"
    };
    setFilters(defaultFilters);
  };

  const toggleInterest = (interest: string) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
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
                  <Sliders className="w-6 h-6 text-tinder-red" />
                  <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
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

              {/* Age Range */}
              <div className="mb-6">
                <Label className="text-lg font-semibold text-gray-700 mb-3 block">
                  Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
                </Label>
                <Slider
                  value={filters.ageRange}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    ageRange: value as [number, number] 
                  }))}
                  max={65}
                  min={18}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Max Distance */}
              <div className="mb-6">
                <Label className="text-lg font-semibold text-gray-700 mb-3 block">
                  Distance: {filters.maxDistance} km
                </Label>
                <Slider
                  value={[filters.maxDistance]}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    maxDistance: value[0] 
                  }))}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Looking For */}
              <div className="mb-6">
                <Label className="text-lg font-semibold text-gray-700 mb-3 block">
                  Looking For
                </Label>
                <Select 
                  value={filters.lookingFor} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, lookingFor: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="What are you looking for?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serious">Serious Relationship</SelectItem>
                    <SelectItem value="casual">Casual Dating</SelectItem>
                    <SelectItem value="friendship">Friendship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Education */}
              <div className="mb-6">
                <Label className="text-lg font-semibold text-gray-700 mb-3 block">
                  Education
                </Label>
                <Select 
                  value={filters.education} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, education: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Some College">Some College</SelectItem>
                    <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                    <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Culinary School">Culinary School</SelectItem>
                    <SelectItem value="Trade School">Trade School</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interests */}
              <div className="mb-8">
                <Label className="text-lg font-semibold text-gray-700 mb-3 block">
                  Interests ({filters.interests.length} selected)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-2 rounded-full text-sm transition-colors ${
                        filters.interests.includes(interest)
                          ? "bg-tinder-red text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1 gradient-bg"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}