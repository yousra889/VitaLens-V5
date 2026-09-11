"""
Medical data routes - FIXED version

Simplified staging without ON CONFLICT
"""

import json
import threading
from datetime import datetime

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.db import MedicalData, SyncLog, db

router = APIRouter(prefix="/medical-data", tags=["medical-data"])

# Thread lock for safe concurrent ingestion
ingest_lock = threading.Lock()


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class MedicalRecord(BaseModel):
    nom: str
    type: str
    commune: str
    province: str
    region: str | None = None
    geometry: dict | None = None
    source_id: str
    osm_id: str | None = None
    amenity: str | None = None
    phone: str | None = None
    website: str | None = None
    opening_hours: str | None = None
    categorie: str | None = None


class BulkIngestRequest(BaseModel):
    source_id: str
    records: list[MedicalRecord]


class IngestResponse(BaseModel):
    status: str
    source_id: str
    rows_before: int
    rows_after: int
    inserted: int


# ============================================================================
# DATA INGESTION
# ============================================================================

@router.post("/ingest", response_model=IngestResponse)
async def ingest_data(request: BulkIngestRequest):
    """
    Main data ingestion endpoint for N8N workflows.
    """
    with ingest_lock:
        started = datetime.utcnow()

        try:
            # Count rows before this sync
            rows_before = db.execute(
                "SELECT COUNT(*) FROM medical_data_records WHERE source_id = ?",
                [request.source_id],
            ).fetchone()[0]

            # Delete old records from this source
            db.execute(
                "DELETE FROM medical_data_records WHERE source_id = ?",
                [request.source_id],
            )

            # Insert new records
            inserted = 0

            for r in request.records:
                geometry_json = None

                if r.geometry:
                    geometry_json = json.dumps(r.geometry)

                try:
                    db.execute(
                        """
                        INSERT INTO medical_data_records
                            (
                                nom,
                                type,
                                commune,
                                province,
                                region,
                                geometry,
                                source_id,
                                osm_id,
                                amenity,
                                phone,
                                website,
                                opening_hours,
                                categorie,
                                synced_at
                            )
                        VALUES (
                            ?, ?, ?, ?, ?, ST_GeomFromGeoJSON(?),
                            ?, ?, ?, ?, ?, ?, ?, ?
                        )
                        """,
                        [
                            r.nom,
                            r.type,
                            r.commune,
                            r.province,
                            r.region,
                            geometry_json,
                            request.source_id,
                            r.osm_id,
                            r.amenity,
                            r.phone,
                            r.website,
                            r.opening_hours,
                            r.categorie,
                            started,
                        ],
                    )

                    inserted += 1

                except Exception as e:
                    print(
                        f"Warning: Failed to insert {r.nom}: {e!s}"
                    )
                    continue

            rows_after = db.execute(
                "SELECT COUNT(*) FROM medical_data_records WHERE source_id = ?",
                [request.source_id],
            ).fetchone()[0]

            # ================================================================
            # VALIDATION CHECKS
            # ================================================================

            problems = []

            if rows_after == 0:
                problems.append("0 rows received")

            if rows_before > 0 and rows_after < rows_before * 0.5:
                problems.append(
                    f"dropped from {rows_before} to {rows_after} rows (>50% loss)"
                )

            if problems:
                error_msg = "; ".join(problems)

                db.execute(
                    """
                    INSERT INTO sync_log
                        (
                            source_id,
                            started_at,
                            finished_at,
                            status,
                            rows_before,
                            rows_after,
                            error_message
                        )
                    VALUES (?, ?, ?, 'failed', ?, ?, ?)
                    """,
                    [
                        request.source_id,
                        started,
                        datetime.utcnow(),
                        rows_before,
                        rows_after,
                        error_msg,
                    ],
                )

                raise HTTPException(
                    422,
                    detail=error_msg,
                )

            # Log success
            db.execute(
                """
                INSERT INTO sync_log
                    (
                        source_id,
                        started_at,
                        finished_at,
                        status,
                        rows_before,
                        rows_after
                    )
                VALUES (?, ?, ?, 'success', ?, ?)
                """,
                [
                    request.source_id,
                    started,
                    datetime.utcnow(),
                    rows_before,
                    rows_after,
                ],
            )

            return {
                "status": "success",
                "source_id": request.source_id,
                "rows_before": rows_before,
                "rows_after": rows_after,
                "inserted": inserted,
            }

        except HTTPException:
            raise

        except Exception as e:
            try:
                db.execute(
                    """
                    INSERT INTO sync_log
                        (
                            source_id,
                            started_at,
                            finished_at,
                            status,
                            error_message
                        )
                    VALUES (?, ?, ?, 'error', ?)
                    """,
                    [
                        request.source_id,
                        started,
                        datetime.utcnow(),
                        str(e),
                    ],
                )
            except Exception:
                pass

            raise HTTPException(
                500,
                detail=f"Ingestion failed: {e!s}",
            )


