import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const HeatMap = () => {
  useEffect(() => {
    const API_KEY = process.env.REACT_APP_API_KEY;

    const map = L.map("map").setView([34.0479, 100.6197], 3);

    L.tileLayer(
      `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${API_KEY}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>',
      }
    ).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        height: "250px",
        width: "100%",
        borderRadius: "12px",
      }}
    />
  );
};

export default HeatMap;