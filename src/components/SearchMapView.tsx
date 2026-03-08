import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { type Property, formatPrice } from "@/data/mockData";

interface SearchMapViewProps {
  properties: Property[];
}

export default function SearchMapView({ properties }: SearchMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  const mappable = properties.filter((p) => p.latitude && p.longitude);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous instance
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    // Default center: US
    const center: L.LatLngExpression = mappable.length > 0
      ? [mappable[0].latitude!, mappable[0].longitude!]
      : [39.8283, -98.5795];
    const zoom = mappable.length > 0 ? 5 : 4;

    mapInstance.current = L.map(mapRef.current).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance.current);

    const bounds = L.latLngBounds([]);

    mappable.forEach((p) => {
      const icon = L.divIcon({
        className: "custom-price-marker",
        html: `<div style="
          background: hsl(25, 60%, 45%);
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 2px solid white;
          font-family: 'DM Sans', sans-serif;
        ">${formatPrice(p.price)}</div>`,
        iconSize: [80, 28],
        iconAnchor: [40, 14],
      });

      const marker = L.marker([p.latitude!, p.longitude!], { icon }).addTo(mapInstance.current!);

      marker.bindPopup(`
        <div style="min-width: 200px; font-family: 'DM Sans', sans-serif;">
          <img src="${p.images[0]}" alt="${p.title}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />
          <strong style="font-size:14px;">${p.title}</strong>
          <p style="margin:4px 0;color:#666;font-size:12px;">${p.city}, ${p.state}</p>
          <p style="font-weight:700;color:hsl(25,60%,45%);font-size:14px;">${formatPrice(p.price)}</p>
          <p style="font-size:12px;color:#888;">${p.beds} bed · ${p.baths} bath · ${p.sqft.toLocaleString()} ft²</p>
        </div>
      `, { maxWidth: 250 });

      marker.on("click", () => {
        marker.openPopup();
      });

      // Double-click navigates to detail
      marker.on("dblclick", () => {
        navigate(`/property/${p.id}`);
      });

      bounds.extend([p.latitude!, p.longitude!]);
    });

    if (mappable.length > 1 && mapInstance.current) {
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (mappable.length === 1 && mapInstance.current) {
      mapInstance.current.setView([mappable[0].latitude!, mappable[0].longitude!], 12);
    }

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [mappable.map((p) => p.id).join(",")]);

  if (mappable.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
        No properties with location data to display on the map.
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="h-[calc(100vh-14rem)] min-h-[500px] w-full rounded-xl border border-border overflow-hidden"
    />
  );
}
