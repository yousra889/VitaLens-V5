"""
Spatial filtering for the zone-query endpoint.

Kept free of any MongoDB/FastAPI dependency on purpose: this is the
one piece of business logic in the service worth unit-testing in
isolation (see tests/test_geo.py), and it's the actual "GeoPandas/
Shapely" part named in the architecture.
"""

from typing import Any

import geopandas as gpd
from shapely.geometry import shape


def filter_establishments_in_zone(
    records: list[dict[str, Any]],
    zone_geojson: dict[str, Any],
) -> list[dict[str, Any]]:
    """
    records: MedicalDataRecord documents (dicts) with a GeoJSON Point
             in their "geometry" field - as written by the NestJS
             gateway's Mongoose schema / the N8N sync.
    zone_geojson: the drawn zone, as a GeoJSON Polygon dict.

    Returns the subset of `records` whose point geometry falls
    within the zone. Original records are returned unmodified (no
    lossy round-trip through Shapely) - the GeoDataFrame is only
    used to run the spatial test.
    """
    if not records:
        return []

    zone_polygon = shape(zone_geojson)

    points = [shape(record["geometry"]) for record in records]
    gdf = gpd.GeoDataFrame(
        {"_position": range(len(records))},
        geometry=points,
        crs="EPSG:4326",
    )

    matched_positions = gdf.loc[gdf.geometry.within(zone_polygon), "_position"]
    return [records[i] for i in matched_positions]
