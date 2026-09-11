import { useEffect, useRef, useState } from "react";

import {
  Building2,
  ChevronRight,
  MapPin,
  Pill,
  Plus,
  Stethoscope,
} from "lucide-react";

import { getMapTypeColor } from "./mapColors";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./SqlExplorer.css";

interface SqlResult {
  id: string | number;
  nom: string;
  type: string;
  commune?: string;
  province?: string;
  longitude?: number;
  latitude?: number;
}

/* =========================================================
   MAP PANES
========================================================= */

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

/* =========================================================
   AUTO FIT MAP
========================================================= */

function MapAutoFit({
  results,
}: {
  results: SqlResult[];
}) {
  const map = useMap();

  useEffect(() => {
    const points = results
      .filter(
        (result) =>
          Number.isFinite(result.latitude) &&
          Number.isFinite(result.longitude),
      )
      .map(
        (result) =>
          [result.latitude!, result.longitude!] as [
            number,
            number,
          ],
      );

    if (points.length === 0) {
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 12);
      return;
    }

    map.fitBounds(points, {
      padding: [80, 80],
      maxZoom: 9,
    });
  }, [results, map]);

  return null;
}

/* =========================================================
   FOCUS SELECTED RESULT
========================================================= */

function FocusResult({
  result,
  markerRefs,
}: {
  result: SqlResult | null;
  markerRefs: React.MutableRefObject<
    Record<string, L.Marker | null>
  >;
}) {
  const map = useMap();

  useEffect(() => {
    if (!result) {
      return;
    }

    if (
      !Number.isFinite(result.latitude) ||
      !Number.isFinite(result.longitude)
    ) {
      return;
    }

    const position: [number, number] = [
      result.latitude!,
      result.longitude!,
    ];

    map.flyTo(position, 13, {
      duration: 1.2,
    });

    const marker = markerRefs.current[String(result.id)];

    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 900);
    }
  }, [result, map, markerRefs]);

  return null;
}

/* =========================================================
   TYPE HELPERS
========================================================= */

function normalizeType(type: string) {
  const value = type.trim().toLowerCase();

  if (
    value.includes("hospital") ||
    value.includes("hôpital") ||
    value.includes("hopital")
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
    value.includes("doctors") ||
    value.includes("médecin") ||
    value.includes("medecin")
  ) {
    return "doctor";
  }

  if (
    value.includes("primary") ||
    value.includes("soin") ||
    value.includes("centre de santé") ||
    value.includes("centre de sante")
  ) {
    return "primary";
  }

  return "other";
}

function getTypeLabel(type: string) {
  switch (normalizeType(type)) {
    case "hospital":
      return "HÔPITAL";

    case "clinic":
      return "CLINIQUE";

    case "pharmacy":
      return "PHARMACIE";

    case "doctor":
      return "MÉDECIN";

    case "primary":
      return "CENTRE DE SANTÉ";

    default:
      return type.toUpperCase();
  }
}

function getTypeIcon(type: string) {
  switch (normalizeType(type)) {
    case "hospital":
      return <Building2 size={17} strokeWidth={1.7} />;

    case "clinic":
      return <Building2 size={17} strokeWidth={1.7} />;

    case "pharmacy":
      return <Pill size={17} strokeWidth={1.7} />;

    case "doctor":
      return <Stethoscope size={17} strokeWidth={1.7} />;

    case "primary":
      return <Plus size={19} strokeWidth={2.2} />;

    default:
      return <Building2 size={17} strokeWidth={1.7} />;
  }
}

function getTypeClass(type: string) {
  const normalized = normalizeType(type);

  return normalized
    ? `sql-result-card--${normalized}`
    : "sql-result-card--other";
}

/* =========================================================
   MARKER ICON
========================================================= */

function getMarkerSvg(type: string) {
  const normalized = normalizeType(type);

  if (normalized === "hospital") {
    return `
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 21V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15"/>
        <path d="M9 21v-5h6v5"/>
        <path d="M12 7v5"/>
        <path d="M9 9.5h6"/>
      </svg>
    `;
  }

  if (normalized === "clinic") {
    return `
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16"/>
        <path d="M8 7h2"/>
        <path d="M14 7h2"/>
        <path d="M8 11h2"/>
        <path d="M14 11h2"/>
        <path d="M10 21v-5h4v5"/>
      </svg>
    `;
  }

  if (normalized === "pharmacy") {
    return `
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m7 7 10 10"/>
        <path d="M17 7 7 17"/>
        <rect x="5" y="5" width="14" height="14" rx="5"/>
      </svg>
    `;
  }

  if (normalized === "doctor") {
    return `
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 4v5a5 5 0 0 0 10 0V4"/>
        <path d="M5 4h4"/>
        <path d="M11 4h4"/>
        <path d="M15 14a4 4 0 0 0 4 4"/>
        <circle cx="19" cy="19" r="2"/>
      </svg>
    `;
  }

  return `
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="white"
      stroke-width="2.5"
      stroke-linecap="round"
    >
      <path d="M12 5v14"/>
      <path d="M5 12h14"/>
    </svg>
  `;
}

