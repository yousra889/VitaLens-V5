import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { CityLabels } from "./CityLabels";
import { DrawControl } from "./DrawControl";
import type { GeoJSONPolygon } from "../api/client";
import "./DrawMap.css";

// Vite doesn't resolve Leaflet's default marker asset paths automatically.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MOROCCO_CENTER: [number, number] = [31.5, -7.0];

interface DrawMapProps {
  onZoneDrawn: (polygon: GeoJSONPolygon) => void;
  onCleared: () => void;
}

export function DrawMap({ onZoneDrawn, onCleared }: DrawMapProps) {
  return (
    <div className="draw-map">
      <MapContainer
        center={MOROCCO_CENTER}
        zoom={6}
        minZoom={5}
        maxBounds={[
          [20, -18],
          [37, 2],
        ]}
        className="draw-map__container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CityLabels />
        <DrawControl onZoneDrawn={onZoneDrawn} onCleared={onCleared} />
      </MapContainer>
      <p className="draw-map__hint">
        Utilisez l'outil polygone (en haut à droite) pour dessiner une zone.
      </p>
    </div>
  );
}
