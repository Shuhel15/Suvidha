"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

type BusinessFiltersProps = {
  onLocationDetectedAction?: (coordinates: LocationCoordinates) => void;
};

export default function BusinessFilters({
  onLocationDetectedAction,
}: BusinessFiltersProps) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationCoordinates | null>(null);

  function handleDetectLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        console.log("GPS coordinates", coordinates);
        setLocation(coordinates);
        onLocationDetectedAction?.(coordinates);
        setLoading(false);
      },
      (error) => {
        setLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Permission denied. Please allow location access.");
            break;

          case error.POSITION_UNAVAILABLE:
            toast.error("Your location is currently unavailable.");
            break;

          case error.TIMEOUT:
            toast.error("Location request timed out. Please try again.");
            break;

          default:
            toast.error("Unable to detect your location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }

  return (
    <div className="space-y-3 mt-5">
      <button
        type="button"
        onClick={handleDetectLocation}
        disabled={loading}
        className="group flex flex-row justify-center gap-2 items-center rounded-xl bg-[#B11226] px-5 py-3 font-semibold text-white transition hover:bg-[#941020] disabled:cursor-not-allowed disabled:opacity-60 hover:scale-102 duration-200 ease-in-out"
      >
        <MapPin size={18} className="text-white transition-transform group-hover:-translate-y-1 duration-200" />
        {loading ? "Detecting your location..." : "Use my current location"}
      </button>

      {location && (
        <p className="text-sm text-green-700">
          Location detected successfully!
        </p>
      )}
    </div>
  );
}
