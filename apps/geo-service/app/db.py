"""
DuckDB database initialization and connection for VitaLens.
"""

from dotenv import load_dotenv

load_dotenv()

import json
import os
from datetime import datetime
from typing import Any

import duckdb

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================

DB_PATH = os.getenv("DATABASE_PATH", "./vitalens.duckdb")

db = duckdb.connect(DB_PATH)


# ============================================================================
# SPATIAL EXTENSION
# ============================================================================

try:
    db.execute("INSTALL spatial")
    db.execute("LOAD spatial")
except Exception as e:
    print(f"Spatial extension info: {e!s}")


# ============================================================================
# DATABASE INITIALIZATION
# ============================================================================


def init_database():
    """Initialize all required tables for VitaLens."""

    # IMPORTANT:
    # Sequences must exist BEFORE tables that use nextval().
    db.execute("CREATE SEQUENCE IF NOT EXISTS seq_records START 1")
    db.execute("CREATE SEQUENCE IF NOT EXISTS seq_sync START 1")

    # ------------------------------------------------------------------------
    # Medical data records
    # ------------------------------------------------------------------------

    db.execute(
        """
        CREATE TABLE IF NOT EXISTS medical_data_records (
            id INTEGER PRIMARY KEY DEFAULT nextval('seq_records'),
            nom VARCHAR NOT NULL,
            type VARCHAR,
            commune VARCHAR,
            province VARCHAR,
            region VARCHAR,
            geometry GEOMETRY,
            source_id VARCHAR,
            synced_at TIMESTAMP,
            osm_id VARCHAR,
            amenity VARCHAR,
            phone VARCHAR,
            website VARCHAR,
            opening_hours VARCHAR,
            categorie VARCHAR,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
        )
        """
    )

    # ------------------------------------------------------------------------
    # Sync history
    # ------------------------------------------------------------------------

    db.execute(
        """
        CREATE TABLE IF NOT EXISTS sync_log (
            id INTEGER PRIMARY KEY DEFAULT nextval('seq_sync'),
            source_id VARCHAR NOT NULL,
            started_at TIMESTAMP,
            finished_at TIMESTAMP,
            status VARCHAR,
            rows_before INTEGER,
            rows_after INTEGER,
            error_message VARCHAR,
            created_at TIMESTAMP DEFAULT now()
        )
        """
    )

    # ------------------------------------------------------------------------
    # Backup table
    # ------------------------------------------------------------------------

    db.execute(
        """
        CREATE TABLE IF NOT EXISTS medical_data_records_previous (
            id INTEGER PRIMARY KEY,
            nom VARCHAR,
            type VARCHAR,
            commune VARCHAR,
            province VARCHAR,
            region VARCHAR,
            geometry GEOMETRY,
            source_id VARCHAR,
            synced_at TIMESTAMP,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        )
        """
    )

    # ------------------------------------------------------------------------
    # Users
    # ------------------------------------------------------------------------

    db.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR PRIMARY KEY,
            email VARCHAR UNIQUE,
            name VARCHAR,
            role VARCHAR,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
        )
        """
    )

    # ------------------------------------------------------------------------
    # Saved geographic zones
    # ------------------------------------------------------------------------

    db.execute(
        """
        CREATE TABLE IF NOT EXISTS zones (
            id VARCHAR PRIMARY KEY,
            name VARCHAR NOT NULL,
            geometry GEOMETRY NOT NULL,
            user_id VARCHAR,
            description VARCHAR,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
        )
        """
    )

    print("✅ Database tables initialized")


# Initialize database when module is imported.
init_database()


# ============================================================================
# COMPATIBILITY HELPER
# ============================================================================


def get_collection():
    """
    Compatibility helper for older tests/code.

    The project previously used MongoDB collections.
    With DuckDB, this returns the shared DuckDB connection.
    """
    return db


# ============================================================================
# MEDICAL DATA OPERATIONS
# ============================================================================


class MedicalData:
    """Medical facilities data operations."""

    @staticmethod
    def insert_many(
        records: list[dict[str, Any]],
        source_id: str | None = None,
    ) -> dict:
        """Insert multiple medical facility records."""

        try:
            count = 0

            for record in records:
                geometry_json = None

                if record.get("geometry"):
                    geometry_json = json.dumps(record["geometry"])

                db.execute(
                    """
                    INSERT INTO medical_data_records (
                        nom,
                        type,
                        commune,
                        province,
                        region,
                        geometry,
                        source_id,
                        synced_at,
                        osm_id,
                        amenity,
                        phone,
                        website,
                        opening_hours,
                        categorie
                    )
                    VALUES (
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ST_GeomFromGeoJSON(?),
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?
                    )
                    """,
                    [
                        record.get("nom"),
                        record.get("type"),
                        record.get("commune"),
                        record.get("province"),
                        record.get("region"),
                        geometry_json,
                        source_id or record.get("source_id"),
                        record.get("synced_at") or datetime.utcnow(),
                        record.get("osm_id"),
                        record.get("amenity"),
                        record.get("phone"),
                        record.get("website"),
                        record.get("opening_hours"),
                        record.get("categorie"),
                    ],
                )

                count += 1

            return {"inserted": count}

        except Exception as e:
            raise Exception(f"Insert failed: {e!s}")

    @staticmethod
    def find_in_zone(zone_geojson: dict) -> list[dict]:
        """Find facilities within a geographic zone."""

        try:
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
                WHERE ST_Within(
                    geometry,
                    ST_GeomFromGeoJSON(?)
                )
                ORDER BY nom
                """,
                [json.dumps(zone_geojson)],
            ).fetchall()

            return [
                {
                    "id": row[0],
                    "nom": row[1],
                    "type": row[2],
                    "commune": row[3],
                    "province": row[4],
                    "region": row[5],
                    "geometry": json.loads(row[6]) if row[6] else None,
                    "source_id": row[7],
                    "synced_at": row[8],
                }
                for row in results
            ]

        except Exception as e:
            raise Exception(f"Zone query failed: {e!s}")

    @staticmethod
    def find_by_type(
        facility_type: str,
        limit: int = 100,
    ) -> list[dict]:
        """Find facilities by type."""

        try:
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
                WHERE type = ?
                LIMIT ?
                """,
                [facility_type, limit],
            ).fetchall()

            return [
                {
                    "id": row[0],
                    "nom": row[1],
                    "type": row[2],
                    "commune": row[3],
                    "province": row[4],
                    "region": row[5],
                    "geometry": json.loads(row[6]) if row[6] else None,
                    "source_id": row[7],
                    "synced_at": row[8],
                }
                for row in results
            ]

        except Exception as e:
            raise Exception(f"Find by type failed: {e!s}")

    @staticmethod
    def get_stats() -> dict:
        """Get database statistics."""

        try:
            total = db.execute(
                """
                SELECT COUNT(*)
                FROM medical_data_records
                """
            ).fetchone()[0]

            by_source = db.execute(
                """
                SELECT source_id, COUNT(*) AS count
                FROM medical_data_records
                GROUP BY source_id
                """
            ).fetchall()

            by_type = db.execute(
                """
                SELECT type, COUNT(*) AS count
                FROM medical_data_records
                GROUP BY type
                ORDER BY count DESC
                """
            ).fetchall()

            return {
                "total": total,
                "by_source": {source: count for source, count in by_source},
                "by_type": {facility_type: count for facility_type, count in by_type},
            }

        except Exception as e:
            raise Exception(f"Stats query failed: {e!s}")


# ============================================================================
# SYNC LOG OPERATIONS
# ============================================================================


class SyncLog:
    """Data synchronization history."""

    @staticmethod
    def create(
        source_id: str,
        status: str,
        rows_before: int = 0,
        rows_after: int = 0,
        error_message: str | None = None,
    ) -> dict:
        """Log a synchronization operation."""

        try:
            now = datetime.utcnow()

            db.execute(
                """
                INSERT INTO sync_log (
                    source_id,
                    started_at,
                    finished_at,
                    status,
                    rows_before,
                    rows_after,
                    error_message
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                [
                    source_id,
                    now,
                    now,
                    status,
                    rows_before,
                    rows_after,
                    error_message,
                ],
            )

            return {"status": "logged"}

        except Exception as e:
            raise Exception(f"Sync log failed: {e!s}")

    @staticmethod
    def get_recent(limit: int = 50) -> list[dict]:
        """Get recent synchronization operations."""

        try:
            results = db.execute(
                """
                SELECT
                    id,
                    source_id,
                    started_at,
                    finished_at,
                    status,
                    rows_before,
                    rows_after,
                    error_message,
                    created_at
                FROM sync_log
                ORDER BY created_at DESC
                LIMIT ?
                """,
                [limit],
            ).fetchall()

            return [
                {
                    "id": row[0],
                    "source_id": row[1],
                    "started_at": row[2],
                    "finished_at": row[3],
                    "status": row[4],
                    "rows_before": row[5],
                    "rows_after": row[6],
                    "error_message": row[7],
                    "created_at": row[8],
                }
                for row in results
            ]

        except Exception as e:
            raise Exception(f"Get sync log failed: {e!s}")


