import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Database,
  Globe2,
  HeartPulse,
  Map,
  ShieldCheck,
  Sparkles,
  Activity,
  Search,
  Stethoscope,
  Pill,
  Hospital,
  Users,
  Code2,
  Layers3,
} from "lucide-react";

import "./HomePage.css";
import { useEffect, useState } from "react";
import { TopNav } from "../components/navigation/TopNav";


function MoroccoIllustration() {
  return (
    <div className="morocco-art">
      <div className="art-glow glow-one" />
      <div className="art-glow glow-two" />

      <svg
        viewBox="0 0 700 560"
        className="morocco-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mapStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#24f4e4" />
            <stop offset="50%" stopColor="#25a9ff" />
            <stop offset="100%" stopColor="#7167ff" />
          </linearGradient>

          <radialGradient id="mapFill">
            <stop offset="0%" stopColor="#1de5dc" stopOpacity=".22" />
            <stop offset="100%" stopColor="#126b9e" stopOpacity=".02" />
          </radialGradient>

          <filter id="neon">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M164 72
             L235 42
             L304 65
             L351 108
             L431 117
             L485 151
             L500 211
             L462 254
             L423 288
             L398 347
             L350 375
             L331 424
             L285 454
             L251 496
             L211 470
             L187 422
             L150 389
             L125 336
             L101 293
             L111 243
             L145 207
             L137 163
             Z"
          fill="url(#mapFill)"
          stroke="url(#mapStroke)"
          strokeWidth="3"
          filter="url(#neon)"
        />

        <g className="map-lines">
          <path d="M160 90 L285 150 L425 137 L470 208" />
          <path d="M125 243 L250 220 L410 290 L350 375" />
          <path d="M145 207 L230 310 L211 470" />
          <path d="M250 220 L285 150 L350 375 L251 496" />
          <path d="M425 137 L398 347 L285 454" />
          <path d="M101 293 L230 310 L331 424" />
          <path d="M150 389 L211 470 L251 496" />
        </g>

        <g className="map-nodes">
          {[
            [164, 72],
            [235, 42],
            [304, 65],
            [351, 108],
            [431, 117],
            [485, 151],
            [500, 211],
            [462, 254],
            [423, 288],
            [398, 347],
            [350, 375],
            [331, 424],
            [285, 454],
            [251, 496],
            [211, 470],
            [187, 422],
            [150, 389],
            [125, 336],
            [101, 293],
            [111, 243],
            [145, 207],
            [137, 163],
            [230, 310],
            [285, 150],
            [250, 220],
            [410, 290],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i % 5 === 0 ? 5 : 2.7}
              className={i % 5 === 0 ? "big-node" : ""}
            />
          ))}
        </g>

        <g className="map-pins">
          <g transform="translate(300 175)">
            <circle r="14" className="pin-ring" />
            <circle r="5" />
          </g>

          <g transform="translate(388 244)">
            <circle r="11" className="pin-ring" />
            <circle r="4" />
          </g>

          <g transform="translate(215 322)">
            <circle r="11" className="pin-ring" />
            <circle r="4" />
          </g>
        </g>
      </svg>

      <div className="floating-data-card card-one">
        <span>🏥</span>
        <div>
          <b>12 253</b>
          <small>établissements</small>
        </div>
      </div>

      <div className="floating-data-card card-two">
        <span>📍</span>
        <div>
          <b>12 régions</b>
          <small>couverture nationale</small>
        </div>
      </div>

      <div className="floating-data-card card-three">
        <span>✨</span>
        <div>
          <b>LIVE DATA</b>
          <small>Sources synchronisées</small>
        </div>
      </div>
    </div>
  );
}

