"use client";

import { Check, LocateFixed, MapPin } from "lucide-react";
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
    <div className="rounded-3xl border border-[#B11226]/10 bg-white/65 p-5 shadow-[0_16px_40px_rgba(84,46,16,0.07)] backdrop-blur-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F5EBD0] text-[#B11226] shadow-inner shadow-black/10">
            <LocateFixed size={20} />
          </span>
          <div>
            <p className="text-sm font-black text-black/75">
              Discover businesses near you
            </p>
            <p className="mt-1 max-w-md text-sm leading-6 text-black/45">
              Use your location to find trusted services within a 5 km radius.
            </p>
          </div>
        </div>

      <button
        type="button"
        onClick={handleDetectLocation}
        disabled={loading}
        className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#B11226] px-5 py-3 font-semibold text-white shadow-lg shadow-[#B11226]/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#8F0E1E] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <MapPin
          size={18}
          className="transition-transform duration-200 group-hover:-translate-y-1"
        />
        {loading ? "Detecting your location..." : "Use my current location"}
      </button>
      </div>

      {location && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <Check size={14} />
          Location detected successfully
        </p>
      )}
    </div>
  );
}
