export const MAP_TYPE_COLORS: Record<string, string> = {
  hospital: "#ef405b",
  hôpital: "#ef405b",
  hopital: "#ef405b",

  clinique: "#a855f7",
  clinic: "#a855f7",

  pharmacy: "#f2b63d",
  pharmacie: "#f2b63d",

  doctor: "#3b82f6",
  doctors: "#3b82f6",
  médecin: "#3b82f6",
  medecin: "#3b82f6",

  primary_care: "#20c997",
  "primary care": "#20c997",
  "centre de santé": "#20c997",
  "centre de sante": "#20c997",
};

export function getMapTypeColor(type: string): string {
  const normalized = type
    .trim()
    .toLowerCase();

  return (
    MAP_TYPE_COLORS[normalized] ??
    "#20cfc0"
  );
}