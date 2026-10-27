"use client";
import { MapPin, Search } from "lucide-react";
import { useState } from "react";
export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState("");

  //Handle search
  function handleSearch() {
    const query = search.trim();

    if (!query) return;

    console.log(query);

    try {
    } catch {}
  }

  //Handle location
  async function handleLocation() {
    if (!navigator.geolocation) {
      alert("Your browser does not support location.");
      return;
    }

    setLoading(true);
    setAddress("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setLocation({ latitude, longitude });
        console.log("GPS accuracy:", accuracy, "meters");

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );

          if (!response.ok) {
            throw new Error("Address lookup failed");
          }

          const data = await response.json();
          const a = data.address ?? {};

          const locality =
            a.neighbourhood ||
            a.residential ||
            a.suburb ||
            a.quarter ||
            a.hamlet ||
            a.village ||
            a.town ||
            a.city_district ||
            "";

          const road = a.road || a.pedestrian || a.footway || "";
          const house = a.house_number ? `House ${a.house_number}` : "";
          const city = a.city || a.town || a.village || a.municipality || "";
          const state = a.state || "";
          const postcode = a.postcode || "";

          const detailedAddress = [house, road, locality, city, state, postcode]
            .filter(Boolean)
            .filter((part, index, arr) => arr.indexOf(part) === index)
            .join(", ");

          setAddress(
            detailedAddress ||
              data.display_name ||
              "Detailed address unavailable",
          );

          console.log("Address details:", a);
        } catch (error) {
          console.error("Location lookup error:", error);
          setAddress("Unable to fetch address. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          alert("Please allow location permission in your browser.");
        } else if (error.code === error.TIMEOUT) {
          alert("Location request timed out. Please try again.");
        } else {
          alert("Unable to detect location. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className="flex flex-row justify-center items-center ">
        <input
          type="text"
          placeholder="Search service you want..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white text-black/60 h-10 sm:h-12 w-75 sm:w-120 rounded-l-full px-4 transition-all focus:outline-none duration-200 "
        />

        <button
          type="button"
          aria-label="search button"
          onClick={handleSearch}
          className="group text-white bg-[#B11226] h-10 sm:h-12 px-2 sm:px-3 rounded-r-full"
        >
          <Search className="h-6 w-6 transition-transform group-hover:rotate-30 duration-200 active:scale-95" />
        </button>

        <button
          type="button"
          aria-label="location button"
          onClick={handleLocation}
          className="group rounded-full bg-[#B11226]  p-2 sm:p-3 ml-2 hover:scale-105 duration-200 ease-in-out active:scale-95 "
        >
          <MapPin className="h-6 w-6 text-white transition-transform group-hover:rotate-20 duration-200" />
        </button>
      </div>

      {address && (
        <p className="max-w-xl text-center text-sm text-emerald-600">
          <MapPin className="mr-1 inline h-4 w-4" />
          {address}
        </p>
      )}

      {loading ? (
        <div className="w-4 h-4 border-2 border-black/50 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        ""
      )}
    </div>
  );
}