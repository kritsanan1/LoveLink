import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { User } from "@shared/schema";
import { useState } from "react";
import { MapPin, Shield, Crown } from "lucide-react";
import ActivityIndicator from "./activity-indicator";

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right' | 'up', user: User) => void;
  style?: React.CSSProperties;
  isTop?: boolean;
}

export default function SwipeCard({ user, onSwipe, style, isTop = false }: SwipeCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = Math.abs(info.velocity.x);
    const moved = Math.abs(info.offset.x);

    // Super like (swipe up)
    if (info.offset.y < -threshold && Math.abs(info.offset.x) < threshold) {
      onSwipe('up', user);
      return;
    }

    // Right swipe (like)
    if (info.offset.x > threshold || (velocity > 500 && info.offset.x > 50)) {
      onSwipe('right', user);
      return;
    }

    // Left swipe (pass)
    if (info.offset.x < -threshold || (velocity > 500 && info.offset.x < -50)) {
      onSwipe('left', user);
      return;
    }
  };

  const handlePhotoTap = (event: React.MouseEvent) => {
    if (!isTop) return;
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const tapX = event.clientX - rect.left;
    const isRightSide = tapX > rect.width / 2;

    if (isRightSide && currentPhotoIndex < (user.photos?.length || 1) - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else if (!isRightSide && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const currentPhoto = user.photos?.[currentPhotoIndex] || user.photos?.[0] || 
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600";

  return (
    <motion.div
      drag={isTop ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, opacity, ...style }}
      className="absolute inset-0 bg-white rounded-2xl card-shadow swipe-card cursor-grab active:cursor-grabbing"
      whileDrag={{ scale: 1.05 }}
    >
      <div 
        className="w-full h-3/4 relative overflow-hidden rounded-t-2xl"
        onClick={handlePhotoTap}
      >
        <img 
          src={currentPhoto}
          alt={`${user.name}'s photo`}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {user.verified && (
            <div className="bg-tinder-blue text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-semibold">
              <Shield className="w-3 h-3" />
              <span>Verified</span>
            </div>
          )}
          {user.premium && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-semibold">
              <Crown className="w-3 h-3" />
              <span>Premium</span>
            </div>
          )}
        </div>

        {/* Photo indicators */}
        {user.photos && user.photos.length > 1 && (
          <div className="absolute top-4 left-4 right-4 flex space-x-1">
            {user.photos.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded ${
                  index === currentPhotoIndex 
                    ? "bg-white opacity-80" 
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Swipe indicators */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            opacity: useTransform(x, [50, 100], [0, 1]),
          }}
        >
          <div className="bg-tinder-green text-white px-4 py-2 rounded-lg font-bold text-xl border-2 border-tinder-green transform rotate-12">
            LIKE
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            opacity: useTransform(x, [-100, -50], [1, 0]),
          }}
        >
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xl border-2 border-red-500 transform -rotate-12">
            NOPE
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            opacity: useTransform(y, [-100, -50], [1, 0]),
          }}
        >
          <div className="bg-tinder-blue text-white px-4 py-2 rounded-lg font-bold text-xl border-2 border-tinder-blue">
            SUPER LIKE
          </div>
        </motion.div>
      </div>
      
      {/* Profile info */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {user.name}, {user.age}
        </h3>
        {user.jobTitle && user.company && (
          <p className="text-gray-700 text-sm mt-1 font-medium">
            {user.jobTitle} at {user.company}
          </p>
        )}
        {user.bio && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {user.bio}
          </p>
        )}
        {user.education && (
          <p className="text-gray-500 text-xs mt-1">
            🎓 {user.education}
          </p>
        )}
        {user.height && (
          <p className="text-gray-500 text-xs mt-1">
            📏 {user.height}cm
          </p>
        )}
        {user.location && (
          <div className="flex items-center mt-2 text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{user.location}</span>
          </div>
        )}
        
        {/* Activity Status */}
        {user.lastActive && (
          <div className="mt-2">
            <ActivityIndicator lastActive={user.lastActive} />
          </div>
        )}
        
        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {user.interests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {interest}
              </span>
            ))}
            {user.interests.length > 3 && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                +{user.interests.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
