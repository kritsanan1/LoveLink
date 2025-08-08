/**
 * Calculate the distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km away`;
  } else {
    return `${Math.round(distance)}km away`;
  }
}

/**
 * Get city name from coordinates using reverse geocoding
 * This is a simplified implementation - in production, you'd use a proper geocoding service
 */
export async function getCityFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    // Using a simple reverse geocoding approximation
    // In production, use Google Maps, MapBox, or similar service
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    return data.city || data.locality || data.principalSubdivision || 'Unknown Location';
  } catch (error) {
    // Fallback to coordinate-based location approximation
    return getApproximateLocation(latitude, longitude);
  }
}

/**
 * Get approximate location based on coordinates
 * This is a fallback when reverse geocoding fails
 */
function getApproximateLocation(latitude: number, longitude: number): string {
  // Major city coordinates for approximation
  const majorCities = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
    { name: 'Houston', lat: 29.7604, lon: -95.3698 },
    { name: 'Phoenix', lat: 33.4484, lon: -112.0740 },
    { name: 'Philadelphia', lat: 39.9526, lon: -75.1652 },
    { name: 'San Antonio', lat: 29.4241, lon: -98.4936 },
    { name: 'San Diego', lat: 32.7157, lon: -117.1611 },
    { name: 'Dallas', lat: 32.7767, lon: -96.7970 },
    { name: 'San Jose', lat: 37.3382, lon: -121.8863 },
  ];

  let closestCity = majorCities[0];
  let closestDistance = calculateDistance(latitude, longitude, closestCity.lat, closestCity.lon);

  for (const city of majorCities) {
    const distance = calculateDistance(latitude, longitude, city.lat, city.lon);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCity = city;
    }
  }

  if (closestDistance < 50) {
    return closestCity.name;
  }

  return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
}