import { SqlExplorer } from "../components/workspace/SqlExplorer";
import { TopNav } from "../components/navigation/TopNav";

import "./SqlExplorerPage.css";

export function SqlExplorerPage() {
  return (
    <>
      <TopNav />

      <main className="sql-page">
        <header className="sql-page__header">
          <div>
            <span className="sql-page__eyebrow">
              DONNÉES & REQUÊTES
            </span>

            <h1 className="sql-page__title">
              Explorez les données <span>à votre manière.</span>
            </h1>

            <p className="sql-page__description">
              Interrogez les données de santé disponibles dans VitaLens
              grâce à un explorateur SQL en lecture seule.
            </p>
          </div>

          <a className="sql-page__back" href="/">
            ← Retour à l'accueil
          </a>
        </header>

        <section className="sql-page__workspace">
          <SqlExplorer />
        </section>
      </main>
    </>
  );
}