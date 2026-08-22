# geo-service (FastAPI)

`POST /zone-query` - takes a drawn zone (GeoJSON polygon), filters
`medical_data_records` with GeoPandas/Shapely, returns the
établissements inside it. Called by the gateway, not directly by the
frontend.

## Run locally

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

python scripts/seed_data.py     # puts 6 sample établissements in Mongo
uvicorn app.main:app --reload --port 8000
```

Docs/try-it-out UI at `http://localhost:8000/docs`.

## Test

```bash
pytest        # unit tests use mongomock, no real Mongo needed
ruff check .
```

## Notes

- Pulls the whole collection into memory and filters in GeoPandas.
  Fine at the current scale (checklist's "au moins 100
  enregistrements"); switch to a Mongo `$geoWithin` query against the
  existing 2dsphere index first if this collection gets big.
- `scripts/seed_data.py` is sample data for local dev/testing, not
  the real N8N-fed sync.
