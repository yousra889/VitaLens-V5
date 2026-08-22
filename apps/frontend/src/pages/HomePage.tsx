import { useState } from "react";
import { NavBar } from "../components/NavBar";
import { DrawMap } from "../components/DrawMap";
import { ResultsPanel } from "../components/ResultsPanel";
import { SqlExplorer } from "../components/SqlExplorer";
import { queryZone } from "../api/client";
import type { Establishment, GeoJSONPolygon } from "../api/client";
import "./HomePage.css";

type QueryStatus = "idle" | "loading" | "error" | "done";
type Mode = "draw" | "sql";

export function HomePage() {
  const [mode, setMode] = useState<Mode>("draw");
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [establishments, setEstablishments] = useState<Establishment[]>([]);

  async function handleZoneDrawn(polygon: GeoJSONPolygon) {
    setStatus("loading");
    try {
      const result = await queryZone(polygon);
      setEstablishments(result.establishments);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function handleCleared() {
    setEstablishments([]);
    setStatus("idle");
  }

  return (
    <div className="home">
      <NavBar />

      <section className="home__hero" id="carte">
        <div className="hero__content">
          <h1 className="hero__title">
            Explorez les établissements de santé
            <br />
            <span className="hero__highlight">du Maroc en temps réel</span>
          </h1>
          <p className="hero__subtitle">
            Cartographie interactive et recherche SQL avancée des installations
            médicales
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mode__toggle">
          <button
            className={`mode__btn mode__btn--draw ${
              mode === "draw" ? "active" : ""
            }`}
            onClick={() => setMode("draw")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Dessiner
          </button>

          <button
            className={`mode__btn mode__btn--sql ${mode === "sql" ? "active" : ""}`}
            onClick={() => setMode("sql")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            Requête SQL
          </button>
        </div>
      </section>

      {/* Draw Mode */}
      {mode === "draw" && (
        <section className="home__workspace draw-mode">
          <DrawMap onZoneDrawn={handleZoneDrawn} onCleared={handleCleared} />
          <ResultsPanel
            status={status}
            count={establishments.length}
            establishments={establishments}
          />
        </section>
      )}

      {/* SQL Mode */}
      {mode === "sql" && (
        <section className="home__workspace sql-mode">
          <SqlExplorer />
        </section>
      )}
    </div>
  );
}