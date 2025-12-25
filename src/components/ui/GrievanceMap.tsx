import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

// Custom marker icon using a beautiful SVG pin
const customIcon = L.divIcon({
  html: `<div class="bg-primary p-2 rounded-full shadow-lg border-2 border-white transform -translate-x-1/2 -translate-y-full transition-all duration-300 hover:scale-110">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface GrievanceMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

function LocationMarker({ selectedLocation, onLocationSelect }: GrievanceMapProps) {
  const map = useMap();

  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom() > 14 ? map.getZoom() : 15, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    },
  });

  return selectedLocation ? (
    <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={customIcon} />
  ) : null;
}

export default function GrievanceMap({ onLocationSelect, selectedLocation }: GrievanceMapProps) {
  const defaultCenter: [number, number] = [19.2183, 72.9781];

  return (
    <Card className="relative w-full h-[300px] overflow-hidden rounded-xl border shadow-sm z-0">
      <MapContainer
        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker selectedLocation={selectedLocation} onLocationSelect={onLocationSelect} />
      </MapContainer>
      <div className="absolute top-4 right-4 z-[400] bg-background/80 backdrop-blur-sm p-2 rounded-md border shadow-sm text-xs font-medium flex items-center gap-2">
        <MapPin className="w-3 h-3 text-primary" />
        Click to pinpoint location
      </div>
    </Card>
  );
}
