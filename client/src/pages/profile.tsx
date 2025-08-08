import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Plus } from "lucide-react";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SAMPLE_INTERESTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

// Mock current user ID
const CURRENT_USER_ID = "current-user-123";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${CURRENT_USER_ID}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setSelectedInterests(userData.interests || []);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const response = await apiRequest("PUT", `/api/users/${CURRENT_USER_ID}`, updates);
      return response.json();
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID] });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      bio: formData.get('bio') as string,
      jobTitle: formData.get('jobTitle') as string,
      company: formData.get('company') as string,
      interests: selectedInterests,
    };

    updateProfileMutation.mutate(updates);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tinder-red"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <form onSubmit={handleSave}>
        {/* Profile Header */}
        <div className="relative">
          <div className="h-96 bg-gradient-to-b from-gray-200 to-gray-300 relative">
            {user.photos?.[0] ? (
              <img 
                src={user.photos[0]}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Add Photos</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Photo Grid */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-white/80 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/90 transition-colors"
                >
                  {index === 0 && !user.photos?.[0] ? (
                    <Plus className="w-4 h-4 text-gray-600" />
                  ) : user.photos?.[index] ? (
                    <img
                      src={user.photos[index]}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name
            </label>
            <Input
              name="name"
              defaultValue={user.name}
              className="focus:border-tinder-red"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Age
            </label>
            <Input
              name="age"
              type="number"
              defaultValue={user.age}
              className="focus:border-tinder-red"
              min="18"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <Textarea
              name="bio"
              defaultValue={user.bio || ""}
              placeholder="Tell us about yourself..."
              className="focus:border-tinder-red h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Title
            </label>
            <Input
              name="jobTitle"
              defaultValue={user.jobTitle || ""}
              placeholder="What do you do?"
              className="focus:border-tinder-red"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company/School
            </label>
            <Input
              name="company"
              defaultValue={user.company || ""}
              placeholder="Where do you work/study?"
              className="focus:border-tinder-red"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedInterests.includes(interest)
                      ? "bg-tinder-red text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-bg py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
