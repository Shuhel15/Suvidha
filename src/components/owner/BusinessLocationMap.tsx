"use client";

import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type BusinessLocationMapProps = {
  latitude: number;
  longitude: number;
  onLocationChangeAction: (latitude: number, longitude: number) => void;
};

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({
  onLocationChangeAction,
}: {
  onLocationChangeAction: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(event) {
      onLocationChangeAction(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

export default function BusinessLocationMap({
  latitude,
  longitude,
  onLocationChangeAction,
}: BusinessLocationMapProps) {
  const [position, setPosition] = useState<[number, number]>([
    latitude,
    longitude,
  ]);

  function handleDragEnd(event: L.DragEndEvent) {
    const marker = event.target as L.Marker;
    const newPosition = marker.getLatLng();

    setPosition([newPosition.lat, newPosition.lng]);
    onLocationChangeAction(newPosition.lat, newPosition.lng);
  }

  function handleMapClick(lat: number, lng: number) {
    setPosition([lat, lng]);
    onLocationChangeAction(lat, lng);
  }

  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom
      className="h-87.5 w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onLocationChangeAction={handleMapClick} />

      <Marker
        position={position}
        icon={markerIcon}
        draggable
        eventHandlers={{
          dragend: handleDragEnd,
        }}
      />
    </MapContainer>
  );
}
