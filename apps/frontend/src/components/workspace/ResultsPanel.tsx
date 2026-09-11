import { useMemo, useState } from "react";
import {
  Building2,
  ChevronRight,
  MapPin,
  Pill,
  Plus,
  Search,
  SlidersHorizontal,
  Stethoscope,
} from "lucide-react";

import type { Establishment } from "../../api/client";

import "./ResultsPanel.css";

type QueryStatus =
  | "idle"
  | "loading"
  | "error"
  | "done";

type FilterType =
  | "hospital"
  | "clinic"
  | "pharmacy"
  | "doctor"
  | "primary";

interface ResultsPanelProps {
  status: QueryStatus;
  count: number;
  establishments: Establishment[];
  onEstablishmentClick: (establishment: Establishment) => void;
}

const FILTERS: {
  key: FilterType;
  label: string;
}[] = [
  {
    key: "hospital",
    label: "Hôpitaux",
  },
  {
    key: "clinic",
    label: "Cliniques",
  },
  {
    key: "pharmacy",
    label: "Pharmacies",
  },
  {
    key: "doctor",
    label: "Médecins",
  },

];

function normalizeType(type: string): FilterType | null {
  const value = type
    .trim()
    .toLowerCase();

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

  return null;
}

function getTypeLabel(type: string) {
  const normalized = normalizeType(type);

  switch (normalized) {
    case "hospital":
      return "HÔPITAL";

    case "clinic":
      return "CLINIQUE";

    case "pharmacy":
      return "PHARMACIE";

    case "doctor":
      return "MÉDECIN";


    default:
      return type.toUpperCase();
  }
}

function getTypeClass(type: string) {
  const normalized = normalizeType(type);

  return normalized
    ? `result-card--${normalized}`
    : "result-card--other";
}

function getTypeIcon(type: string) {
  const normalized = normalizeType(type);

  switch (normalized) {
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

export function ResultsPanel({
  status,
  count,
  establishments,
  onEstablishmentClick,
}: ResultsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<FilterType | null>(null);

  const filteredEstablishments = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return establishments.filter((establishment) => {
      const matchesFilter =
        !activeFilter ||
        normalizeType(establishment.type) ===
          activeFilter;

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        establishment.name,
        establishment.type,
        establishment.commune,
        establishment.province,
        establishment.region,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [
    establishments,
    searchQuery,
    activeFilter,
  ]);

  return (
    <aside className="results-panel">
      <div className="results-panel__header">
        {/* SEARCH */}

        <div className="results-panel__search">
          <Search
            size={17}
            strokeWidth={1.8}
            className="results-panel__search-icon"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Rechercher un établissement..."
            className="results-panel__search-input"
          />

          <button
            type="button"
            className="results-panel__filter-button"
            aria-label="Options de filtre"
          >
            <SlidersHorizontal
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* FILTERS */}

        <div className="results-panel__filters-title">
          FILTRES PAR TYPE
        </div>

        <div className="results-panel__filters">
          {FILTERS.map((filter) => {
            const active =
              activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                className={`results-panel__filter ${
                  active
                    ? "results-panel__filter--active"
                    : ""
                }`}
                onClick={() =>
                  setActiveFilter(
                    active ? null : filter.key,
                  )
                }
              >
                <span
                  className={`results-panel__filter-dot results-panel__filter-dot--${filter.key}`}
                />

                {filter.label}
              </button>
            );
          })}
        </div>

        {/* RESULT COUNT */}

        <div className="results-panel__count-row">
          <div className="results-panel__count">
            {count} RÉSULTATS
          </div>

          <div className="results-panel__visible-count">
            {filteredEstablishments.length} OF {count}
          </div>
        </div>
      </div>

      {/* BODY */}

      <div className="results-panel__body">
        {status === "loading" && (
          <div className="results-panel__state">
            <div className="results-panel__loader" />

            <div>
              <strong>Analyse de la zone</strong>
              <span>
                Recherche des établissements...
              </span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="results-panel__state results-panel__state--error">
            <div className="results-panel__state-icon">
              !
            </div>

            <div>
              <strong>Erreur</strong>
              <span>
                Impossible de récupérer les établissements.
              </span>
            </div>
          </div>
        )}

        {status === "idle" && (
          <div className="results-panel__empty">
            <div className="results-panel__empty-icon">
              <MapPin
                size={22}
                strokeWidth={1.6}
              />
            </div>

            <strong>
              Sélectionnez une zone
            </strong>

            <span>
              Dessinez un polygone sur la carte pour
              afficher les établissements de santé.
            </span>
          </div>
        )}

        {status === "done" &&
          filteredEstablishments.length === 0 && (
            <div className="results-panel__empty">
              <div className="results-panel__empty-icon">
                <Search
                  size={22}
                  strokeWidth={1.6}
                />
              </div>

              <strong>
                Aucun établissement
              </strong>

              <span>
                Aucun résultat ne correspond à vos
                critères.
              </span>
            </div>
          )}

        {status === "done" &&
          filteredEstablishments.length > 0 && (
            <div className="results-panel__list">
              {filteredEstablishments.map(
                (establishment, index) => (
                  <article
                    className={`result-card ${getTypeClass(
                      establishment.type,
                    )}`}
                    key={
                      String(
                        (
                          establishment as unknown as Record<
                            string,
                            unknown
                          >
                        ).id ?? index,
                      )
                    }
                    onClick={() => onEstablishmentClick(establishment)}
                  >
                    <div className="result-card__icon">
                      {getTypeIcon(
                        establishment.type,
                      )}
                    </div>

                    <div className="result-card__content">
                      <div className="result-card__name">
                        {establishment.name ||
                          "Établissement sans nom"}
                      </div>

                      <div className="result-card__type">
                        {getTypeLabel(
                          establishment.type,
                        )}
                      </div>

                      <div className="result-card__location">
                        <MapPin
                          size={12}
                          strokeWidth={1.8}
                        />
                        <span>
                          {establishment.commune ||
                            establishment.province ||
                            establishment.region ||
                            "Localisation inconnue"}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      size={17}
                      strokeWidth={1.6}
                      className="result-card__arrow"
                    />
                  </article>
                ),
              )}
            </div>
          )}
      </div>
    </aside>
  );
}