import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import type { GeoJSONPolygon } from "../api/client";

interface DrawControlProps {
  onZoneDrawn: (polygon: GeoJSONPolygon) => void;
  onCleared: () => void;
}

export function DrawControl({ onZoneDrawn, onCleared }: DrawControlProps) {
  const map = useMap();
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    drawnItemsRef.current = drawnItems;
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polygon: {
          shapeOptions: { color: "#1b6e62", weight: 2, fillOpacity: 0.12 },
        },
        // Only the polygon zone-draw tool is part of the MVP flow.
        marker: false,
        circle: false,
        circlemarker: false,
        polyline: false,
        rectangle: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });
    map.addControl(drawControl);

    const handleCreated = (event: L.LeafletEvent) => {
      const createdEvent = event as L.DrawEvents.Created;
      drawnItems.clearLayers(); // one zone at a time
      const layer = createdEvent.layer as L.Polygon;
      drawnItems.addLayer(layer);

      const geoJson = layer.toGeoJSON();
      if (geoJson.geometry.type === "Polygon") {
        onZoneDrawn({
          type: "Polygon",
          coordinates: geoJson.geometry.coordinates as number[][][],
        });
      }
    };

    const handleDeleted = () => {
      if (drawnItems.getLayers().length === 0) onCleared();
    };

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.DELETED, handleDeleted);
    map.on(L.Draw.Event.EDITED, handleCreated);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.DELETED, handleDeleted);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}