# ============================================================================
# QUERY ENDPOINTS
# ============================================================================

@router.get("/")
async def list_facilities(
    limit: int = Query(100, le=1000),
    offset: int = Query(0, ge=0),
    source_id: str | None = None,
):
    """List facilities with optional filtering by source."""
    try:
        if source_id:
            results = db.execute(
                """
                SELECT
                    id,
                    nom,
                    type,
                    commune,
                    province,
                    ST_AsGeoJSON(geometry) AS geometry,
                    source_id
                FROM medical_data_records
                WHERE source_id = ?
                ORDER BY nom
                LIMIT ? OFFSET ?
                """,
                [source_id, limit, offset],
            ).fetchall()

        else:
            results = db.execute(
                """
                SELECT
                    id,
                    nom,
                    type,
                    commune,
                    province,
                    ST_AsGeoJSON(geometry) AS geometry,
                    source_id
                FROM medical_data_records
                ORDER BY nom
                LIMIT ? OFFSET ?
                """,
                [limit, offset],
            ).fetchall()

        return [
            {
                "id": r[0],
                "nom": r[1],
                "type": r[2],
                "commune": r[3],
                "province": r[4],
                "geometry": json.loads(r[5]) if r[5] else None,
                "source_id": r[6],
            }
            for r in results
        ]

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get("/type/{facility_type}")
async def get_by_type(
    facility_type: str,
    limit: int = Query(100, le=1000),
):
    """Get facilities by type (hospital, clinic, pharmacy, etc.)."""
    try:
        results = MedicalData.find_by_type(
            facility_type,
            limit,
        )
        return results

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get("/statistics")
async def get_statistics():
    """Get database statistics."""
    try:
        stats = MedicalData.get_stats()
        return stats

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================================
# SQL QUERY
# ============================================================================

@router.post("/sql-query")
async def execute_sql(sql: str = Query(...)):
    """Execute user-provided SELECT query with safeguards."""
    import re

    sql = sql.strip().rstrip(";")

    if not sql.lower().startswith("select"):
        raise HTTPException(
            400,
            detail="Only SELECT queries are allowed",
        )

    forbidden = re.compile(
        r"\b(insert|update|delete|drop|alter|attach|copy|pragma|create|install|load)\b",
        re.IGNORECASE,
    )

    if forbidden.search(sql):
        raise HTTPException(
            400,
            detail="Query contains forbidden keywords",
        )

    try:
        results = db.execute(
            f"SELECT * FROM ({sql}) AS q "
        ).fetchall()

        safe_data = []

        for row in results:
            safe_row = []

            for value in row:
                if isinstance(value, bytes):
                    safe_row.append(value.hex())
                else:
                    safe_row.append(value)

            safe_data.append(safe_row)

        return {
            "count": len(safe_data),
            "data": safe_data,
        }

    except Exception as e:
        raise HTTPException(
            400,
            detail=f"Query failed: {e!s}",
        )

# ============================================================================
# MANAGEMENT ENDPOINTS
# ============================================================================

@router.get("/sync-log")
async def get_sync_log(
    limit: int = Query(50, le=500),
):
    """View sync operation history."""
    try:
        logs = SyncLog.get_recent(limit)

        return {
            "count": len(logs),
            "data": logs,
        }

    except Exception as e:
        raise HTTPException(
            400,
            detail=str(e),
        )