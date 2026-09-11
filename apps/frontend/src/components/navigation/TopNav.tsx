import { Layers3, ShieldCheck } from "lucide-react";

import "./TopNav.css";

export function TopNav() {
  return (
    <nav className="home-nav">
      <a className="brand" href="/">
        <span className="brand-mark">
          <Layers3 size={23} />
        </span>
        <span>VitaLens</span>
      </a>

      <div className="nav-links">
        <a href="/carte">Carte</a>
        <a href="/dashboard">Données</a>
        <a href="/sql">SQL Explorer</a>
        <a href="/about">À propos</a>
      </div>

      <a className="admin-link" href="/admin">
        <ShieldCheck size={15} />
        Admin
      </a>
    </nav>
  );
}