function createEstablishmentIcon(type: string) {
  const color = getMapTypeColor(type);

  return L.divIcon({
    className: "sql-marker-wrapper",

    html: `
      <div
        class="sql-marker"
        style="
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

/* =========================================================
   LEGEND
========================================================= */

const LEGEND_ITEMS = [
  {
    label: "Hôpitaux",
    type: "hospital",
  },
  {
    label: "Cliniques",
    type: "clinic",
  },
  {
    label: "Pharmacies",
    type: "pharmacy",
  },
  {
    label: "Médecins",
    type: "doctors",
  },

];

/* =========================================================
   SQL EXPLORER
========================================================= */

export function SqlExplorer() {
  const [sql, setSql] = useState(`SELECT
  id,
  nom,
  type,
  commune,
  province,
  ST_X(geometry) AS longitude,
  ST_Y(geometry) AS latitude
FROM medical_data_records
WHERE type = 'hospital'
  AND geometry IS NOT NULL;`);

  const [results, setResults] = useState<SqlResult[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [selectedResult, setSelectedResult] =
    useState<SqlResult | null>(null);

  const markerRefs = useRef<
    Record<string, L.Marker | null>
  >({});

  /* =======================================================
     EXECUTE SQL
  ======================================================= */

  async function executeSql() {
    setLoading(true);
    setError("");
    setSelectedResult(null);

    try {
      const response = await fetch(
        "http://localhost:3000/sql/query",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            sql,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `SQL query failed (${response.status})`,
        );
      }

      const parsedRows: SqlResult[] = (
        data.rows ?? []
      ).map((row: any[]) => ({
        id: row[0],
        nom: row[1],
        type: row[2],
        commune: row[3],
        province: row[4],
        longitude: Number(row[5]),
        latitude: Number(row[6]),
      }));

      markerRefs.current = {};

      setResults(parsedRows);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "SQL query failed",
      );

      setResults([]);
      setSelectedResult(null);
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="sql-explorer">

      {/* ===================================================
          SQL EDITOR
      =================================================== */}

      <div className="sql-editor">
        <div className="sql-editor__header">

          <div className="sql-editor__title">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
              />

              <line
                x1="9"
                y1="9"
                x2="15"
                y2="9"
              />

              <line
                x1="9"
                y1="15"
                x2="15"
                y2="15"
              />
            </svg>

            SQL Explorer
          </div>

          <button
            type="button"
            className={`sql-editor__run ${
              loading ? "loading" : ""
            }`}
            onClick={executeSql}
            disabled={loading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>

            {loading ? "Exécution..." : "Exécuter"}
          </button>

        </div>

        <textarea
          value={sql}
          onChange={(event) =>
            setSql(event.target.value)
          }
          spellCheck={false}
          placeholder="Écrivez votre requête SQL..."
          className="sql-editor__textarea"
        />

        {error && (
          <div className="sql-error">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />

              <line
                x1="12"
                y1="8"
                x2="12"
                y2="12"
              />

              <line
                x1="12"
                y1="16"
                x2="12.01"
                y2="16"
              />
            </svg>

            {error}
          </div>
        )}

        <div className="sql-stats">

          <div className="sql-stat">
            <span className="sql-stat__label">
              Résultats
            </span>

            <span className="sql-stat__value">
              {results.length}
            </span>
          </div>

          <div className="sql-stat">
            <span className="sql-stat__label">
              Statut
            </span>

            <span
              className={`sql-stat__value ${
                loading
                  ? "loading"
                  : results.length > 0
                    ? "success"
                    : "idle"
              }`}
            >
              {loading
                ? "En cours..."
                : results.length > 0
                  ? "✓ Succès"
                  : "—"}
            </span>
          </div>

        </div>
      </div>

      {/* ===================================================
          MAP
      =================================================== */}

      <div className="sql-map">
        <MapContainer
          center={[31.7, -6.5]}
          zoom={6}
          minZoom={4}
          maxZoom={19}
          className="sql-map__container"
          zoomControl={false}
        >
          <MapPanes />

          <MapAutoFit results={results} />

          <FocusResult
            result={selectedResult}
            markerRefs={markerRefs}
          />

          {/* ESRI SATELLITE */}
          <TileLayer
            pane="basemap"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="© Esri"
            maxZoom={19}
          />

          {/* ESRI CITY / PLACE LABELS */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            attribution="© Esri"
            maxZoom={19}
            opacity={1}
            zIndex={500}
          />

          <ZoomControl position="topleft" />

          {results.map((result, index) => {
            if (
              !Number.isFinite(result.latitude) ||
              !Number.isFinite(result.longitude)
            ) {
              return null;
            }

            const markerColor = getMapTypeColor(result.type);

            return (
              <Marker
                key={`${result.id}-${index}`}
                position={[
                  result.latitude!,
                  result.longitude!,
                ]}
                icon={createEstablishmentIcon(result.type)}
                ref={(marker) => {
                  markerRefs.current[String(result.id)] = marker;
                }}
                eventHandlers={{
                  click: (event) => {
                    setSelectedResult(result);
                    event.target.openPopup();
                  },
                }}
              >
                <Popup
                  className="sql-popup"
                  closeButton={true}
                  autoPan={true}
                  autoPanPadding={[40, 40]}
                >
                  <div className="sql-popup__content">
                    <div
                      className={`sql-popup__type sql-popup__type--${normalizeType(
                        result.type,
                      )}`}
                      style={{ color: markerColor }}
                    >
                      {getTypeLabel(result.type)}
                    </div>

                    <div className="sql-popup__name">
                      {result.nom || "Établissement sans nom"}
                    </div>

                    <div className="sql-popup__location">
                      <MapPin size={14} strokeWidth={1.8} />
                      <span>
                        {result.commune ||
                          result.province ||
                          "Localisation inconnue"}
                      </span>
                    </div>

                    {result.province &&
                      result.commune &&
                      result.province !== result.commune && (
                        <div className="sql-popup__province">
                          {result.province}
                        </div>
                      )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {results.length > 0 && (
          <div className="sql-map__result-card">
            <div className="sql-map__result-icon">
              <MapPin size={18} strokeWidth={1.8} />
            </div>

            <div className="sql-map__result-content">
              <div className="sql-map__result-eyebrow">
                RÉSULTATS SQL
              </div>

              <div className="sql-map__result-title">
                Établissements trouvés
              </div>

              <div className="sql-map__result-count">
                {results.length} établissements
              </div>
            </div>
          </div>
        )}

        <div className="sql-map__legend">
          <div className="sql-map__legend-title">
            ÉTABLISSEMENTS
          </div>

          {LEGEND_ITEMS.map((legendItem) => {
            const color = getMapTypeColor(legendItem.type);

            return (
              <div
                key={legendItem.type}
                className="sql-map__legend-item"
              >
                <span
                  className={`sql-map__legend-dot sql-map__legend-dot--${normalizeType(
                    legendItem.type,
                  )}`}
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 9px ${color}`,
                  }}
                >
                  {getTypeIcon(legendItem.type)}
                </span>

                <span>{legendItem.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================================================
          SQL RESULT LIST
      =================================================== */}

      {results.length > 0 && (
        <div className="sql-results">

          {results.map((result, index) => (
            <article
              key={`${result.id}-${index}`}
              className={`sql-result-card ${getTypeClass(
                result.type,
              )}`}
              onClick={() =>
                setSelectedResult(result)
              }
            >

              {/* ICON */}

              <div className="sql-result-card__icon">
                {getTypeIcon(result.type)}
              </div>

              {/* CONTENT */}

              <div className="sql-result-card__content">

                <div className="sql-result-card__name">
                  {result.nom ||
                    "Établissement sans nom"}
                </div>

                <div className="sql-result-card__type">
                  {getTypeLabel(result.type)}
                </div>

                <div className="sql-result-card__location">
                  <MapPin
                    size={12}
                    strokeWidth={1.8}
                  />

                  <span>
                    {result.commune ||
                      result.province ||
                      "Localisation inconnue"}
                  </span>
                </div>

              </div>

              {/* ARROW */}

              <ChevronRight
                size={17}
                strokeWidth={1.6}
                className="sql-result-card__arrow"
              />

            </article>
          ))}

        </div>
      )}

    </div>
  );
}