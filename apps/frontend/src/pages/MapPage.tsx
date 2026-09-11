import { useState } from "react";

import { TopNav } from "../components/navigation/TopNav";
import { DrawMap } from "../components/workspace/DrawMap";
import { ResultsPanel } from "../components/workspace/ResultsPanel";

import { queryZone } from "../api/client";

import type {
  Establishment,
  GeoJSONPolygon,
} from "../api/client";

import "./MapPage.css";

type QueryStatus = "idle" | "loading" | "error" | "done";

export function MapPage() {
  const [status, setStatus] = useState<QueryStatus>("idle");

  const [establishments, setEstablishments] =
    useState<Establishment[]>([]);

  // 👇 The result currently selected from the list
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<Establishment | null>(null);

  async function handleZoneDrawn(polygon: GeoJSONPolygon) {
    setStatus("loading");

    // Clear previous selection
    setSelectedEstablishment(null);

    try {
      const result = await queryZone(polygon);

      setEstablishments(result.establishments);
      setStatus("done");
    } catch (error) {
      console.error("Zone query failed:", error);
      setStatus("error");
    }
  }

  function handleCleared() {
    setEstablishments([]);
    setSelectedEstablishment(null);
    setStatus("idle");
  }

  return (
    <>
      <TopNav />

      <main className="map-page">

        <section className="map-page__header">
          <div>
            <div className="map-page__eyebrow">
              CARTE & EXPLORATION
            </div>

            <h1 className="map-page__title">
              Explorez les données <span>de santé</span> autour de vous.
            </h1>

            <p className="map-page__description">
              Dessinez une zone sur la carte pour découvrir les établissements de santé disponibles dans votre territoire.
            </p>
          </div>

          <button
            type="button"
            className="map-page__back"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            ← Retour à l'accueil
          </button>
        </section>

        {/* EXISTING MAP — DO NOT REMOVE */}
        <section className="map-page__workspace">
          <DrawMap
            onZoneDrawn={handleZoneDrawn}
            onCleared={handleCleared}
            establishments={establishments}
            selectedEstablishment={selectedEstablishment}
          />

          <ResultsPanel
            status={status}
            count={establishments.length}
            establishments={establishments}
            onEstablishmentClick={setSelectedEstablishment}
          />
        </section>

      </main>
    </>
  );
}