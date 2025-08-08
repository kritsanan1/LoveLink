import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useGeolocation } from "@/hooks/use-geolocation";
import { getCityFromCoordinates } from "@/utils/location";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LocationSettingsProps {
  userId: string;
  currentLocation?: string;
  currentMaxDistance?: number;
  onLocationUpdate?: (location: string, maxDistance: number) => void;
}

export default function LocationSettings({ 
  userId, 
  currentLocation, 
  currentMaxDistance = 25,
  onLocationUpdate 
}: LocationSettingsProps) {
  const [location, setLocation] = useState(currentLocation || "");
  const [maxDistance, setMaxDistance] = useState([currentMaxDistance]);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const { latitude, longitude, error, loading, refreshLocation } = useGeolocation();
  const { toast } = useToast();

  // Auto-update location when coordinates are available
  useEffect(() => {
    if (latitude && longitude && !loading && !error) {
      updateLocationFromCoordinates(latitude, longitude);
    }
  }, [latitude, longitude, loading, error]);

  const updateLocationFromCoordinates = async (lat: number, lon: number) => {
    setIsUpdatingLocation(true);
    try {
      const city = await getCityFromCoordinates(lat, lon);
      
      // Update backend
      await apiRequest("PUT", `/api/users/${userId}/location`, {
        latitude: lat,
        longitude: lon,
        location: city,
      });

      setLocation(city);
      toast({
        title: "Location updated",
        description: `Your location has been set to ${city}`,
      });
      
      onLocationUpdate?.(city, maxDistance[0]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const handleMaxDistanceChange = async (newDistance: number[]) => {
    setMaxDistance(newDistance);
    try {
      await apiRequest("PUT", `/api/users/${userId}`, {
        maxDistance: newDistance[0],
      });
      
      onLocationUpdate?.(location, newDistance[0]);
      toast({
        title: "Discovery range updated",
        description: `You'll now see people within ${newDistance[0]}km`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update discovery range.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-red-500" />
          <span>Location & Discovery</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Location */}
        <div className="space-y-2">
          <Label>Current Location</Label>
          <div className="flex items-center space-x-2">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your city"
              className="flex-1"
            />
            <Button
              onClick={refreshLocation}
              disabled={loading || isUpdatingLocation}
              variant="outline"
              size="sm"
            >
              {loading || isUpdatingLocation ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {location && (
            <p className="text-sm text-gray-500">
              People will see you're in {location}
            </p>
          )}
        </div>

        {/* Discovery Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Discovery Range</Label>
            <span className="text-sm font-medium">{maxDistance[0]}km</span>
          </div>
          <Slider
            value={maxDistance}
            onValueChange={setMaxDistance}
            onValueCommit={handleMaxDistanceChange}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1km</span>
            <span>100km</span>
          </div>
        </div>

        {/* Location Benefits */}
        <div className="bg-blue-50 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 mb-2">Location Benefits</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• See people closest to you first</li>
            <li>• Get accurate distance information</li>
            <li>• Better matches in your area</li>
            <li>• Improved discovery experience</li>
          </ul>
        </div>

        {/* Privacy Note */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            <Settings className="w-3 h-3 inline mr-1" />
            Your exact coordinates are never shown to other users. Only your city and approximate distance are displayed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}