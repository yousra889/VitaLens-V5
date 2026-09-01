import { useState } from "react";

import {
  Building2,
  MapPin,
  Search,
  TriangleAlert,
} from "lucide-react";

import type { Establishment } from "../../api/client";

import "./ResultsPanel.css";

interface ResultsPanelProps {
  status:
    | "idle"
    | "loading"
    | "error"
    | "done";

  count: number;

  establishments: Establishment[];
}

export function ResultsPanel({
  status,
  count,
  establishments,
}: ResultsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter establishments based on search query
  const filteredEstablishments = establishments.filter(
    (establishment) => {
      const query = searchQuery.toLowerCase();
      return (
        establishment.name.toLowerCase().includes(query) ||
        establishment.type.toLowerCase().includes(query) ||
        (establishment.commune?.toLowerCase().includes(query) ?? false) ||
        (establishment.province?.toLowerCase().includes(query) ?? false)
      );
    }
  );

  return (
    <aside
      className="results-panel"
      aria-live="polite"
    >
      <div className="results-panel__header">
        <div>
          <span className="results-panel__eyebrow">
            Query results
          </span>

          <h2>
            {status === "done"
              ? `${count} found`
              : "Results"}
          </h2>
        </div>

        <div className="results-panel__icon">
          <Search size={17} />
        </div>
      </div>

      {status === "done" && count > 0 && (
        <div className="results-panel__search">
          <input
            type="text"
            placeholder="Search results..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="results-panel__search-input"
          />
        </div>
      )}

      <div className="results-panel__body">
        {status === "idle" && (
          <div className="results-panel__empty">
            <div className="results-panel__empty-icon">
              <MapPin size={24} />
            </div>

            <h3>Select an area</h3>

            <p>
              Draw a polygon on the map to
              explore healthcare establishments.
            </p>
          </div>
        )}

        {status === "loading" && (
          <div className="results-panel__loading">
            <span className="results-panel__spinner" />

            <p>Analyzing geographic data…</p>
          </div>
        )}

        {status === "error" && (
          <div className="results-panel__error">
            <TriangleAlert size={22} />

            <div>
              <h3>Query failed</h3>

              <p>
                Check the gateway and geo-service,
                then try again.
              </p>
            </div>
          </div>
        )}

        {status === "done" &&
          count === 0 && (
            <div className="results-panel__empty">
              <div className="results-panel__empty-icon">
                <Building2 size={24} />
              </div>

              <h3>No establishments</h3>

              <p>
                No healthcare facilities were found
                inside this area.
              </p>
            </div>
          )}

        {status === "done" &&
          count > 0 &&
          filteredEstablishments.length === 0 && (
            <div className="results-panel__empty">
              <div className="results-panel__empty-icon">
                <Search size={24} />
              </div>

              <h3>No matches</h3>

              <p>
                No results match your search query.
              </p>
            </div>
          )}

        {status === "done" &&
          filteredEstablishments.length > 0 && (
            <div className="results-panel__list">
              <span className="results-panel__count">
                {filteredEstablishments.length} of {count}
              </span>
              
              {filteredEstablishments.map((item) => (
                <article
                  key={item.id}
                  className="result-card"
                >
                  <div className="result-card__icon">
                    <Building2 size={16} />
                  </div>

                  <div className="result-card__content">
                    <h3>
                      {item.name}
                    </h3>

                    <span>
                      {item.type}
                    </span>

                    {(item.commune ||
                      item.province) && (
                      <p>
                        <MapPin size={12} />

                        {item.commune ??
                          item.province}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </aside>
  );
}