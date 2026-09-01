import type { ReactNode } from "react";

import { TopNav } from "../navigation/TopNav";

import "./AppShell.css";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <TopNav />

      <main className="app-shell__main">{children}</main>
    </div>
  );
}