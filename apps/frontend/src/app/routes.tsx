import { Route, Routes } from "react-router-dom";

import HomePage  from "../pages/HomePage";
import { MapPage } from "../pages/MapPage";
import { SqlExplorerPage } from "../pages/SqlExplorerPage";
import DashboardPage from "../pages/DashboardPage";
import ComprendrePage from "../pages/ComprendrePage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/carte" element={<MapPage />} />
      <Route path="/sql" element={<SqlExplorerPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/comprendre" element={<ComprendrePage />} />
    </Routes>
  );
}