import { Marker, Tooltip } from "react-leaflet";

import L from "leaflet";

import { MOROCCO_CITIES } from "./cities";

const invisibleIcon = L.divIcon({
  className: "city-marker",
  html: "",
  iconSize: [1, 1],
});

export function CityLabels() {
  return (
    <>
      {MOROCCO_CITIES.map((city) => (
        <Marker
          key={city.name}
          position={[city.lat, city.lng]}
          icon={invisibleIcon}
          interactive={false}
        >
          <Tooltip
            permanent
            direction="top"
            offset={[0, -4]}
            className="city-label"
          >
            {city.name}
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}