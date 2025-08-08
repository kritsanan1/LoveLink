import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { getCityFromCoordinates } from "@/utils/location";
import { apiRequest } from "@/lib/queryClient";

interface LocationPermissionProps {
  userId: string;
  onLocationGranted: (latitude: number, longitude: number, city: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function LocationPermission({ 
  userId, 
  onLocationGranted, 
  onClose, 
  isOpen 
}: LocationPermissionProps) {
  const [isGettingCity, setIsGettingCity] = useState(false);
  const { latitude, longitude, error, loading, refreshLocation } = useGeolocation();

  // Update user location when coordinates are available
  useEffect(() => {
    if (latitude && longitude && !error && !loading) {
      handleLocationReceived(latitude, longitude);
    }
  }, [latitude, longitude, error, loading]);

  const handleLocationReceived = async (lat: number, lon: number) => {
    setIsGettingCity(true);
    try {
      // Get city name from coordinates
      const city = await getCityFromCoordinates(lat, lon);
      
      // Update user location in backend
      await apiRequest("PUT", `/api/users/${userId}/location`, {
        latitude: lat,
        longitude: lon,
        location: city,
      });

      onLocationGranted(lat, lon, city);
    } catch (error) {
      console.error("Error getting city:", error);
      // Still call onLocationGranted with coordinates
      onLocationGranted(lat, lon, "Location enabled");
    } finally {
      setIsGettingCity(false);
    }
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
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-4 max-w-sm mx-auto my-auto bg-white rounded-3xl z-50 p-6 h-fit"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <MapPin className="w-6 h-6 text-red-500" />
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

            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Find People Near You
              </h2>
              
              <p className="text-gray-600 text-sm">
                Enable location to discover people in your area and get accurate distances
              </p>

              {/* Loading States */}
              {loading && (
                <div className="py-4">
                  <div className="flex items-center justify-center space-x-2 text-blue-500">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Getting your location...</span>
                  </div>
                </div>
              )}

              {isGettingCity && (
                <div className="py-4">
                  <div className="flex items-center justify-center space-x-2 text-green-500">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Getting your city...</span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="py-4 space-y-3">
                  <div className="text-red-500 text-sm">{error}</div>
                  <Button
                    onClick={refreshLocation}
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {/* Success State */}
              {latitude && longitude && !loading && !isGettingCity && (
                <div className="py-4 space-y-2">
                  <div className="text-green-500 font-medium">
                    Location enabled!
                  </div>
                  <div className="text-sm text-gray-500">
                    You'll now see people nearby
                  </div>
                </div>
              )}

              {/* Initial State */}
              {!loading && !error && !latitude && (
                <div className="space-y-4 py-4">
                  <div className="text-sm text-gray-500 space-y-2">
                    <div>• See people nearby first</div>
                    <div>• Get accurate distance information</div>
                    <div>• Better matches in your area</div>
                  </div>
                  <Button
                    onClick={refreshLocation}
                    className="w-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Enable Location
                  </Button>
                </div>
              )}

              {/* Skip Option */}
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                Maybe later
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}