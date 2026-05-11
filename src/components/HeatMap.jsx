import React, { useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

export default function HeatMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        // 1. Set your API Key
        setOptions({
          apiKey: "YOUR_GOOGLE_MAPS_API_KEY", // <--- PUT YOUR GOOGLE MAPS API KEY HERE
          version: "weekly",
        });

        // 2. Import the necessary Google Maps libraries
        const { Map } = await importLibrary("maps");
        const { HeatmapLayer } = await importLibrary("visualization");
        const { LatLng } = await importLibrary("core");

        // 3. Initialize the Map with a Modern Dark Theme
        const map = new Map(mapRef.current, {
          center: { lat: 20, lng: 0 },
          zoom: 2,
          disableDefaultUI: true, 
          styles: [
            { elementType: "geometry", stylers: [{ color: "#0f172a" }] }, // Tailwind slate-900
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] }, // Tailwind slate-950
          ]
        });

        // 4. Fetch Actual Data from the New API
        const response = await fetch("https://disease.sh/v3/covid-19/countries");
        const data = await response.json();

        // 5. Convert API data into Heatmap points using ACTUAL cases
        const heatmapPoints = data.map(country => ({
          location: new LatLng(country.countryInfo.lat, country.countryInfo.long),
          weight: country.cases // This makes the shading based on actual cases!
        }));

        // 6. Apply the Heatmap Layer
        const heatmap = new HeatmapLayer({
          data: heatmapPoints,
          map: map,
          radius: 60, // Makes the glow softer
          opacity: 0.8,
          // Custom gradient matching your project's Cyan/Teal theme
          gradient: [
            "rgba(0, 255, 255, 0)",      
            "rgba(34, 211, 238, 1)",     // Cyan-400
            "rgba(6, 182, 212, 1)",      // Cyan-500
            "rgba(20, 184, 166, 1)",     // Teal-500
            "rgba(15, 118, 110, 1)",     // Teal-700
            "rgba(255, 0, 0, 1)"         // Red (For extreme hotspots)
          ]
        });
      } catch (error) {
        console.error("Error setting up map or fetching data:", error);
      }
    };

    initMap();
  }, []);

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md hover:border-cyan-200 transition-all duration-200 p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sky-900">Global Infectious Disease Hotspots</h2>
        <p className="text-sm text-neutral-500">Real-time concentration mapping based on actual cases</p>
      </div>
      
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-[400px] sm:h-[500px] rounded-lg overflow-hidden border border-neutral-100"
      />
    </div>
  );
}