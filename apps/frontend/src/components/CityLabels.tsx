import { useEffect, useState } from "react";
import { CircleMarker, Tooltip, useMapEvents } from "react-leaflet";
import { MOROCCO_CITIES } from "./morocco-cities";

const REVEAL_ZOOM = 7;

export function CityLabels() {
  const [visible, setVisible] = useState(false);

  const map = useMapEvents({
    zoomend: () => setVisible(map.getZoom() >= REVEAL_ZOOM),
  });

  useEffect(() => {
    setVisible(map.getZoom() >= REVEAL_ZOOM);
  }, [map]);

  if (!visible) return null;

  return (
    <>
      {MOROCCO_CITIES.map((city) => (
        <CircleMarker
          key={city.name}
          center={[city.lat, city.lng]}
          radius={4}
          pathOptions={{
            color: "#0f433b",
            fillColor: "#1b6e62",
            fillOpacity: 1,
            weight: 1.5,
          }}
        >
          <Tooltip permanent direction="right" offset={[6, 0]} className="city-label">
            {city.name}
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}
