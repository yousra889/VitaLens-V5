import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { CityLabels } from "./CityLabels";
import { DrawControl } from "./DrawControl";
import { getMapTypeColor } from "./mapColors";

import type {
  Establishment,
  GeoJSONPolygon,
} from "../../api/client";

import "./DrawMap.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MOROCCO_CENTER: [number, number] = [31.7, -6.5];

interface DrawMapProps {
  onZoneDrawn: (polygon: GeoJSONPolygon) => void;
  onCleared: () => void;
  establishments: Establishment[];
  selectedEstablishment?: Establishment | null;
}

/* -------------------------------------------------------
   MAP PANES
------------------------------------------------------- */

function MapPanes() {
  const map = useMap();

  useEffect(() => {
    if (!map.getPane("basemap")) {
      map.createPane("basemap");
    }

    const basemapPane = map.getPane("basemap");

    if (basemapPane) {
      basemapPane.style.zIndex = "200";
    }
  }, [map]);

  return null;
}

function FocusEstablishment({
  establishment,
}: {
  establishment?: Establishment | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!establishment?.geometry?.coordinates) return;

    const [longitude, latitude] =
      establishment.geometry.coordinates;

    map.flyTo([latitude, longitude], 15, {
      duration: 1.2,
    });

    // Wait until the map finishes moving, then open
    // the popup belonging to the selected marker.
    const openSelectedPopup = () => {
      map.eachLayer((layer) => {
        if (
          layer instanceof L.Marker &&
          layer.getLatLng().lat === latitude &&
          layer.getLatLng().lng === longitude
        ) {
          layer.openPopup();
        }
      });
    };

    map.once("moveend", openSelectedPopup);

    return () => {
      map.off("moveend", openSelectedPopup);
    };
  }, [establishment, map]);

  return null;
}

/* -------------------------------------------------------
   MARKER ICONS
------------------------------------------------------- */

