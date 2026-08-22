from app.geo import filter_establishments_in_zone

# A rough box over central Rabat
RABAT_ZONE = {
    "type": "Polygon",
    "coordinates": [
        [
            [-6.86, 34.00],
            [-6.83, 34.00],
            [-6.83, 34.03],
            [-6.86, 34.03],
            [-6.86, 34.00],
        ]
    ],
}

INSIDE_RABAT = {
    "name": "Centre de santé Hassan",
    "type": "Centre de santé",
    "geometry": {"type": "Point", "coordinates": [-6.845, 34.015]},
}

OUTSIDE_RABAT_IN_CASABLANCA = {
    "name": "Hôpital Ibn Rochd",
    "type": "Hôpital",
    "geometry": {"type": "Point", "coordinates": [-7.63, 33.57]},
}


def test_returns_empty_list_for_no_records():
    assert filter_establishments_in_zone([], RABAT_ZONE) == []


def test_keeps_point_inside_zone():
    result = filter_establishments_in_zone([INSIDE_RABAT], RABAT_ZONE)
    assert result == [INSIDE_RABAT]


def test_drops_point_outside_zone():
    result = filter_establishments_in_zone([OUTSIDE_RABAT_IN_CASABLANCA], RABAT_ZONE)
    assert result == []


def test_mixed_records_returns_only_matches():
    result = filter_establishments_in_zone(
        [INSIDE_RABAT, OUTSIDE_RABAT_IN_CASABLANCA], RABAT_ZONE
    )
    assert result == [INSIDE_RABAT]
