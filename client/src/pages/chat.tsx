import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, MoreVertical } from "lucide-react";
import { Link } from "wouter";
import { User, Message, Match } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock current user ID
const CURRENT_USER_ID = "current-user-123";

export default function Chat() {
  const { matchId } = useParams();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch match details
  const { data: matches = [] } = useQuery({
    queryKey: ['/api/matches', CURRENT_USER_ID],
    select: (data) => data as Array<Match & { otherUser: User }>,
  });

  const currentMatch = matches.find(match => match.id === matchId);

  // Fetch messages for this match
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/messages', matchId],
    enabled: !!matchId,
    select: (data) => data as Array<Message & { sender: User }>,
    refetchInterval: 2000, // Poll for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/messages", {
        matchId: matchId!,
        senderId: CURRENT_USER_ID,
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: ['/api/messages', matchId] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', CURRENT_USER_ID] });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || sendMessageMutation.isPending) return;
    
    sendMessageMutation.mutate(messageInput.trim());
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date: Date | string) => {
    const messageDate = typeof date === 'string' ? new Date(date) : date;
    return messageDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!currentMatch) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Match not found</p>
          <Link href="/matches">
            <Button>Back to Matches</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex items-center">
        <Link href="/matches" className="mr-4">
          <Button size="sm" variant="ghost">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        
        <img
          src={currentMatch.otherUser.photos?.[0] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"}
          alt={currentMatch.otherUser.name}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">
            {currentMatch.otherUser.name}
          </h3>
          <p className="text-sm text-gray-500">
            Active recently
          </p>
        </div>
        
        <Button size="sm" variant="ghost">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tinder-red"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-tinder-red to-tinder-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💕</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              You matched with {currentMatch.otherUser.name}!
            </h3>
            <p className="text-gray-500 text-sm">
              Start the conversation with a friendly hello
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === CURRENT_USER_ID ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.senderId === CURRENT_USER_ID
                    ? "gradient-bg text-white rounded-tr-md"
                    : "bg-gray-100 text-gray-800 rounded-tl-md"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === CURRENT_USER_ID 
                    ? "text-white/70" 
                    : "text-gray-500"
                }`}>
                  {formatTime(message.createdAt!)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <Input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-gray-300 focus:border-tinder-red"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            type="submit"
            size="sm"
            className="w-12 h-12 rounded-full gradient-bg p-0"
            disabled={!messageInput.trim() || sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