function getMarkerSvg(type: string) {
  const normalized = type
    .trim()
    .toLowerCase();

  if (
    normalized.includes("hospital") ||
    normalized.includes("hôpital")
  ) {
    return `
      <svg viewBox="0 0 24 24" width="17" height="17"
        fill="none" stroke="white" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 21V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15"/>
        <path d="M9 21v-5h6v5"/>
        <path d="M12 7v5"/>
        <path d="M9 9.5h6"/>
      </svg>
    `;
  }

  if (
    normalized.includes("clinic") ||
    normalized.includes("clinique")
  ) {
    return `
      <svg viewBox="0 0 24 24" width="17" height="17"
        fill="none" stroke="white" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16"/>
        <path d="M8 7h2"/>
        <path d="M14 7h2"/>
        <path d="M8 11h2"/>
        <path d="M14 11h2"/>
        <path d="M10 21v-5h4v5"/>
      </svg>
    `;
  }

  if (
    normalized.includes("pharmacy") ||
    normalized.includes("pharmacie")
  ) {
    return `
      <svg viewBox="0 0 24 24" width="17" height="17"
        fill="none" stroke="white" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="m7 7 10 10"/>
        <path d="M17 7 7 17"/>
        <rect x="5" y="5" width="14" height="14" rx="5"/>
      </svg>
    `;
  }

  if (
    normalized.includes("doctor") ||
    normalized.includes("médecin") ||
    normalized.includes("medecin")
  ) {
    return `
      <svg viewBox="0 0 24 24" width="17" height="17"
        fill="none" stroke="white" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 4v5a5 5 0 0 0 10 0V4"/>
        <path d="M5 4h4"/>
        <path d="M11 4h4"/>
        <path d="M15 14a4 4 0 0 0 4 4"/>
        <circle cx="19" cy="19" r="2"/>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" width="18" height="18"
      fill="none" stroke="white" stroke-width="2.5"
      stroke-linecap="round">
      <path d="M12 5v14"/>
      <path d="M5 12h14"/>
    </svg>
  `;
}

function createEstablishmentIcon(type: string) {
  const color = getMapTypeColor(type);

  return L.divIcon({
    className: "vitalens-marker-wrapper",
    html: `
      <div
        class="vitalens-marker"
        style="
          --marker-color: ${color};
          background: ${color};
          box-shadow:
            0 0 0 3px rgba(5,10,14,.78),
            0 0 14px ${color};
        "
      >
        ${getMarkerSvg(type)}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

/* -------------------------------------------------------
   TYPE COUNTS
------------------------------------------------------- */

function normalizeType(type: string) {
  const value = type
    .trim()
    .toLowerCase();

  if (
    value.includes("hospital") ||
    value.includes("hôpital")
  ) {
    return "hospital";
  }

  if (
    value.includes("clinic") ||
    value.includes("clinique")
  ) {
    return "clinic";
  }

  if (
    value.includes("pharmacy") ||
    value.includes("pharmacie")
  ) {
    return "pharmacy";
  }

  if (
    value.includes("doctor") ||
    value.includes("médecin") ||
    value.includes("medecin")
  ) {
    return "doctor";
  }

  if (
    value.includes("primary") ||
    value.includes("soin") ||
    value.includes("santé") ||
    value.includes("sante")
  ) {
    return "primary";
  }

  return "other";
}

export function DrawMap({
  onZoneDrawn,
  onCleared,
  establishments,
  selectedEstablishment,
}: DrawMapProps) {
  const counts = {
    hospital: 0,
    clinic: 0,
    pharmacy: 0,
    doctor: 0,
    primary: 0,
  };

  establishments.forEach((item) => {
    const type = normalizeType(item.type);

    if (type in counts) {
      counts[type as keyof typeof counts] += 1;
    }
  });

  return (
    <div className="draw-map">
      <MapContainer
        center={MOROCCO_CENTER}
        zoom={5.8}
        minZoom={5}
        maxZoom={19}
        maxBounds={[
          [20, -18],
          [38, 4],
        ]}
        maxBoundsViscosity={1}
        className="draw-map__container"
        zoomControl={true}
      >
        <MapPanes />

        <FocusEstablishment establishment={selectedEstablishment} />

        {/* SATELLITE BASEMAP */}
        <TileLayer
          pane="basemap"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="© Esri"
          maxZoom={19}
        />

        {/* MAP LABELS */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          maxZoom={19}
          opacity={0.9}
        />

        <CityLabels />

        <DrawControl
          onZoneDrawn={onZoneDrawn}
          onCleared={onCleared}
        />

        {/* ESTABLISHMENT MARKERS */}
        {establishments.map((establishment) => {
          const [longitude, latitude] = establishment.geometry.coordinates;

          return (
            <Marker
              key={establishment.id}
              position={[latitude, longitude]}
              icon={createEstablishmentIcon(establishment.type)}
              eventHandlers={{
              click: (event) => {
                event.target.openPopup();
              },
            }}
            >
              <Popup
                className="vitalens-popup"
                closeButton={true}
                autoPan={true}
                autoPanPadding={[40, 40]}
              >
                <div className="vitalens-popup__content">

                  <div
                    className={`vitalens-popup__type vitalens-popup__type--${normalizeType(
                      establishment.type,
                    )}`}
                  >
                    {establishment.type}
                  </div>

                  <div className="vitalens-popup__name">
                    {establishment.name || "Établissement sans nom"}
                  </div>

                  <div className="vitalens-popup__location">
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>

                    <span>
                      {establishment.commune ||
                        establishment.province ||
                        "Localisation inconnue"}
                    </span>
                  </div>

                  {establishment.province &&
                    establishment.commune &&
                    establishment.province !== establishment.commune && (
                      <div className="vitalens-popup__province">
                        {establishment.province}
                      </div>
                    )}

                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* SELECTED ZONE */}
      {establishments.length > 0 && (
        <div className="draw-map__zone-card">
          <div className="draw-map__zone-icon">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </div>

          <div>
            <div className="draw-map__zone-count">
              {establishments.length} établissements trouvés dans cette zone
            </div>
          </div>
        </div>
      )}

      {/* LEGEND */}
      <div className="map-legend">
        <div className="map-legend__heading">
          <span>ÉTABLISSEMENTS</span>
        </div>

        <div className="map-legend__item">
          <span className="map-legend__dot map-legend__dot--hospital" />
          <span>Hôpitaux</span>
          <strong>{counts.hospital}</strong>
        </div>

        <div className="map-legend__item">
          <span className="map-legend__dot map-legend__dot--clinic" />
          <span>Cliniques</span>
          <strong>{counts.clinic}</strong>
        </div>

        <div className="map-legend__item">
          <span className="map-legend__dot map-legend__dot--pharmacy" />
          <span>Pharmacies</span>
          <strong>{counts.pharmacy}</strong>
        </div>

        <div className="map-legend__item">
          <span className="map-legend__dot map-legend__dot--doctor" />
          <span>Médecins</span>
          <strong>{counts.doctor}</strong>
        </div>


      </div>

      <div className="draw-map__hint">
        <span className="draw-map__hint-dot" />
        Dessinez une zone pour analyser
      </div>
    </div>
  );
}



