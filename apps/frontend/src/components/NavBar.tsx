import "./NavBar.css";

export function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__mark" aria-hidden="true" />
        VitaLens
      </div>
      <nav className="navbar__links">
        <a href="#carte">Carte</a>
        <a href="/admin">Admin</a>
      </nav>
    </header>
  );
}
