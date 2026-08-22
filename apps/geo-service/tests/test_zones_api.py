from fastapi.testclient import TestClient

from app.main import app
from tests.test_geo import RABAT_ZONE

client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_zone_query_returns_only_matching_establishment():
    response = client.post(
        "/zones/query",
        json={"geometry": RABAT_ZONE},
    )

    assert response.status_code == 200

    body = response.json()

    assert "count" in body
    assert "establishments" in body
