"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Map() {
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [waypoints, setWaypoints] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [weatherConditions, setWeatherConditions] = useState<any>(null);
  const sourceCoords: [number, number] = [19.2183, 72.9781]; // Thane

  const handleGetDirections = async () => {
    const destLat = parseFloat(prompt("Enter Destination Latitude:") || "");
    const destLon = parseFloat(prompt("Enter Destination Longitude:") || "");
    if (isNaN(destLat) || isNaN(destLon)) {
      alert("Invalid coordinates. Please enter valid numbers.");
      return;
    }
    setDestinationCoords([destLat, destLon]);
    
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/directions", {
        params: {
          origin_lat: sourceCoords[0],
          origin_lon: sourceCoords[1],
          destination_lat: destLat,
          destination_lon: destLon,
        },
      });

      const data = response.data;
      const fetchedWaypoints = data.weather_conditions.map((w: any) => {
        const [lat, lon] = w.waypoint.match(/\(([^)]+)\)/)[1].split(", ").map(parseFloat);
        return [lat, lon] as [number, number];
      });

      setWaypoints(fetchedWaypoints);
      setDistance(data.total_distance_km);
      setDuration(data.total_duration_min);
      setWeatherConditions(data.weather_conditions);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleGetDirections} disabled={loading}>
        {loading ? "Loading..." : "Get Directions"}
      </button>
      
      {/* Display fetched data */}
      <div className="mt-4">
        {distance && <p><strong>Total Distance:</strong> {distance}</p>}
        {duration && <p><strong>Total Duration:</strong> {duration}</p>}
        {weatherConditions && (
          <div>
            <strong>Weather Conditions:</strong>
            <ul>
              {weatherConditions.map((w: any, index: number) => (
                <li key={index}>{w.condition} at ({w.waypoint})</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="h-[400px] w-full mx-auto relative mt-4">
        <MapContainer center={sourceCoords} zoom={10} style={{ height: "100%", width: "100%" }} className="rounded-lg">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          <Marker position={sourceCoords} />
          {destinationCoords && <Marker position={destinationCoords} />}
          {waypoints.length > 1 && (
            <>
              <Polyline positions={waypoints} color="blue" />
              {waypoints.map((waypoint, index) => (
                <Marker key={index} position={waypoint} />
              ))}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

// Latitude: 19.0760° N
// Longitude: 72.8470° E