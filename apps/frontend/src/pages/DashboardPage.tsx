import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Activity,
  Hospital,
  Pill,
  Stethoscope,
  Database,
  ShieldCheck,
  MapPinned,
  HeartPulse,
  Building2,
  Globe2,
  Users,
} from "lucide-react";
import { RefreshCw } from "lucide-react";
import { TopNav } from "../components/navigation/TopNav";

import "./DashboardPage.css";

interface MedicalStatistics {
  total: number;
  by_source: Record<string, number>;
  by_type: Record<string, number>;
}

const API_URL = "http://localhost:8000";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR").format(value);

const TYPE_META: Record<
  string,
  {
    label: string;
    emoji: string;
    color: string;
    icon: typeof Hospital;
    description: string;
  }
> = {
  hospital: {
    label: "Hôpitaux",
    emoji: "🏥",
    color: "cyan",
    icon: Hospital,
    description: "Structures hospitalières",
  },
  pharmacy: {
    label: "Pharmacies",
    emoji: "💊",
    color: "violet",
    icon: Pill,
    description: "Officines et pharmacies",
  },
  doctors: {
    label: "Médecins",
    emoji: "👨‍⚕️",
    color: "blue",
    icon: Stethoscope,
    description: "Professionnels de santé",
  },
  primary_care: {
    label: "Soins primaires",
    emoji: "🩺",
    color: "green",
    icon: HeartPulse,
    description: "Centres et dispensaires",
  },
  clinic: {
    label: "Cliniques",
    emoji: "🏨",
    color: "orange",
    icon: Building2,
    description: "Cliniques référencées",
  },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<MedicalStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/medical-data/statistics`
      );

      if (!response.ok) {
        throw new Error("Statistics request failed");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const types = stats?.by_type || {};

  const sortedTypes = useMemo(() => {
    return Object.entries(types)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({
        type,
        count,
        meta:
          TYPE_META[type] || {
            label: type,
            emoji: "📍",
            color: "cyan",
            icon: MapPinned,
            description: "Établissements référencés",
          },
      }));
  }, [types]);

  const maxType = Math.max(
    ...Object.values(types),
    1
  );

  const total = stats?.total || 0;

  return (
    <main className="dashboard-page">
            <TopNav />


      {/* HEADER */}
        <header className="dashboard-header">
        <div className="dashboard-title">
            <span className="eyebrow">
            VITALENS <i>·</i> LIVE DASHBOARD
            </span>

            <h1>
            La santé du Maroc <span>en chiffres.</span>
            </h1>

            <p>
            Explorez en temps réel les données sanitaires actuellement intégrées dans VitaLens.
            </p>
        </div>

        <a href="/" className="dashboard-back">
            <ArrowLeft size={16} />
            Retour à VitaLens
        </a>
        </header>



      {/* CONTENT */}
      <section className="dashboard-content">

        {/* LIVE */}
        <div className="dashboard-live">
        <div className="dashboard-live-label">
            <span />
            Base de données connectée · DuckDB
        </div>

        <button
            className="dashboard-refresh"
            onClick={loadStats}
            type="button"
        >
            <RefreshCw size={14} />
            Actualiser
        </button>
        </div>

        {/* HERO STAT */}

            <section className="dashboard-overview">
            <div className="overview-copy">
                <span className="overview-kicker">
                DONNÉES SANITAIRES
                </span>

                <h2>
                Une vision globale
                <br />
                <span>du système de santé.</span>
                </h2>

                <p>
                Toutes les statistiques affichées ici sont calculées
                directement depuis les données actuellement présentes
                dans VitaLens.
                </p>

                <div className="overview-bottom">
                <div className="overview-tags">
                    <span><Database size={13} /> DuckDB</span>
                    <span><MapPinned size={13} /> Maroc</span>
                    <span><Activity size={13} /> Temps réel</span>
                </div>


                </div>
            </div>

            {/* CLEAN VISUAL */}
            <div className="health-visual">
                <div className="visual-glow" />

                <div className="visual-ring ring-1" />
                <div className="visual-ring ring-2" />

                <div className="visual-center">
                <div className="center-icon">
                    <HeartPulse size={32} />
                </div>

                <strong>
                    {loading ? "..." : formatNumber(total)}
                </strong>

                <span>DONNÉES SANITAIRES</span>
                </div>

                {/* FIXED STAT CARDS */}
                <div className="health-card card-hospital">
                <div className="health-card-icon">🏥</div>
                <div>
                    <strong>
                    {loading ? "..." : formatNumber(types.hospital || 0)}
                    </strong>
                    <small>Hôpitaux</small>
                </div>
                </div>

                <div className="health-card card-pharmacy">
                <div className="health-card-icon">💊</div>
                <div>
                    <strong>
                    {loading ? "..." : formatNumber(types.pharmacy || 0)}
                    </strong>
                    <small>Pharmacies</small>
                </div>
                </div>

                <div className="health-card card-doctors">
                <div className="health-card-icon">👨‍⚕️</div>
                <div>
                    <strong>
                    {loading ? "..." : formatNumber(types.doctors || 0)}
                    </strong>
                    <small>Médecins</small>
                </div>
                </div>

                <div className="health-card card-care">
                <div className="health-card-icon">🩺</div>
                <div>
                    <strong>
                    {loading ? "..." : formatNumber(types.primary_care || 0)}
                    </strong>
                    <small>Soins primaires</small>
                </div>
                </div>
            </div>
            </section>


        {/* MAIN TOTAL */}
        <section className="total-card">

          <div className="total-icon">
            🏥
          </div>

          <div className="total-text">
            <span>TOTAL DES DONNÉES</span>

            <strong>
              {loading
                ? "..."
                : formatNumber(total)}
            </strong>

            <small>
              établissements et professionnels référencés
            </small>
          </div>

          <div className="total-side">
            <div className="pulse-ring">
              <Activity size={19} />
            </div>

            <span>
              DONNÉES
              <br />
              ACTIVES
            </span>
          </div>

        </section>

        {/* STAT CARDS */}
        <section className="statistics-section">

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                APERÇU DES DONNÉES
              </span>

              <h2>
                Le Maroc
                <span> en chiffres.</span>
              </h2>
            </div>

            <p>
              Répartition actuelle des établissements
              et professionnels présents dans VitaLens.
            </p>
          </div>

          <div className="statistics-grid">

            {[
              "hospital",
              "pharmacy",
              "doctors",
              "primary_care",
              "clinic",
            ].map((type) => {
              const meta = TYPE_META[type];
              const Icon = meta.icon;
              const value = types[type] || 0;

              return (
                <article
                  key={type}
                  className={`stat-card stat-${meta.color}`}
                >

                  <div className="stat-card-top">

                    <div className="stat-icon">
                      <Icon size={21} />
                    </div>

                    <span className="stat-emoji">
                      {meta.emoji}
                    </span>

                  </div>

                  <span className="stat-label">
                    {meta.label}
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : formatNumber(value)}
                  </strong>

                  <small>
                    {meta.description}
                  </small>

                  <div className="stat-progress">
                    <span
                      style={{
                        width: `${Math.max(
                          (value / maxType) * 100,
                          2
                        )}%`,
                      }}
                    />
                  </div>

                </article>
              );
            })}

            <article className="stat-card stat-sources">

              <div className="stat-card-top">

                <div className="stat-icon">
                  <GlobeIcon />
                </div>

                <span className="stat-emoji">
                  🌍
                </span>

              </div>

              <span className="stat-label">
                Sources
              </span>

              <strong>
                {loading
                  ? "..."
                  : Object.keys(
                      stats?.by_source || {}
                    ).length}
              </strong>

              <small>
                Sources connectées à VitaLens
              </small>

              <div className="stat-progress">
                <span style={{ width: "72%" }} />
              </div>

            </article>

          </div>

        </section>

        {/* DISTRIBUTION */}
        <section className="distribution-section">

          <div className="distribution-header">

            <div>
              <span className="eyebrow">
                RÉPARTITION
              </span>

              <h2>
                Où se trouvent
                <br />
                <span>les données ?</span>
              </h2>
            </div>

            <div className="distribution-total">
              <Users size={18} />
              <div>
                <strong>
                  {loading
                    ? "..."
                    : formatNumber(total)}
                </strong>
                <span>enregistrements</span>
              </div>
            </div>

          </div>

          <div className="distribution-card">

            <div className="distribution-bars">

              {sortedTypes.map(
                ({ type, count, meta }, index) => {
                  const percentage =
                    (count / maxType) * 100;

                  const Icon = meta.icon;

                  return (
                    <div
                      className="distribution-row"
                      key={type}
                    >

                      <div className="distribution-label">

                        <div className="distribution-name">
                          <span className="distribution-number">
                            0{index + 1}
                          </span>

                          <span className="distribution-icon">
                            <Icon size={15} />
                          </span>

                          <span>
                            {meta.label}
                          </span>
                        </div>

                        <strong>
                          {formatNumber(count)}
                        </strong>

                      </div>

                      <div className="distribution-track">
                        <span
                          className={`bar-${meta.color}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                    </div>
                  );
                }
              )}

            </div>

            {/* RADIAL VISUAL */}
            <div className="distribution-visual">

              <div className="radial-glow" />

              <div className="radial-ring ring-1" />
              <div className="radial-ring ring-2" />
              <div className="radial-ring ring-3" />

              <div className="radial-center">
                <span>V</span>
                <strong>
                  {loading
                    ? "..."
                    : formatNumber(total)}
                </strong>
                <small>TOTAL</small>
              </div>

              <div className="radial-point point-1">
                🏥
              </div>

              <div className="radial-point point-2">
                💊
              </div>

              <div className="radial-point point-3">
                🩺
              </div>

              <div className="radial-point point-4">
                👨‍⚕️
              </div>

            </div>

          </div>

        </section>

        {/* DATA QUALITY */}
        <section className="dashboard-reliable">

          <div className="reliable-icon">
            <ShieldCheck size={24} />
          </div>

          <div>
            <b>
              Données suivies et synchronisées
            </b>

            <span>
              Les statistiques affichées proviennent
              directement de la base de données VitaLens.
            </span>
          </div>

          <div className="reliable-status">
            <span />
            CONNECTÉ
          </div>

        </section>

      </section>

    </main>
  );
}

function GlobeIcon() {
  return <Globe2 size={21} />;
}