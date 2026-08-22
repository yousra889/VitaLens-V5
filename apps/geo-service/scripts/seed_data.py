"""
Populates MongoDB with a handful of sample établissements so the
zone-query endpoint has something to return locally. NOT real data -
the checklist's "N8N scraper" (Sprint 2) is what eventually replaces
this with the actual Carte sanitaire / data.gov.ma sync.

Usage:
    python scripts/seed_data.py
"""

from pymongo import MongoClient

from app.config import settings

SAMPLE_RECORDS = [
    {
        "name": "Centre de santé Hassan",
        "type": "Centre de santé",
        "commune": "Rabat",
        "province": "Rabat",
        "geometry": {"type": "Point", "coordinates": [-6.8348, 34.0181]},
    },
    {
        "name": "Hôpital Ibn Sina",
        "type": "Hôpital",
        "commune": "Rabat",
        "province": "Rabat",
        "geometry": {"type": "Point", "coordinates": [-6.8498, 34.0089]},
    },
    {
        "name": "Centre de santé Bettana",
        "type": "Centre de santé",
        "commune": "Salé",
        "province": "Salé",
        "geometry": {"type": "Point", "coordinates": [-6.8078, 34.0489]},
    },
    {
        "name": "Dispensaire Tabriquet",
        "type": "Dispensaire",
        "commune": "Salé",
        "province": "Salé",
        "geometry": {"type": "Point", "coordinates": [-6.7961, 34.0533]},
    },
    {
        "name": "Hôpital Ibn Rochd",
        "type": "Hôpital",
        "commune": "Casablanca",
        "province": "Casablanca",
        "geometry": {"type": "Point", "coordinates": [-7.6309, 33.5764]},
    },
    {
        "name": "Centre de santé Midelt",
        "type": "Centre de santé",
        "commune": "Midelt",
        "province": "Midelt",
        "geometry": {"type": "Point", "coordinates": [-4.7358, 32.6852]},
    },
]


def seed() -> None:
    client = MongoClient(settings.mongodb_uri)
    collection = client[settings.mongodb_db][settings.collection_name]

    collection.delete_many({})
    result = collection.insert_many(SAMPLE_RECORDS)
    collection.create_index([("geometry", "2dsphere")])

    print(
        f"Inserted {len(result.inserted_ids)} sample records into "
        f"{settings.mongodb_db}.{settings.collection_name}"
    )


if __name__ == "__main__":
    seed()
