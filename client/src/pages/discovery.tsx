import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X, Star, Heart, Bell, User as UserIcon, Sliders, Crown, Zap } from "lucide-react";
import SwipeCard from "@/components/swipe-card";
import MatchModal from "@/components/match-modal";
import FilterModal from "@/components/filter-modal";
import PremiumModal from "@/components/premium-modal";
import LikeCounter from "@/components/like-counter";
import BoostManager from "@/components/boost-manager";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

// Mock current user ID (in real app, this would come from auth)
const CURRENT_USER_ID = "current-user-123";

export default function Discovery() {
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showBoostManager, setShowBoostManager] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: [18, 35] as [number, number],
    maxDistance: 25,
    interests: [] as string[],
    education: "any",
    lookingFor: "serious"
  });
  const [likesRemaining, setLikesRemaining] = useState(10);
  const [superLikesRemaining, setSuperLikesRemaining] = useState(5);
  const [activeBoosts, setActiveBoosts] = useState<Array<{
    type: "profile_boost" | "super_boost";
    timeRemaining: string;
  }>>([]);
  const queryClient = useQueryClient();

  // Fetch discovery users
  const { data: discoveryUsers = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/discovery', CURRENT_USER_ID],
    select: (data) => data as User[],
  });

  // Create current user if doesn't exist
  useEffect(() => {
    const initCurrentUser = async () => {
      try {
        const response = await fetch(`/api/users/${CURRENT_USER_ID}`);
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
        } else {
          // Create a default current user
          const newUser = {
            name: "You",
            age: 25,
            bio: "Looking for meaningful connections ✨",
            jobTitle: "Professional",
            company: "Tech Company",
            photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"],
            interests: ["Travel", "Coffee", "Photography"],
            location: "Your City"
          };
          
          const response = await apiRequest("POST", "/api/users", newUser);
          const user = await response.json();
          setCurrentUser({ ...user, id: CURRENT_USER_ID });
        }
      } catch (error) {
        console.error("Error initializing current user:", error);
      }
    };

    initCurrentUser();
  }, []);

  // Swipe mutation
  const swipeMutation = useMutation({
    mutationFn: async ({ swipedUser, isLike, isSuperLike }: { 
      swipedUser: User; 
      isLike: boolean; 
      isSuperLike?: boolean;
    }) => {
      const response = await apiRequest("POST", "/api/swipe", {
        swiperId: CURRENT_USER_ID,
        swipedId: swipedUser.id,
        isLike,
        isSuperLike: isSuperLike || false,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      if (data.match) {
        setMatchedUser(variables.swipedUser);
        setShowMatchModal(true);
      }
      
      // Remove swiped user from discovery list
      queryClient.setQueryData(['/api/discovery', CURRENT_USER_ID], (oldData: User[]) => 
        oldData?.filter(user => user.id !== variables.swipedUser.id) || []
      );

      // Refetch if running low on users
      const remainingUsers = queryClient.getQueryData(['/api/discovery', CURRENT_USER_ID]) as User[];
      if (remainingUsers && remainingUsers.length < 2) {
        refetch();
      }
    },
    onError: (error) => {
      console.error("Swipe error:", error);
    }
  });

  const handleSwipe = (direction: 'left' | 'right' | 'up', user: User) => {
    const isLike = direction === 'right' || direction === 'up';
    const isSuperLike = direction === 'up';
    
    // Check premium status and likes remaining for likes
    if (isLike && !currentUser?.premium && likesRemaining <= 0) {
      setShowPremiumModal(true);
      return;
    }
    
    swipeMutation.mutate({
      swipedUser: user,
      isLike,
      isSuperLike,
    });
    
    // Decrement likes for non-premium users
    if (isLike && !currentUser?.premium) {
      setLikesRemaining(prev => Math.max(0, prev - 1));
    }
  };

  const handleActionButton = (action: 'pass' | 'superlike' | 'like') => {
    if (discoveryUsers.length === 0) return;
    
    const topUser = discoveryUsers[0];
    if (action === 'pass') {
      handleSwipe('left', topUser);
    } else if (action === 'superlike') {
      handleSwipe('up', topUser);
    } else if (action === 'like') {
      handleSwipe('right', topUser);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tinder-red"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="gradient-bg p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">HeartSync</h1>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => setShowFilterModal(true)}
            >
              <Sliders className="w-5 h-5" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => setShowPremiumModal(true)}
            >
              <Crown className="w-5 h-5" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => setShowBoostManager(true)}
            >
              <Zap className="w-5 h-5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
              <Bell className="w-5 h-5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
              <UserIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Likes Counter */}
        <div className="flex justify-center">
          <LikeCounter
            likesRemaining={likesRemaining}
            isPremium={currentUser?.premium || false}
            onUpgrade={() => setShowPremiumModal(true)}
          />
        </div>
      </header>

      {/* Card Stack */}
      <div className="flex-1 p-4">
        <div className="h-full relative">
          {discoveryUsers.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No more profiles
                </h3>
                <p className="text-gray-500 mb-4">
                  Check back later for new people in your area
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  Refresh
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Render cards in reverse order for proper stacking */}
              {discoveryUsers.slice(0, 3).reverse().map((user, reverseIndex) => {
                const index = discoveryUsers.slice(0, 3).length - 1 - reverseIndex;
                return (
                  <SwipeCard
                    key={user.id}
                    user={user}
                    onSwipe={handleSwipe}
                    isTop={index === 0}
                    style={{
                      zIndex: 10 - index,
                      transform: `scale(${1 - index * 0.05}) translateY(${index * -8}px)`,
                    }}
                  />
                );
              })}
            </>
          )}
        </div>

        {/* Action Buttons */}
        {discoveryUsers.length > 0 && (
          <div className="flex justify-center items-center space-x-6 pb-4">
            <Button
              onClick={() => handleActionButton('pass')}
              size="lg"
              variant="outline"
              className="w-14 h-14 rounded-full border-2 hover:scale-110 transition-transform"
              disabled={swipeMutation.isPending}
            >
              <X className="w-6 h-6 text-gray-400" />
            </Button>
            
            <Button
              onClick={() => handleActionButton('superlike')}
              size="sm"
              variant="outline"
              className="w-12 h-12 rounded-full border-2 hover:scale-110 transition-transform"
              disabled={swipeMutation.isPending}
            >
              <Star className="w-5 h-5 text-tinder-blue" />
            </Button>
            
            <Button
              onClick={() => handleActionButton('like')}
              size="lg"
              className="w-14 h-14 rounded-full gradient-bg hover:scale-110 transition-transform border-0"
              disabled={swipeMutation.isPending}
            >
              <Heart className="w-6 h-6 text-white" />
            </Button>
          </div>
        )}
      </div>

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        currentUser={currentUser || undefined}
        matchedUser={matchedUser || undefined}
        onSendMessage={() => {
          setShowMatchModal(false);
          // Navigate to chat - would be implemented with proper routing
        }}
        onKeepSwiping={() => setShowMatchModal(false)}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          // TODO: Implement filtered discovery API call
          refetch();
        }}
        currentFilters={filters}
      />

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={() => {
          setShowPremiumModal(false);
          // TODO: Implement premium upgrade
          console.log("Upgrading to premium...");
        }}
      />

      {/* Boost Manager */}
      <BoostManager
        isOpen={showBoostManager}
        onClose={() => setShowBoostManager(false)}
        isPremium={currentUser?.premium || false}
        superLikesRemaining={superLikesRemaining}
        activeBoosts={activeBoosts}
        onActivateBoost={(type) => {
          if (type === "super_like") {
            if (superLikesRemaining > 0) {
              setSuperLikesRemaining(prev => prev - 1);
              setShowBoostManager(false);
              console.log("Super like activated");
            }
          } else if (type === "profile_boost") {
            if (!activeBoosts.find(boost => boost.type === "profile_boost")) {
              setActiveBoosts(prev => [...prev, {
                type: "profile_boost",
                timeRemaining: "30:00"
              }]);
              setShowBoostManager(false);
              console.log("Profile boost activated");
              
              // Simulate countdown (in real app, this would be handled server-side)
              setTimeout(() => {
                setActiveBoosts(prev => prev.filter(boost => boost.type !== "profile_boost"));
              }, 30 * 60 * 1000); // 30 minutes
            }
          }
        }}
      />
    </div>
  );
}
