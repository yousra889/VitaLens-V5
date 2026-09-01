import { useEffect, useRef } from "react";

import { useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import type { GeoJSONPolygon } from "../../api/client";

interface DrawControlProps {
  onZoneDrawn: (
    polygon: GeoJSONPolygon,
  ) => void;

  onCleared: () => void;
}

export function DrawControl({
  onZoneDrawn,
  onCleared,
}: DrawControlProps) {
  const map = useMap();

  const drawnItemsRef =
    useRef<L.FeatureGroup | null>(null);
  
  const callbacksRef = useRef({ onZoneDrawn, onCleared });

  useEffect(() => {
    callbacksRef.current = { onZoneDrawn, onCleared };
  }, [onZoneDrawn, onCleared]);

  useEffect(() => {
    if (!drawnItemsRef.current) {
      const drawnItems = new L.FeatureGroup();
      drawnItemsRef.current = drawnItems;
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        position: "topright",

        draw: {
          polygon: {
            shapeOptions: {
              color: "#5eead4",
              weight: 2,
              fillColor: "#14b8a6",
              fillOpacity: 0.16,
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

      setTimeout(() => {
        const sections = document.querySelectorAll('.leaflet-draw-section');
        if (sections.length > 1) {
          (sections[1] as HTMLElement).style.marginTop = '8px';
        }
      }, 100);

      // Intercept delete button
      const deleteButton = document.querySelector('.leaflet-draw-edit-remove') as HTMLElement;
      if (deleteButton) {
        deleteButton.addEventListener('click', () => {
          console.log("Delete button clicked");
          setTimeout(() => {
            drawnItems.clearLayers();
            callbacksRef.current.onCleared();
          }, 100);
        });
      }
    }

    const drawnItems = drawnItemsRef.current;

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
      const createdEvent = event as L.DrawEvents.Created;
      const layer = createdEvent.layer as L.Polygon;

      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      console.log("Polygon created");

      layer.on('edit', () => {
        console.log("Polygon edited");
        sendPolygon(layer);
      });

      sendPolygon(layer);
    };

    map.on(L.Draw.Event.CREATED, handleCreated);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
    };
  }, [map]);

  return null;
}