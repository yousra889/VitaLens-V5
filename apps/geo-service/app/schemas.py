from typing import Literal

from pydantic import BaseModel, Field


class GeoJSONPolygon(BaseModel):
    type: Literal["Polygon"] = "Polygon"
    # GeoJSON Polygon: list of linear rings, each a list of [lon, lat] pairs,
    # first and last point equal. Matches what Leaflet-draw exports.
    coordinates: list[list[list[float]]]


class ZoneQueryRequest(BaseModel):
    polygon: GeoJSONPolygon = Field(..., description="The zone drawn on the map")


class GeoJSONPoint(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: list[float]  # [lon, lat]


class EstablishmentOut(BaseModel):
    id: str
    name: str
    type: str
    commune: str | None = None
    province: str | None = None
    geometry: GeoJSONPoint


class ZoneQueryResponse(BaseModel):
    count: int
    establishments: list[EstablishmentOut]
