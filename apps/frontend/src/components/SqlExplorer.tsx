import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

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

function MapAutoFit({ results }: { results: SqlResult[] }) {
  const map = useMap();

  useEffect(() => {
    const points = results
      .filter(
        (item) =>
          Number.isFinite(item.latitude) &&
          Number.isFinite(item.longitude),
      )
      .map((item) => {
        return [item.latitude!, item.longitude!] as [number, number];
      });

    console.log("VALID MAP POINTS:", points.length);

    if (points.length === 0) {
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 12);
      return;
    }

    map.fitBounds(points, {
      padding: [40, 40],
      maxZoom: 12,
    });
  }, [results, map]);

  return null;
}

export function SqlExplorer() {
  const [sql, setSql] = useState(
    `SELECT
  id,
  nom,
  type,
  commune,
  province,
  ST_X(geometry) AS longitude,
  ST_Y(geometry) AS latitude
FROM medical_data_records
WHERE type = 'hospital'
  AND geometry IS NOT NULL;`,
  );

  const [results, setResults] = useState<SqlResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function executeSql() {
    setLoading(true);
    setError("");

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

      console.log("SQL RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `SQL query failed (${response.status})`,
        );
      }

      /*
       * Backend returns SQL rows as arrays:
       *
       * [
       *   id,
       *   nom,
       *   type,
       *   commune,
       *   province,
       *   longitude,
       *   latitude
       * ]
       */

      const parsedRows: SqlResult[] = (data.rows ?? []).map(
        (row: any[]) => ({
          id: row[0],
          nom: row[1],
          type: row[2],
          commune: row[3],
          province: row[4],
          longitude: Number(row[5]),
          latitude: Number(row[6]),
        }),
      );

      console.log("PARSED ROWS:", parsedRows);

      console.log(
        "MAP POINTS:",
        parsedRows.map((item) => ({
          id: item.id,
          nom: item.nom,
          longitude: item.longitude,
          latitude: item.latitude,
        })),
      );

      const validPoints = parsedRows.filter(
        (item) =>
          Number.isFinite(item.latitude) &&
          Number.isFinite(item.longitude),
      );

      console.log(
        "VALID MAP POINTS:",
        validPoints.length,
      );

      setResults(parsedRows);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "SQL query failed",
      );

      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sql-explorer">
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

      <div className="sql-map">
        <MapContainer
          center={[31.5, -7]}
          zoom={6}
          className="sql-map__container"
        >
          <MapAutoFit results={results} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {results.map((item, index) => {
            if (
              !Number.isFinite(item.latitude) ||
              !Number.isFinite(item.longitude)
            ) {
              return null;
            }

            return (
              <CircleMarker
                key={`${item.id}-${index}`}
                center={[
                  item.latitude!,
                  item.longitude!,
                ]}
                radius={8}
                fillColor="#00d4aa"
                color="#ffffff"
                weight={2}
                opacity={1}
                fillOpacity={1}
              >
                <Popup className="sql-popup">
                  <div className="sql-popup__content">
                    <div className="sql-popup__name">
                      {item.nom}
                    </div>

                    <div className="sql-popup__type">
                      {item.type}
                    </div>

                    {item.commune && (
                      <div className="sql-popup__meta">
                        {item.commune}
                      </div>
                    )}

                    {item.province && (
                      <div className="sql-popup__meta">
                        {item.province}
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
} 