import type { Establishment } from "../api/client";
import "./ResultsPanel.css";

interface ResultsPanelProps {
  status: "idle" | "loading" | "error" | "done";
  count: number;
  establishments: Establishment[];
}

export function ResultsPanel({ status, count, establishments }: ResultsPanelProps) {
  return (
    <aside className="results" aria-live="polite">
      <h2 className="results__title">Résultats</h2>

      {status === "idle" && (
        <p className="results__hint">
          Dessinez une zone sur la carte pour voir les établissements de
          santé qu'elle contient.
        </p>
      )}

      {status === "loading" && <p className="results__hint">Recherche en cours…</p>}

      {status === "error" && (
        <p className="results__error">
          La recherche a échoué. Vérifiez que le gateway et le geo-service
          tournent, puis redessinez la zone.
        </p>
      )}

      {status === "done" && (
        <>
          <p className="results__count">
            <span className="results__count-number">{count}</span>{" "}
            établissement{count === 1 ? "" : "s"} dans la zone
          </p>
          <ul className="results__list">
            {establishments.map((item) => (
              <li key={item.id} className="results__item">
                <span className="results__item-name">{item.name}</span>
                <span className="results__item-meta">
                  {item.type}
                  {item.commune ? ` · ${item.commune}` : ""}
                </span>
              </li>
            ))}
          </ul>
          {count === 0 && (
            <p className="results__hint">Aucun établissement dans cette zone.</p>
          )}
        </>
      )}
    </aside>
  );
}
