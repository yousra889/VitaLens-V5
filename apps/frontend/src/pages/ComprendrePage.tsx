import {
  Activity,
  ArrowLeft,
  Database,
  HeartPulse,
  Hospital,
  MapPinned,
  Users,
} from "lucide-react";

import { TopNav } from "../components/navigation/TopNav";

import "./ComprendrePage.css";

export default function ComprendrePage() {
  return (
    <main className="comprendre-page">
      <TopNav />

      {/* HERO */}
      <section className="comprendre-hero">
        <div className="comprendre-hero-copy">
          <span className="comprendre-eyebrow">
            02 · COMPRENDRE
          </span>

          <h1>
            Une quantité immense
            <br />
            de données.
            <span> Une seule vision.</span>
          </h1>

          <p>
            VitaLens transforme des données sanitaires dispersées
            en une représentation claire du territoire marocain.
          </p>
        </div>

        <a href="/" className="comprendre-back">
          <ArrowLeft size={15} />
          Retour à VitaLens
        </a>
      </section>

      {/* MAIN VISUAL */}
      <section className="comprendre-visual-section">
        <div className="visual-grid">

          {/* LEFT INFORMATION PANEL */}
          <div className="info-panel establishments-panel">
            <div className="panel-top">
              <div className="panel-icon cyan">
                <Hospital size={18} />
              </div>

              <span>01</span>
            </div>

            <div className="panel-number">
              12<span>k</span>
            </div>

            <h3>Établissements</h3>

            <p>
              Hôpitaux, cliniques et centres de santé
              référencés dans VitaLens.
            </p>

            <div className="panel-line">
              <span />
            </div>

            <div className="panel-meta">
              <span>DONNÉES SANITAIRES</span>
              <Activity size={13} />
            </div>
          </div>

          {/* CENTER VISUAL */}
          <div className="health-core">

            <div className="core-orbit orbit-one" />
            <div className="core-orbit orbit-two" />
            <div className="core-orbit orbit-three" />

            <div className="core-ring">
              <div className="core-inner">
                <HeartPulse size={34} />
              </div>
            </div>

            {/* DATA POINTS */}
            <span className="data-point point-one" />
            <span className="data-point point-two" />
            <span className="data-point point-three" />
            <span className="data-point point-four" />
            <span className="data-point point-five" />
            <span className="data-point point-six" />
            <span className="data-point point-seven" />
            <span className="data-point point-eight" />

            {/* CONNECTIONS */}
            <div className="connection connection-one" />
            <div className="connection connection-two" />
            <div className="connection connection-three" />
            <div className="connection connection-four" />

            <div className="core-label">
              <span>VITALENS</span>
              <small>HEALTH DATA NETWORK</small>
            </div>
          </div>

          {/* RIGHT INFORMATION PANEL */}
          <div className="info-panel professionals-panel">
            <div className="panel-top">
              <div className="panel-icon violet">
                <Users size={18} />
              </div>

              <span>02</span>
            </div>

            <div className="panel-number">
              24<span>k</span>
            </div>

            <h3>Professionnels</h3>

            <p>
              Médecins et professionnels de santé
              associés aux données territoriales.
            </p>

            <div className="panel-line violet-line">
              <span />
            </div>

            <div className="panel-meta">
              <span>PROFILS SANITAIRES</span>
              <Users size={13} />
            </div>
          </div>

        </div>
      </section>

      {/* GEOGRAPHIC SECTION */}
      <section className="comprendre-geo">

        <div className="geo-header">
          <div>
            <span className="comprendre-eyebrow">
              03 · LOCALISATION
            </span>

            <h2>
              Chaque donnée
              <span> prend une dimension géographique.</span>
            </h2>
          </div>

          <div className="geo-status">
            <span />
            TERRITOIRE MAROCAIN
          </div>
        </div>

        <div className="geo-visual">

          {/* ABSTRACT MOROCCO */}
          <div className="morocco-map">

            <div className="map-grid" />

            <div className="morocco-shape">
              <span className="map-node node-1" />
              <span className="map-node node-2" />
              <span className="map-node node-3" />
              <span className="map-node node-4" />
              <span className="map-node node-5" />
              <span className="map-node node-6" />
              <span className="map-node node-7" />
              <span className="map-node node-8" />
              <span className="map-node node-9" />

              <div className="map-connection map-connection-1" />
              <div className="map-connection map-connection-2" />
              <div className="map-connection map-connection-3" />
              <div className="map-connection map-connection-4" />

              <div className="map-center-label">
                <strong>MAROC</strong>
                <small>DATA TERRITORY</small>
              </div>
            </div>

            <div className="map-side-label label-top">
              <span>DATA POINT</span>
              <strong>LOCALISÉ</strong>
            </div>

            <div className="map-side-label label-bottom">
              <span>COUVERTURE</span>
              <strong>TERRITORIALE</strong>
            </div>
          </div>

          {/* GEO INFO */}
          <div className="geo-information">

            <div className="geo-card">
              <div className="geo-card-icon">
                <MapPinned size={18} />
              </div>

              <div>
                <span>LOCALISATION</span>
                <strong>Données géographiques</strong>
              </div>
            </div>

            <div className="geo-card">
              <div className="geo-card-icon blue">
                <Database size={18} />
              </div>

              <div>
                <span>STRUCTURATION</span>
                <strong>Données harmonisées</strong>
              </div>
            </div>

            <div className="geo-description">
              <span className="small-line" />

              <p>
                Une information sanitaire n'est plus seulement
                une donnée. Elle devient un élément du territoire.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* DATA FLOW */}
      <section className="data-flow-section">

        <span className="comprendre-eyebrow">
          04 · UNIFIER
        </span>

        <h2>
          Plusieurs sources.
          <span> Une seule vision.</span>
        </h2>

        <div className="data-flow">

          <div className="flow-source">
            <span>01</span>
            <strong>Sources sanitaires</strong>
            <small>Données institutionnelles</small>
          </div>

          <div className="flow-line">
            <span />
          </div>

          <div className="flow-core">
            <HeartPulse size={22} />
            <strong>VITALENS</strong>
            <small>HARMONISATION</small>
          </div>

          <div className="flow-line">
            <span />
          </div>

          <div className="flow-source">
            <span>02</span>
            <strong>Données géographiques</strong>
            <small>Localisation du territoire</small>
          </div>

        </div>

        <div className="final-message">
          <p>
            Transformer la donnée brute
            <span> en compréhension.</span>
          </p>
        </div>

      </section>

    </main>
  );
}