"""
Zones routes - Geographic zone management.
DuckDB version.
"""

import json
import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.db import MedicalData, Zones, db

router = APIRouter(prefix="/zones", tags=["zones"])


# ============================================================================
# PYDANTIC MODELS
# ============================================================================


class GeoJSONPoint(BaseModel):
    type: str = "Point"
    coordinates: list[float]


class GeoJSONPolygon(BaseModel):
    type: str = "Polygon"
    coordinates: list[list[list[float]]]


class ZoneCreate(BaseModel):
    name: str
    geometry: dict
    description: str | None = None
    user_id: str | None = None


class ZoneResponse(BaseModel):
    id: str
    name: str
    geometry: dict
    description: str | None = None
    user_id: str | None = None
    created_at: datetime


class ZoneQueryRequest(BaseModel):
    geometry: dict


class EstablishmentResponse(BaseModel):
    id: str
    name: str
    type: str
    commune: str | None = None
    province: str | None = None
    region: str | None = None
    geometry: dict | None = None
    source_id: str


class ZoneQueryResponse(BaseModel):
    count: int
    establishments: list[EstablishmentResponse]


# ============================================================================
# HEALTH
# ============================================================================


@router.get("/health")
async def health():
    """
    Health check for the zones API.
    """

    try:
        # Simple database check
        db.execute("SELECT 1").fetchone()

        return {"status": "ok", "service": "geo-service", "module": "zones"}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database health check failed: {e!s}"
        )


# ============================================================================
# STATISTICS
# ============================================================================


@router.get("/statistics")
async def zone_statistics():
    """
    Get statistics about medical data.
    """

    try:
        stats = MedicalData.get_stats()

        return stats

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# CREATE SAVED ZONE
# ============================================================================


@router.post("/", response_model=ZoneResponse)
async def create_zone(zone: ZoneCreate):
    """
    Create a new saved geographic zone.
    """

    try:
        zone_id = str(uuid.uuid4())

        Zones.create(
            zone_id=zone_id,
            name=zone.name,
            geometry=zone.geometry,
            user_id=zone.user_id,
            description=zone.description,
        )

        return {
            "id": zone_id,
            "name": zone.name,
            "geometry": zone.geometry,
            "description": zone.description,
            "user_id": zone.user_id,
            "created_at": datetime.utcnow(),
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# QUERY FACILITIES INSIDE A GEOJSON ZONE
# ============================================================================


@router.post("/query", response_model=ZoneQueryResponse)
async def query_zone(request: ZoneQueryRequest):
    """
    Find healthcare establishments inside a geographic polygon.

    Expected request:

    {
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-6.85, 33.95],
                    [-6.80, 33.95],
                    [-6.80, 34.00],
                    [-6.85, 34.00],
                    [-6.85, 33.95]
                ]
            ]
        }
    }
    """

    try:
        results = MedicalData.find_in_zone(request.geometry)

        establishments = []

        for r in results:
            # Handle dictionaries returned by MedicalData.find_in_zone()
            if isinstance(r, dict):
                establishment_id = r.get("id")

                name = r.get("name") or r.get("nom") or "Établissement inconnu"

                establishment = {
                    "id": str(
                        establishment_id
                        if establishment_id is not None
                        else uuid.uuid4()
                    ),
                    "name": name,
                    "type": r.get("type", "healthcare"),
                    "commune": r.get("commune"),
                    "province": r.get("province"),
                    "region": r.get("region"),
                    "geometry": r.get("geometry"),
                    "source_id": r.get("source_id", ""),
                }

                establishments.append(establishment)

            # Handle tuple/list rows if DB returns them
            else:
                try:
                    establishment = {
                        "id": str(r[0]),
                        "name": r[1],
                        "type": r[2],
                        "commune": r[3],
                        "province": r[4],
                        "region": r[5],
                        "geometry": (json.loads(r[6]) if r[6] else None),
                        "source_id": r[7],
                    }

                    establishments.append(establishment)

                except Exception:
                    continue

        return {"count": len(establishments), "establishments": establishments}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Zone query failed: {e!s}")


# ============================================================================
# QUERY NEARBY FACILITIES
# ============================================================================


@router.post("/query-nearby")
async def query_nearby(point: GeoJSONPoint, radius_meters: float = 5000):
    """
    Find healthcare facilities near a point.

    radius_meters defaults to 5 km.
    """

    try:
        buffer_geom = {"type": "Point", "coordinates": point.coordinates}

        geometry_json = json.dumps(buffer_geom)

        results = db.execute(
            """
            SELECT
                id,
                nom,
                type,
                commune,
                province,
                region,
                ST_AsGeoJSON(geometry) AS geometry,
                source_id,
                synced_at

            FROM medical_data_records

            WHERE
                geometry IS NOT NULL
                AND ST_DWithin(
                    geometry,
                    ST_GeomFromGeoJSON(?),
                    ?
                )

            ORDER BY
                ST_Distance(
                    geometry,
                    ST_GeomFromGeoJSON(?)
                )

            LIMIT 100
            """,
            [geometry_json, radius_meters, geometry_json],
        ).fetchall()

        response = []

        for r in results:
            response.append(
                {
                    "id": str(r[0]),
                    "name": r[1],
                    "type": r[2],
                    "commune": r[3],
                    "province": r[4],
                    "region": r[5],
                    "geometry": (json.loads(r[6]) if r[6] else None),
                    "source_id": r[7],
                    "synced_at": r[8],
                }
            )

        return response

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Nearby query failed: {e!s}")


# ============================================================================
# GET SAVED ZONES FOR A USER
# ============================================================================
#
# IMPORTANT:
# This route is intentionally LAST.
#
# Otherwise:
#
# /zones/health
#
# could be interpreted as:
#
# user_id = "health"
#
# ============================================================================


@router.get("/{user_id}", response_model=list[ZoneResponse])
async def get_user_zones(user_id: str):
    """
    Get all saved zones for a user.
    """

    try:
        zones = Zones.find_by_user(user_id)

        return zones

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
