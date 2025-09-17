"use client";
import { GoogleMap, LoadScript, DrawingManager } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "900px",
};

const center = { lat: 23.685, lng: 90.356 }; // Bangladesh center

export default function MyMap() {
  const handleOverlayComplete = (e) => {
    if (e.type === "polygon") {
      const path = e.overlay.getPath().getArray();
      const coords = path.map(p => ({ lat: p.lat(), lng: p.lng() }));
      console.log("Polygon coords:", coords);

      // Area in square meters
      const area = window.google.maps.geometry.spherical.computeArea(path);
      console.log("Area:", area, "sq meters");
    }

    if (e.type === "circle") {
      console.log("Circle center:", e.overlay.getCenter().toJSON());
      console.log("Radius:", e.overlay.getRadius(), "meters");
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={["drawing", "geometry"]}
    >
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
        <DrawingManager
          onOverlayComplete={handleOverlayComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              drawingModes: ["polygon", "circle", "rectangle"],
            },
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
}
