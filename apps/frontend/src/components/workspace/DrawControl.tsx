import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import type { GeoJSONPolygon } from "../../api/client";

interface DrawControlProps {
  onZoneDrawn: (polygon: GeoJSONPolygon) => void;
  onCleared: () => void;
}

export function DrawControl({
  onZoneDrawn,
  onCleared,
}: DrawControlProps) {
  const map = useMap();

  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  const callbacksRef = useRef({
    onZoneDrawn,
    onCleared,
  });

  useEffect(() => {
    callbacksRef.current = {
      onZoneDrawn,
      onCleared,
    };
  }, [onZoneDrawn, onCleared]);

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();

    drawnItemsRef.current = drawnItems;
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: "topright",

      draw: {
        polygon: {
          allowIntersection: false,
          shapeOptions: {
            color: "#22d3ee",
            weight: 2,
            opacity: 0.9,
            fillColor: "#14b8a6",
            fillOpacity: 0.2,
          },
        },

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

    const sections = document.querySelectorAll(
      ".leaflet-draw-section",
    );

    if (sections.length > 1) {
      (sections[1] as HTMLElement).style.marginTop = "8px";
    }

    function sendPolygon(layer: L.Polygon) {
      const geoJson = layer.toGeoJSON();

      if (geoJson.geometry.type === "Polygon") {
        callbacksRef.current.onZoneDrawn({
          type: "Polygon",
          coordinates:
            geoJson.geometry.coordinates as number[][][],
        });
      }
    }

    const handleCreated = (event: L.LeafletEvent) => {
      const createdEvent =
        event as L.DrawEvents.Created;

      const layer =
        createdEvent.layer as L.Polygon;

      // Only one zone at a time
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      layer.on("edit", () => {
        sendPolygon(layer);
      });

      sendPolygon(layer);
    };

    // THIS WAS MISSING
    const handleDeleted = () => {
      if (drawnItems.getLayers().length === 0) {
        callbacksRef.current.onCleared();
      }
    };

    map.on(
      L.Draw.Event.CREATED,
      handleCreated,
    );

    map.on(
      L.Draw.Event.DELETED,
      handleDeleted,
    );

    return () => {
      map.off(
        L.Draw.Event.CREATED,
        handleCreated,
      );

      map.off(
        L.Draw.Event.DELETED,
        handleDeleted,
      );

      // Clean up Leaflet Draw properly
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);

      drawnItemsRef.current = null;
    };
  }, [map]);

  return null;
}