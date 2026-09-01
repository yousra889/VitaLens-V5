import { useState } from "react";

import {
  Code2,
  Map as MapIcon,
  Search,
  Sparkles,
} from "lucide-react";

import { queryZone } from "../api/client";

import type {
  Establishment,
  GeoJSONPolygon,
} from "../api/client";

import { AppShell } from "../components/layout/AppShell";

import { DrawMap } from "../components/workspace/DrawMap.tsx";

import { ResultsPanel } from "../components/workspace/ResultsPanel.tsx";

import { SqlExplorer } from "../components/workspace/SqlExplorer.tsx";

import "./HomePage.css";

type QueryStatus = "idle" | "loading" | "error" | "done";

type Mode = "draw" | "sql";

export function HomePage() {
  const [mode, setMode] = useState<Mode>("draw");

  const [status, setStatus] =
    useState<QueryStatus>("idle");

  const [establishments, setEstablishments] =
    useState<Establishment[]>([]);

  async function handleZoneDrawn(
    polygon: GeoJSONPolygon,
  ) {
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

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
  }

  return (
    <AppShell>
      <div className="home-page">
        <section className="hero" id="explore">
          <div className="hero__background" />

          <div className="hero__content">
            <div className="hero__eyebrow">
              <Sparkles size={14} />
              <span>Morocco health intelligence</span>
            </div>

            <h1 className="hero__title">
              See Morocco&apos;s
              <br />
              healthcare infrastructure
              <span className="hero__gradient">
                {" "}with clarity.
              </span>
            </h1>

            <p className="hero__subtitle">
              Explore, analyze, and query healthcare
              establishments across Morocco through
              interactive geographic data.
            </p>

            <div className="hero__actions">
              <a
                className="button button--primary"
                href="#workspace"
              >
                <Search size={17} />
                Explore data
              </a>

              <button
                className="button button--secondary"
                onClick={() => switchMode("sql")}
              >
                <Code2 size={17} />
                Open SQL Explorer
              </button>
            </div>
          </div>

          <div className="hero__metrics">
            <div className="metric-card metric-card--primary">
              <span className="metric-card__label">
                Platform
              </span>

              <span className="metric-card__value">
                Live
              </span>

              <span className="metric-card__meta">
                Gateway connected
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-card__label">
                Coverage
              </span>

              <span className="metric-card__value">
                Morocco
              </span>

              <span className="metric-card__meta">
                Geographic health data
              </span>
            </div>
          </div>
        </section>

        <section
          className="workspace-section"
          id="workspace"
        >
          <div className="workspace-section__header">
            <div>
              <span className="section-label">
                Workspace
              </span>

              <h2>
                Explore the data your way.
              </h2>
            </div>

            <div className="mode-switcher">
              <button
                className={`mode-switcher__button ${
                  mode === "draw"
                    ? "mode-switcher__button--active"
                    : ""
                }`}
                onClick={() => switchMode("draw")}
              >
                <MapIcon size={16} />
                Map
              </button>

              <button
                id="sql"
                className={`mode-switcher__button ${
                  mode === "sql"
                    ? "mode-switcher__button--active"
                    : ""
                }`}
                onClick={() => switchMode("sql")}
              >
                <Code2 size={16} />
                SQL Explorer
              </button>
            </div>
          </div>

          <div
            className={`workspace workspace--${mode}`}
          >
            {mode === "draw" && (
              <>
                <div className="workspace__map">
                  <DrawMap
                    onZoneDrawn={handleZoneDrawn}
                    onCleared={handleCleared}
                  />
                </div>

                <ResultsPanel
                  status={status}
                  count={establishments.length}
                  establishments={establishments}
                />
              </>
            )}

            {mode === "sql" && (
              <SqlExplorer />
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}