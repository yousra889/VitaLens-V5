const GATEWAY_URL =
  import.meta.env.VITE_GATEWAY_URL ?? "http://localhost:3000";

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export interface Establishment {
  id: string;
  name: string;
  type: string;
  commune?: string;
  province?: string;
  region?: string | null;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  source_id?: string;
}

export interface ZoneQueryResult {
  count: number;
  establishments: Establishment[];
}

export async function queryZone(
  polygon: GeoJSONPolygon,
): Promise<ZoneQueryResult> {
  const response = await fetch(`${GATEWAY_URL}/zones/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      geometry: polygon,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Zone query failed (${response.status}): ${errorText}`,
    );
  }

  return response.json() as Promise<ZoneQueryResult>;
}