function DataIllustration() {
  return (
    <div className="data-art">
      <div className="data-orbit orbit-a" />
      <div className="data-orbit orbit-b" />

      <div className="data-center">
        <span>🏥</span>
        <strong>12 253</strong>
        <small>DATA POINTS</small>
      </div>

      <div className="data-node node-hospital">
        <Hospital size={20} />
        <b>384</b>
        <span>Hôpitaux</span>
      </div>

      <div className="data-node node-doctors">
        <Stethoscope size={20} />
        <b>691</b>
        <span>Médecins</span>
      </div>

      <div className="data-node node-pharmacy">
        <Pill size={20} />
        <b>7 610</b>
        <span>Pharmacies</span>
      </div>

      <div className="data-node node-care">
        <HeartPulse size={20} />
        <b>3 184</b>
        <span>Soins primaires</span>
      </div>

      <div className="data-bars">
        <span style={{ height: "32%" }} />
        <span style={{ height: "48%" }} />
        <span style={{ height: "62%" }} />
        <span style={{ height: "43%" }} />
        <span style={{ height: "78%" }} />
        <span style={{ height: "91%" }} />
      </div>
    </div>
  );
}

function SourcesIllustration() {
  return (
    <div className="sources-art">
      <div className="source-core">
        <Sparkles size={27} />
        <strong>VitaLens</strong>
        <small>Unified health data</small>
      </div>

      <div className="source-line line-a" />
      <div className="source-line line-b" />
      <div className="source-line line-c" />
      <div className="source-line line-d" />

      <div className="source-orb orb-data">
        <span>🇲🇦</span>
        <b>Data.gov.ma</b>
        <small>Primary Care</small>
      </div>

      <div className="source-orb orb-osm">
        <Globe2 />
        <b>OpenStreetMap</b>
        <small>Healthcare</small>
      </div>

      <div className="source-orb orb-ministry">
        <span>🏥</span>
        <b>Offre de soins</b>
        <small>Indicators</small>
      </div>

      <div className="source-orb orb-hospitals">
        <span>🏨</span>
        <b>Hospitals</b>
        <small>2022 dataset</small>
      </div>
    </div>
  );
}

function MapIllustration() {
  return (
    <div className="map-art">
      <div className="map-topbar">
        <span>
          <span className="live-dot" /> LIVE
        </span>
        <small>MAROC · HEALTH MAP</small>
        <span>12 253 points</span>
      </div>

      <div className="map-background">
        <div className="map-grid-lines" />

        <svg viewBox="0 0 700 430" className="map-art-svg">
          <defs>
            <linearGradient id="mapArtGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#20e9df" />
              <stop offset="100%" stopColor="#477dff" />
            </linearGradient>
          </defs>

          <path
            d="M172 52 L255 30 L332 58 L384 95 L462 103
               L519 143 L534 202 L490 240 L452 278
               L421 329 L370 352 L344 391 L290 408
               L247 382 L220 338 L179 315 L148 263
               L118 224 L130 176 L163 139 L153 92 Z"
            fill="rgba(23,210,210,.07)"
            stroke="url(#mapArtGradient)"
            strokeWidth="2"
          />

          {Array.from({ length: 48 }).map((_, i) => {
            const x = 145 + ((i * 47) % 370);
            const y = 70 + ((i * 71) % 300);

            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={i % 7 === 0 ? 5 : 2}
                  className="map-art-point"
                />
                {i % 5 === 0 && (
                  <line
                    x1={x}
                    y1={y}
                    x2={x + 35}
                    y2={y - 18}
                    className="map-art-connection"
                  />
                )}
              </g>
            );
          })}
        </svg>

        <div className="map-tooltip tooltip-a">
          🏥 Hôpital
          <b>384</b>
        </div>

        <div className="map-tooltip tooltip-b">
          💊 Pharmacies
          <b>7 610</b>
        </div>

        <div className="map-legend">
          <span><i className="legend-hospital" /> Hôpital</span>
          <span><i className="legend-clinic" /> Clinique</span>
          <span><i className="legend-pharmacy" /> Pharmacie</span>
          <span><i className="legend-doctor" /> Médecin</span>
        </div>
      </div>
    </div>
  );
}

