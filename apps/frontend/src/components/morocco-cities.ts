export interface CityMarker {
  name: string;
  lat: number;
  lng: number;
}

// A handful of major cities - shown once the user zooms in far enough
// that a full label layer would actually be legible. Real city/label
// data can replace this later; this satisfies the "zoom-based reveal"
// checklist item without pulling in a labels tileset.
export const MOROCCO_CITIES: CityMarker[] = [
  { name: "Rabat", lat: 34.0209, lng: -6.8417 },
  { name: "Salé", lat: 34.0531, lng: -6.7985 },
  { name: "Casablanca", lat: 33.5731, lng: -7.5898 },
  { name: "Fès", lat: 34.0333, lng: -5.0 },
  { name: "Marrakech", lat: 31.6295, lng: -7.9811 },
  { name: "Tanger", lat: 35.7595, lng: -5.834 },
  { name: "Agadir", lat: 30.4278, lng: -9.5981 },
  { name: "Oujda", lat: 34.6814, lng: -1.9086 },
  { name: "Midelt", lat: 32.6852, lng: -4.7358 },
];
