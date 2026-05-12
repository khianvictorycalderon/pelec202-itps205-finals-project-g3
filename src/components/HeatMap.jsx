import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * HeatMap
 * Props:
 *   points:  Array<{ lat, lng, intensity, country, isSelected? }>
 *   loading: boolean
 *   center:  { lat, lng } | null  — if set, map flies to this position
 *   zoom:    number               — zoom level when center is provided (default 4)
 */
const HeatMap = ({ points = [], loading = false, center = null, zoom = 4 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markerLayerRef = useRef(null);

  // Initialize map once
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20, 10],
      zoom: 2,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      heatLayerRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  // Pan/zoom to center when it changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !center) return;
    map.flyTo([center.lat, center.lng], zoom, { duration: 1.5 });
  }, [center, zoom]);

  // Update heatmap layer when points change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || loading) return;
    if (!points || points.length === 0) return;

    const loadHeat = async () => {
      if (!L.heatLayer) {
        await import("leaflet.heat");
      }

      // Remove old layers
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
      if (markerLayerRef.current) {
        map.removeLayer(markerLayerRef.current);
      }

      // Normalise intensities to 0–1
      const maxVal = Math.max(...points.map((p) => p.intensity), 1);
      const latLngs = points.map((p) => [
        p.lat,
        p.lng,
        p.intensity / maxVal,
      ]);

      const heat = L.heatLayer(latLngs, {
        radius: 30,
        blur: 20,
        maxZoom: 6,
        gradient: {
          0.1: "#00bcd4",
          0.3: "#03a9f4",
          0.5: "#ffeb3b",
          0.7: "#ff9800",
          1.0: "#f44336",
        },
      }).addTo(map);

      heatLayerRef.current = heat;

      // Add a pulsing marker for the selected country
      const selected = points.find((p) => p.isSelected);
      if (selected) {
        const pulseIcon = L.divIcon({
          className: "",
          html: `
            <div style="
              width: 20px; height: 20px;
              border-radius: 50%;
              background: rgba(6,182,212,0.9);
              border: 3px solid white;
              box-shadow: 0 0 0 4px rgba(6,182,212,0.4), 0 0 16px rgba(6,182,212,0.6);
              animation: pulse-ring 1.5s ease-out infinite;
            "></div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([selected.lat, selected.lng], {
          icon: pulseIcon,
        });

        marker.bindTooltip(selected.country, {
          permanent: true,
          direction: "top",
          offset: [0, -14],
          className:
            "bg-sky-900 text-cyan-300 border-0 rounded-lg px-2 py-1 text-xs font-semibold shadow-lg",
        });

        marker.addTo(map);
        markerLayerRef.current = marker;
      }
    };

    loadHeat();
  }, [points, loading]);

  return (
    <div className="relative w-full" style={{ height: "420px" }}>
      {/* Inject pulse animation */}
      <style>{`
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(6,182,212,0.6), 0 0 16px rgba(6,182,212,0.6); }
          70%  { box-shadow: 0 0 0 12px rgba(6,182,212,0), 0 0 16px rgba(6,182,212,0.3); }
          100% { box-shadow: 0 0 0 0 rgba(6,182,212,0), 0 0 0 rgba(6,182,212,0); }
        }
      `}</style>

      {loading && (
        <div className="absolute inset-0 z-[999] flex flex-col items-center justify-center bg-neutral-900/80 rounded-2xl gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-cyan-800 border-t-cyan-400 animate-spin" />
          <p className="text-cyan-400 text-sm font-mono">Loading map data…</p>
        </div>
      )}
      <div
        ref={mapRef}
        style={{ height: "100%", width: "100%", borderRadius: "16px" }}
      />
    </div>
  );
};

export default HeatMap;