function SQLIllustration() {
  return (
    <div className="sql-art">
      <div className="sql-glow" />

      <div className="database-stack">
        <div className="db-cylinder">
          <div className="db-top" />
          <div className="db-body">
            <Database size={32} />
          </div>
          <div className="db-bottom" />
        </div>

        <div className="db-cylinder second">
          <div className="db-top" />
          <div className="db-body">
            <Database size={27} />
          </div>
          <div className="db-bottom" />
        </div>

        <div className="db-cylinder third">
          <div className="db-top" />
          <div className="db-body">
            <Database size={23} />
          </div>
          <div className="db-bottom" />
        </div>
      </div>

      <div className="sql-window">
        <div className="sql-window-head">
          <span />
          <span />
          <span />
          <small>vitalens.sql</small>
        </div>

        <div className="sql-code">
          <em>SELECT</em>{" "}
          <strong>type</strong>, <strong>COUNT</strong>(*)
          <br />
          <em>FROM</em> medical_data_records
          <br />
          <em>GROUP BY</em> type
          <br />
          <em>ORDER BY</em> COUNT(*) DESC;
        </div>

        <div className="sql-result">
          <div><span>pharmacy</span><b>7610</b></div>
          <div><span>primary_care</span><b>3184</b></div>
          <div><span>doctors</span><b>691</b></div>
          <div><span>clinic</span><b>384</b></div>
          <div><span>hospital</span><b>384</b></div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsIllustration() {
  return (
    <div className="analytics-art">
      <div className="analytics-header">
        <span>Healthcare coverage</span>
        <b>2026</b>
      </div>

      <div className="analytics-chart">
        <div className="chart-y">
          <span>10k</span>
          <span>7.5k</span>
          <span>5k</span>
          <span>2.5k</span>
          <span>0</span>
        </div>

        <div className="chart-area">
          <div className="chart-grid" />

          <svg viewBox="0 0 600 270" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#20e8dc" stopOpacity=".3" />
                <stop offset="100%" stopColor="#20e8dc" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d="M0 220
                 L75 178
                 L150 155
                 L225 178
                 L300 103
                 L375 125
                 L450 82
                 L525 100
                 L600 35
                 L600 270
                 L0 270 Z"
              fill="url(#areaFill)"
            />

            <path
              d="M0 220
                 L75 178
                 L150 155
                 L225 178
                 L300 103
                 L375 125
                 L450 82
                 L525 100
                 L600 35"
              fill="none"
              stroke="#22e8df"
              strokeWidth="4"
            />

            {[
              [0, 220],
              [75, 178],
              [150, 155],
              [225, 178],
              [300, 103],
              [375, 125],
              [450, 82],
              [525, 100],
              [600, 35],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5" fill="#22e8df" />
            ))}
          </svg>

          <div className="chart-months">
            <span>Jan</span>
            <span>Fév</span>
            <span>Mar</span>
            <span>Avr</span>
            <span>Mai</span>
            <span>Juin</span>
            <span>Juil</span>
          </div>
        </div>
      </div>

      <div className="analytics-floating-card">
        <Activity size={18} />
        <div>
          <b>+18.4%</b>
          <small>évolution</small>
        </div>
      </div>
    </div>
  );
}

function FinalIllustration() {
  return (
    <div className="final-art">
      <div className="final-ring ring-one" />
      <div className="final-ring ring-two" />
      <div className="final-ring ring-three" />

      <div className="final-cube">
        <div className="cube-face cube-front">V</div>
        <div className="cube-face cube-right" />
        <div className="cube-face cube-top" />
      </div>

      <div className="final-particle particle-a">✦</div>
      <div className="final-particle particle-b">·</div>
      <div className="final-particle particle-c">✦</div>
      <div className="final-particle particle-d">·</div>
    </div>
  );
}

interface MedicalStatistics {
  total: number;
  by_source: Record<string, number>;
  by_type: Record<string, number>;
}

const API_URL = "http://localhost:8000";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR").format(value);

function getTypeCount(
  stats: MedicalStatistics | null,
  types: string[]
) {
  if (!stats) return 0;

  return types.reduce(
    (total, type) => total + (stats.by_type[type] || 0),
    0
  );
}

export default function HomePage() {

  const [stats, setStats] = useState<MedicalStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(
          `${API_URL}/medical-data/statistics`
        );

        if (!response.ok) {
          throw new Error("Impossible de récupérer les statistiques");
        }

        const data = await response.json();

        setStats(data);
      } catch (error) {
        console.error("Statistics error:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <main className="home">
      {/* NAVIGATION */}
      <TopNav />

      {/* HERO */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">
            VITALENS <i>·</i> MAROC <i>·</i> HEALTH DATA
          </span>

          <h1>
            Explorez les données
            <br />
            de santé du <span>Maroc.</span>
          </h1>

          <p>
            VitaLens centralise, structure et visualise les données des
            établissements de santé pour une meilleure compréhension et une
            prise de décision éclairée.
          </p>

          <div className="hero-actions">
            <a href="/carte" className="primary-button">
              Explorer la carte
              <ArrowRight size={17} />
            </a>

            <button
              className="secondary-button"
              onClick={() => scrollToSection("overview")}
            >
              Voir les données
              <ArrowDown size={16} />
            </button>
          </div>

          <div className="hero-mini-data">
            <span>
              <i /> Données actualisées
            </span>
            <span>
              <Globe2 size={14} /> Couverture nationale
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <MoroccoIllustration />
        </div>

        <button
          className="hero-scroll"
          onClick={() => scrollToSection("overview")}
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown size={17} />
        </button>
      </section>

      {/* OVERVIEW */}
      <section id="overview" className="section data-section">
        <div className="section-inner">

          <div className="section-heading data-heading">
            <div>
              <span className="eyebrow">
                01 · APERÇU DES DONNÉES
              </span>

              <h2>
                La santé du Maroc
                <br />
                <span>en chiffres.</span>
              </h2>
            </div>

            <div className="data-heading-right">
              <p>
                Un aperçu en temps réel des établissements et
                professionnels de santé présents dans VitaLens.
              </p>

              <a
                href="/dashboard"
                className="dashboard-glow-button"
              >
                <BarChart3 size={17} />
                Voir le dashboard
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="live-data-status">
            <span className="live-indicator" />
            <span>
              {statsLoading
                ? "Synchronisation des données..."
                : "Données en temps réel"}
            </span>

            {!statsLoading && stats && (
              <span className="live-total">
                {formatNumber(stats.total)} records
              </span>
            )}
          </div>

          <div className="stats-grid">

            {/* TOTAL */}
            <div className="stat-card main-stat-card">
              <div className="stat-icon">🏥</div>

              <strong>
                {statsLoading
                  ? "..."
                  : formatNumber(stats?.total || 0)}
              </strong>

              <b>Établissements</b>

              <small>
                Toutes les données VitaLens
              </small>
            </div>

            {/* HOSPITALS */}
            <div className="stat-card">
              <div className="stat-icon">🏨</div>

              <strong>
                {statsLoading
                  ? "..."
                  : formatNumber(
                      getTypeCount(stats, ["hospital"])
                    )}
              </strong>

              <b>Hôpitaux</b>

              <small>
                Publics et privés
              </small>
            </div>

            {/* PRIMARY CARE */}
            <div className="stat-card">
              <div className="stat-icon">🩺</div>

              <strong>
                {statsLoading
                  ? "..."
                  : formatNumber(
                      getTypeCount(stats, ["primary_care"])
                    )}
              </strong>

              <b>Soins primaires</b>

              <small>
                Centres et dispensaires
              </small>
            </div>

            {/* PHARMACIES */}
            <div className="stat-card">
              <div className="stat-icon">💊</div>

              <strong>
                {statsLoading
                  ? "..."
                  : formatNumber(
                      getTypeCount(stats, ["pharmacy"])
                    )}
              </strong>

              <b>Pharmacies</b>

              <small>
                Officines et pharmacies
              </small>
            </div>

            {/* DOCTORS */}
            <div className="stat-card">
              <div className="stat-icon">👨‍⚕️</div>

              <strong>
                {statsLoading
                  ? "..."
                  : formatNumber(
                      getTypeCount(stats, ["doctors", "doctor"])
                    )}
              </strong>

              <b>Médecins</b>

              <small>
                Professionnels référencés
              </small>
            </div>

            {/* SOURCES */}
            <div className="stat-card reliability-card">
              <div className="stat-icon">🛡️</div>

              <strong>
                {statsLoading
                  ? "..."
                  : Object.keys(stats?.by_source || {}).length}
              </strong>

              <b>Sources</b>

              <small>
                Sources de données actives
              </small>
            </div>

          </div>
        </div>
      </section>

      {/* DATA STORY */}
      <section className="section split-section">
        <div className="split-content">
          <span className="eyebrow">02 · COMPRENDRE</span>

          <h2>
            Une quantité immense de données.
            <br />
            <span>Une seule vision.</span>
          </h2>

          <p>
            VitaLens transforme des données sanitaires dispersées en une
            représentation claire du territoire marocain.
          </p>

          <div className="feature-list">
            <div>
              <span>🏥</span>
              <div>
                <b>Établissements</b>
                <small>Hôpitaux, cliniques et centres de santé.</small>
              </div>
            </div>

            <div>
              <span>👨‍⚕️</span>
              <div>
                <b>Professionnels</b>
                <small>Médecins et structures de soins.</small>
              </div>
            </div>

            <div>
              <span>📍</span>
              <div>
                <b>Localisation</b>
                <small>Chaque donnée prend une dimension géographique.</small>
              </div>
            </div>
          </div>
          <a href="/comprendre" className="comprendre-link">
            Découvrir cette vision →
          </a>
        </div>

        <div className="split-visual">
          <DataIllustration />
        </div>
      </section>

      {/* SOURCES */}
      <section id="sources" className="section split-section reverse">
        <div className="split-visual">
          <SourcesIllustration />
        </div>

        <div className="split-content">
          <span className="eyebrow">03 · SOURCES DES DONNÉES</span>

          <h2>
            Plusieurs sources.
            <br />
            <span>Une donnée fiable.</span>
          </h2>

          <p>
            Nous collectons et consolidons des données provenant de sources
            publiques, ouvertes et institutionnelles.
          </p>

          <div className="source-cards">
            <div>
              <span>🇲🇦</span>
              <b>Data.gov.ma</b>
              <small>3 184 records</small>
            </div>

            <div>
              <span>🌐</span>
              <b>OpenStreetMap</b>
              <small>8 895 records</small>
            </div>

            <div>
              <span>🏥</span>
              <b>Offre de soins</b>
              <small>Indicateurs de santé</small>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section id="map" className="section map-story">
        <div className="map-story-content">
          <span className="eyebrow">04 · CARTOGRAPHIE</span>

          <h2>
            Voyez la santé
            <br />
            <span>prendre forme.</span>
          </h2>

          <p>
            Explorez les établissements de santé directement sur la carte.
            Dessinez une zone, filtrez les données et découvrez votre
            territoire.
          </p>

          <a href="/carte" className="primary-button">
            Ouvrir la carte
            <Map size={17} />
          </a>
        </div>

        <MapIllustration />
      </section>

      {/* DATA SOURCE CARDS */}
      <section className="section sources-grid-section">
        <div className="section-inner">
          <div className="section-heading">
            <span className="eyebrow">05 · ÉCOSYSTÈME</span>
            <h2>
              Des données qui
              <br />
              <span>restent vivantes.</span>
            </h2>
          </div>

          <div className="big-source-grid">
            <div className="big-source-card">
              <div className="big-source-icon">🇲🇦</div>
              <div className="status">
                <i /> Healthy
              </div>
              <h3>Data.gov.ma</h3>
              <p>Primary Care</p>
              <strong>3 184 records</strong>
              <small>Dernière synchronisation · 2h ago</small>
              <ArrowRight />
            </div>

            <div className="big-source-card">
              <div className="big-source-icon">🏨</div>
              <div className="status">
                <i /> Healthy
              </div>
              <h3>Data.gov.ma</h3>
              <p>Hospitals</p>
              <strong>384 records</strong>
              <small>Dernière synchronisation · 2h ago</small>
              <ArrowRight />
            </div>

            <div className="big-source-card">
              <div className="big-source-icon">🌐</div>
              <div className="status">
                <i /> Healthy
              </div>
              <h3>OpenStreetMap</h3>
              <p>Healthcare</p>
              <strong>8 895 records</strong>
              <small>Dernière synchronisation · 3h ago</small>
              <ArrowRight />
            </div>

            <div className="big-source-card">
              <div className="big-source-icon">📊</div>
              <div className="status">
                <i /> Healthy
              </div>
              <h3>Offre de soins</h3>
              <p>Health Indicators</p>
              <strong>Indicators available</strong>
              <small>Dernière synchronisation · 3h ago</small>
              <ArrowRight />
            </div>
          </div>
        </div>
      </section>

      {/* SQL */}
      <section id="queries" className="section split-section sql-story">
        <div className="split-content">
          <span className="eyebrow">06 · DONNÉES & REQUÊTES</span>

          <h2>
            Accédez aux données
            <br />
            <span>comme vous le souhaitez.</span>
          </h2>

          <p>
            Interrogez directement la base de données avec SQL et découvrez
            exactement ce qui se cache derrière la carte.
          </p>

          <div className="feature-list">
            <div>
              <span>🗄️</span>
              <div>
                <b>Données ouvertes</b>
                <small>
                  Consultez les sources, leur état et leur fraîcheur.
                </small>
              </div>
            </div>

            <div>
              <span>⌨️</span>
              <div>
                <b>SQL Explorer</b>
                <small>
                  Explorez les données en lecture seule.
                </small>
              </div>
            </div>
          </div>

          <a href="/sql" className="story-link">
            Ouvrir SQL Explorer
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="split-visual">
          <SQLIllustration />
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="section split-section reverse analytics-section">
        <div className="split-visual">
          <AnalyticsIllustration />
        </div>

        <div className="split-content">
          <span className="eyebrow">07 · INDICATEURS CLÉS</span>

          <h2>
            Transformez les données
            <br />
            en <span>insights.</span>
          </h2>

          <p>
            Comparez les territoires, observez les évolutions et identifiez
            les tendances qui se cachent derrière les chiffres.
          </p>

          <div className="metric-row">
            <div>
              <strong>+18.4%</strong>
              <small>évolution</small>
            </div>
            <div>
              <strong>12</strong>
              <small>régions</small>
            </div>
            <div>
              <strong>5</strong>
              <small>types</small>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL */}
      <section id="about" className="section final-section">
        <div className="final-content">
          <span className="eyebrow">08 · À PROPOS</span>

          <h2>
            Comprendre.
            <br />
            <span>Décider.</span>
          </h2>

          <p>
            VitaLens rend les données de santé du Maroc accessibles,
            compréhensibles et utiles pour mieux observer le territoire.
          </p>

          <a href="/carte" className="primary-button">
            Commencer
            <ArrowRight size={17} />
          </a>
        </div>

        <FinalIllustration />
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-brand">
          <span className="brand-mark">
            <Layers3 size={20} />
          </span>
          <div>
            <b>VitaLens</b>
            <small>Plateforme ouverte de données de santé du Maroc.</small>
          </div>
        </div>

        <div className="footer-links">
          <a href="/carte">Carte</a>
          <a href="/sql">SQL Explorer</a>
          <a href="/admin">Admin</a>
        </div>

        <span className="copyright">© 2026 VitaLens</span>
      </footer>
    </main>
  );
}