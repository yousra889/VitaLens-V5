import { Activity, Database, LayoutDashboard, Map } from "lucide-react";

import "./TopNav.css";

export function TopNav() {
  return (
    <header className="top-nav">
      <a className="top-nav__brand" href="/">
        <span className="top-nav__mark">
          <Activity size={17} strokeWidth={2.5} />
        </span>

        <span>VitaLens</span>
      </a>

      <nav className="top-nav__links">
        <a href="#explore">
          <Map size={15} />
          Explorer
        </a>

        <a href="#sql">
          <Database size={15} />
          SQL
        </a>

        <a href="/admin">
          <LayoutDashboard size={15} />
          Admin
        </a>
      </nav>

      <div className="top-nav__status">
        <span className="top-nav__status-dot" />
        <span>Live data</span>
      </div>
    </header>
  );
}