# ============================================================================
# ZONES OPERATIONS
# ============================================================================


class Zones:
    """Saved geographic zones."""

    @staticmethod
    def create(
        zone_id: str,
        name: str,
        geometry: dict,
        user_id: str | None = None,
        description: str | None = None,
    ) -> dict:
        """Create a saved geographic zone."""

        try:
            db.execute(
                """
                INSERT INTO zones (
                    id,
                    name,
                    geometry,
                    user_id,
                    description
                )
                VALUES (
                    ?,
                    ?,
                    ST_GeomFromGeoJSON(?),
                    ?,
                    ?
                )
                """,
                [
                    zone_id,
                    name,
                    json.dumps(geometry),
                    user_id,
                    description,
                ],
            )

            return {
                "id": zone_id,
                "status": "created",
            }

        except Exception as e:
            raise Exception(f"Create zone failed: {e!s}")

    @staticmethod
    def find_by_user(user_id: str) -> list[dict]:
        """Get saved zones for a user."""

        try:
            results = db.execute(
                """
                SELECT
                    id,
                    name,
                    ST_AsGeoJSON(geometry) AS geometry,
                    user_id,
                    description,
                    created_at
                FROM zones
                WHERE user_id = ?
                ORDER BY created_at DESC
                """,
                [user_id],
            ).fetchall()

            return [
                {
                    "id": row[0],
                    "name": row[1],
                    "geometry": json.loads(row[2]),
                    "user_id": row[3],
                    "description": row[4],
                    "created_at": row[5],
                }
                for row in results
            ]

        except Exception as e:
            raise Exception(f"Find zones failed: {e!s}")


# ============================================================================
# CONNECTION HELPERS
# ============================================================================


def get_connection():
    """Get a writable DuckDB connection."""
    return duckdb.connect(DB_PATH, read_only=False)


def get_read_only_connection():
    """Get a read-only DuckDB connection for user queries."""

    conn = duckdb.connect(DB_PATH, read_only=True)

    conn.execute("SET memory_limit='256MB'")
    conn.execute("SET threads=2")

    return conn


def close_connection(conn):
    """Close a DuckDB connection."""

    if conn:
        conn.close()
