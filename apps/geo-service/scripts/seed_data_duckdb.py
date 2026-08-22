"""
Seed sample medical facility data into DuckDB for testing.
"""

import json
from datetime import datetime
from app.db import db

# Sample medical facilities in Morocco
SAMPLE_DATA = [
    {
        "nom": "Hôpital Ibn Sina",
        "type": "hospital",
        "commune": "Casablanca",
        "province": "Casablanca-Settat",
        "region": "Casablanca-Settat",
        "geometry": {
            "type": "Point",
            "coordinates": [-7.5898, 33.5731]
        },
        "source_id": "sample",
        "amenity": "hospital",
        "phone": "+212 522 48 48 48"
    },
    {
        "nom": "Clinique Atlas",
        "type": "clinic",
        "commune": "Rabat",
        "province": "Rabat-Salé-Kénitra",
        "region": "Rabat-Salé-Kénitra",
        "geometry": {
            "type": "Point",
            "coordinates": [-6.8416, 34.0209]
        },
        "source_id": "sample",
        "amenity": "clinic"
    },
    {
        "nom": "Pharmacie Centrale",
        "type": "pharmacy",
        "commune": "Fès",
        "province": "Fès-Meknès",
        "region": "Fès-Meknès",
        "geometry": {
            "type": "Point",
            "coordinates": [-5.0074, 34.0731]
        },
        "source_id": "sample",
        "amenity": "pharmacy"
    },
    {
        "nom": "Hôpital Universitaire",
        "type": "hospital",
        "commune": "Marrakech",
        "province": "Marrakech-Safi",
        "region": "Marrakech-Safi",
        "geometry": {
            "type": "Point",
            "coordinates": [-8.0100, 31.6295]
        },
        "source_id": "sample",
        "amenity": "hospital"
    },
    {
        "nom": "Centre Médical Agadir",
        "type": "clinic",
        "commune": "Agadir",
        "province": "Souss-Massa",
        "region": "Souss-Massa",
        "geometry": {
            "type": "Point",
            "coordinates": [-9.5982, 30.4278]
        },
        "source_id": "sample",
        "amenity": "clinic"
    },
    {
        "nom": "Hôpital Al-Farabi",
        "type": "hospital",
        "commune": "Tangier",
        "province": "Tanger-Tétouan-Al Hoceïma",
        "region": "Tanger-Tétouan-Al Hoceïma",
        "geometry": {
            "type": "Point",
            "coordinates": [-5.8073, 35.7595]
        },
        "source_id": "sample",
        "amenity": "hospital"
    },
    {
        "nom": "Pharmacie du Centre",
        "type": "pharmacy",
        "commune": "Salé",
        "province": "Rabat-Salé-Kénitra",
        "region": "Rabat-Salé-Kénitra",
        "geometry": {
            "type": "Point",
            "coordinates": [-6.7988, 34.0475]
        },
        "source_id": "sample",
        "amenity": "pharmacy"
    },
    {
        "nom": "Clinique Moderne",
        "type": "clinic",
        "commune": "Meknès",
        "province": "Fès-Meknès",
        "region": "Fès-Meknès",
        "geometry": {
            "type": "Point",
            "coordinates": [-5.5447, 33.8869]
        },
        "source_id": "sample",
        "amenity": "clinic"
    },
    {
        "nom": "Hôpital Mohammadi",
        "type": "hospital",
        "commune": "Oujda",
        "province": "Oriental",
        "region": "Oriental",
        "geometry": {
            "type": "Point",
            "coordinates": [-1.9075, 34.6741]
        },
        "source_id": "sample",
        "amenity": "hospital"
    },
    {
        "nom": "Centre de Santé El Aaiun",
        "type": "clinic",
        "commune": "Laâyoune",
        "province": "Laâyoune-Sakia El Hamra",
        "region": "Laâyoune-Sakia El Hamra",
        "geometry": {
            "type": "Point",
            "coordinates": [-13.2044, 27.1242]
        },
        "source_id": "sample",
        "amenity": "clinic"
    }
]

def seed():
    """Insert sample data into DuckDB."""
    print("🌱 Seeding sample medical facility data...")
    
    try:
        # Delete existing sample data
        db.execute(
            "DELETE FROM medical_data_records WHERE source_id = 'sample'"
        )
        
        inserted = 0
        for record in SAMPLE_DATA:
            geometry_json = json.dumps(record["geometry"])
            
            db.execute(
                """
                INSERT INTO medical_data_records
                    (nom, type, commune, province, region, geometry, source_id,
                     amenity, phone, synced_at)
                VALUES (?, ?, ?, ?, ?, ST_GeomFromGeoJSON(?), ?, ?, ?, ?)
                """,
                [
                    record.get("nom"),
                    record.get("type"),
                    record.get("commune"),
                    record.get("province"),
                    record.get("region"),
                    geometry_json,
                    record.get("source_id"),
                    record.get("amenity"),
                    record.get("phone"),
                    datetime.utcnow(),
                ],
            )
            inserted += 1
        
        # Verify
        count = db.execute(
            "SELECT COUNT(*) FROM medical_data_records WHERE source_id = 'sample'"
        ).fetchone()[0]
        
        print(f"✅ Successfully seeded {count} sample records")
        
    except Exception as e:
        print(f"❌ Seeding failed: {e}")
        raise

if __name__ == "__main__":
    seed()
