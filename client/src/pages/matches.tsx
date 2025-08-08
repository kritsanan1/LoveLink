import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle } from "lucide-react";
import { User, Match, Message } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

// Mock current user ID
const CURRENT_USER_ID = "current-user-123";

interface ConversationData {
  match: Match;
  otherUser: User;
  lastMessage?: Message & { sender: User };
  unreadCount: number;
}

export default function Matches() {
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');

  // Fetch user matches
  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ['/api/matches', CURRENT_USER_ID],
    select: (data) => data as Array<Match & { otherUser: User }>,
  });

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations', CURRENT_USER_ID],
    select: (data) => data as ConversationData[],
  });

  const formatTime = (date: Date | string) => {
    const messageDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  if (matchesLoading || conversationsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tinder-red"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <header className="p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
          {activeTab === 'matches' ? 'Your Matches' : 'Messages'}
        </h2>
        
        {/* Tab Navigation */}
        <div className="flex mt-4 bg-gray-100 rounded-lg p-1">
          <Button
            onClick={() => setActiveTab('matches')}
            variant={activeTab === 'matches' ? 'default' : 'ghost'}
            className={`flex-1 ${activeTab === 'matches' 
              ? 'bg-white text-tinder-red shadow-sm' 
              : 'text-gray-600'
            }`}
          >
            <Heart className="w-4 h-4 mr-2" />
            Matches ({matches.length})
          </Button>
          <Button
            onClick={() => setActiveTab('messages')}
            variant={activeTab === 'messages' ? 'default' : 'ghost'}
            className={`flex-1 ${activeTab === 'messages' 
              ? 'bg-white text-tinder-red shadow-sm' 
              : 'text-gray-600'
            }`}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Messages ({conversations.length})
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'matches' ? (
          <div className="p-4">
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No matches yet
                </h3>
                <p className="text-gray-500">
                  Start swiping to find your perfect match!
                </p>
                <Link href="/">
                  <Button className="mt-4 gradient-bg">
                    Start Swiping
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* New Matches Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    New Matches
                  </h3>
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {matches.slice(0, 6).map((match) => (
                      <Link
                        key={match.id}
                        href={`/chat/${match.id}`}
                        className="flex-shrink-0"
                      >
                        <div className="w-20 h-20 relative group cursor-pointer">
                          <img
                            src={match.otherUser.photos?.[0] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
                            alt={match.otherUser.name}
                            className="w-full h-full object-cover rounded-full border-2 border-tinder-red group-hover:border-tinder-orange transition-colors"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-tinder-red rounded-full border-2 border-white flex items-center justify-center">
                            <Heart className="w-3 h-3 text-white fill-white" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* All Matches Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {matches.map((match) => (
                    <Link
                      key={match.id}
                      href={`/chat/${match.id}`}
                      className="group cursor-pointer"
                    >
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group-hover:shadow-md transition-shadow">
                        <img
                          src={match.otherUser.photos?.[0] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
                          alt={match.otherUser.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <h4 className="font-semibold text-gray-800 truncate">
                            {match.otherUser.name}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            {match.otherUser.bio || "No bio"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          /* Messages Tab */
          <div className="divide-y divide-gray-100">
            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No conversations yet
                </h3>
                <p className="text-gray-500">
                  Match with someone and start chatting!
                </p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <Link
                  key={conversation.match.id}
                  href={`/chat/${conversation.match.id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center p-4">
                    <img
                      src={conversation.otherUser.photos?.[0] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                      alt={conversation.otherUser.name}
                      className="w-12 h-12 object-cover rounded-full mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {conversation.otherUser.name}
                        </h4>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {conversation.lastMessage 
                            ? formatTime(conversation.lastMessage.createdAt!)
                            : "New match!"
                          }
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm truncate">
                        {conversation.lastMessage?.content || "Say hello! 👋"}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="w-2 h-2 bg-tinder-red rounded-full ml-2 flex-shrink-0"></div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
