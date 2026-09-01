import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { CityLabels } from "./CityLabels";
import { DrawControl } from "./DrawControl";

import type { GeoJSONPolygon } from "../../api/client";

import "./DrawMap.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MOROCCO_CENTER: [number, number] = [
  31.5,
  -7.0,
];

interface DrawMapProps {
  onZoneDrawn: (
    polygon: GeoJSONPolygon,
  ) => void;

  onCleared: () => void;
}

export function DrawMap({
  onZoneDrawn,
  onCleared,
}: DrawMapProps) {
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
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CityLabels />

        <DrawControl
          onZoneDrawn={onZoneDrawn}
          onCleared={onCleared}
        />
      </MapContainer>

      <div className="draw-map__overlay">
        <span className="draw-map__overlay-dot" />

        <span>
          Draw a polygon to analyze an area
        </span>
      </div>
    </div>
  );
}