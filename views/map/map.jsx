"use client";
import { GoogleMap, LoadScript, DrawingManager } from "@react-google-maps/api";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  Square,
  Circle,
  Hand,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import html2canvas from "html2canvas-pro";

const containerStyle = {
  width: "100%",
  height: "900px",
};

const center = { lat: 23.685, lng: 90.356 }; // Bangladesh center

// Color palette for different shapes
const shapeColors = [
  {
    bg: "bg-blue-500",
    text: "text-blue-500",
    border: "border-blue-500",
    name: "Blue",
    hex: { bg: "#3b82f6", border: "#3b82f6" },
  },
  {
    bg: "bg-green-500",
    text: "text-green-500",
    border: "border-green-500",
    name: "Green",
    hex: { bg: "#22c55e", border: "#22c55e" },
  },
  {
    bg: "bg-purple-500",
    text: "text-purple-500",
    border: "border-purple-500",
    name: "Purple",
    hex: { bg: "#a855f7", border: "#a855f7" },
  },
  {
    bg: "bg-red-500",
    text: "text-red-500",
    border: "border-red-500",
    name: "Red",
    hex: { bg: "#ef4444", border: "#ef4444" },
  },
  {
    bg: "bg-yellow-500",
    text: "text-yellow-500",
    border: "border-yellow-500",
    name: "Yellow",
    hex: { bg: "#eab308", border: "#eab308" },
  },
  {
    bg: "bg-pink-500",
    text: "text-pink-500",
    border: "border-pink-500",
    name: "Pink",
    hex: { bg: "#ec4899", border: "#ec4899" },
  },
  {
    bg: "bg-indigo-500",
    text: "text-indigo-500",
    border: "border-indigo-500",
    name: "Indigo",
    hex: { bg: "#6366f1", border: "#6366f1" },
  },
  {
    bg: "bg-orange-500",
    text: "text-orange-500",
    border: "border-orange-500",
    name: "Orange",
    hex: { bg: "#f97316", border: "#f97316" },
  },
  {
    bg: "bg-teal-500",
    text: "text-teal-500",
    border: "border-teal-500",
    name: "Teal",
    hex: { bg: "#14b8a6", border: "#14b8a6" },
  },
  {
    bg: "bg-cyan-500",
    text: "text-cyan-500",
    border: "border-cyan-500",
    name: "Cyan",
    hex: { bg: "#06b6d4", border: "#06b6d4" },
  },
  {
    bg: "bg-lime-500",
    text: "text-lime-500",
    border: "border-lime-500",
    name: "Lime",
    hex: { bg: "#84cc16", border: "#84cc16" },
  },
  {
    bg: "bg-amber-500",
    text: "text-amber-500",
    border: "border-amber-500",
    name: "Amber",
    hex: { bg: "#f59e0b", border: "#f59e0b" },
  },
];

export default function MyMap() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [areaInfoList, setAreaInfoList] = useState([]); // Changed to array for multiple areas
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [overlays, setOverlays] = useState([]);

  // Handle map load
  const handleMapLoad = useCallback((map) => {
    setMapInstance(map);
    setIsMapLoaded(true);
  }, []);

  // Handle drawing manager load
  const handleDrawingManagerLoad = useCallback((drawingManager) => {
    drawingManagerRef.current = drawingManager;
  }, []);

  const formatArea = (area) => {
    if (area < 10000) {
      return `${area.toFixed(2)} sq meters`;
    } else if (area < 1000000) {
      return `${(area / 10000).toFixed(2)} hectares`;
    } else {
      return `${(area / 1000000).toFixed(2)} sq km`;
    }
  };

  const getNextColor = () => {
    return shapeColors[areaInfoList.length % shapeColors.length];
  };

  const handleOverlayComplete = useCallback(
    (e) => {
      let area = 0;
      let info = {};
      const color = getNextColor();
      const id = Date.now(); // Simple ID generation

      // Store the overlay with just the id for reference
      setOverlays((prev) => [...prev, { overlay: e.overlay, id }]);

      if (e.type === "polygon") {
        e.overlay.setOptions({
          fillColor: color.hex.bg,
          strokeColor: color.hex.border,
          strokeWeight: 3,
          fillOpacity: 0.4,
          strokeOpacity: 1,
          clickable: true,
          draggable: false,
          editable: true,
          geodesic: true,
          zIndex: 1,
        });
        const path = e.overlay.getPath().getArray();
        const coords = path.map((p) => ({ lat: p.lat(), lng: p.lng() }));
        area = window.google.maps.geometry.spherical.computeArea(path);
        info = {
          id,
          type: "Polygon",
          area: formatArea(area),
          rawArea: area,
          coordinates: coords.length,
          color,
          visible: true,
          overlay: e.overlay, // Store direct reference to overlay
          createdAt: new Date().toLocaleTimeString(),
        };
      }

      if (e.type === "circle") {
        e.overlay.setOptions({
          fillColor: color.hex.bg,
          strokeColor: color.hex.border,
          strokeWeight: 3,
          fillOpacity: 0.4,
          strokeOpacity: 1,
          clickable: true,
          draggable: false,
          editable: true,
          geodesic: true,
          zIndex: 1,
        });
        const radius = e.overlay.getRadius();
        area = Math.PI * radius * radius;
        info = {
          id,
          type: "Circle",
          area: formatArea(area),
          rawArea: area,
          radius: `${radius.toFixed(2)} meters`,
          color,
          visible: true,
          overlay: e.overlay, // Store direct reference to overlay
          createdAt: new Date().toLocaleTimeString(),
        };
      }

      if (e.type === "rectangle") {
        e.overlay.setOptions({
          fillColor: color.hex.bg,
          strokeColor: color.hex.border,
          strokeWeight: 3,
          fillOpacity: 0.4,
          strokeOpacity: 1,
          clickable: true,
          draggable: false,
          editable: true,
          geodesic: true,
          zIndex: 1,
        });
        const bounds = e.overlay.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const nw = new google.maps.LatLng(ne.lat(), sw.lng());
        const se = new google.maps.LatLng(sw.lat(), ne.lng());
        const path = [ne, nw, sw, se];
        const area = google.maps.geometry.spherical.computeArea(path);

        info = {
          id,
          type: "Rectangle",
          area: formatArea(area),
          rawArea: area,
          color,
          visible: true,
          overlay: e.overlay, // Store direct reference to overlay
          createdAt: new Date().toLocaleTimeString(),
        };
      }

      setAreaInfoList((prev) => [...prev, info]);
    },
    [areaInfoList.length]
  );

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);

    if (
      window.google &&
      window.google.maps &&
      window.google.maps.drawing &&
      drawingManagerRef.current
    ) {
      try {
        const drawingModes = {
          polygon: window.google.maps.drawing.OverlayType.POLYGON,
          circle: window.google.maps.drawing.OverlayType.CIRCLE,
          rectangle: window.google.maps.drawing.OverlayType.RECTANGLE,
          hand: null,
        };

        const drawingManager = drawingManagerRef.current;
        if (drawingManager.setDrawingMode) {
          drawingManager.setDrawingMode(drawingModes[tool]);
        }
      } catch (error) {
        console.warn("Drawing mode could not be set:", error);
        setTimeout(() => {
          if (
            drawingManagerRef.current &&
            drawingManagerRef.current.setDrawingMode
          ) {
            const drawingModes = {
              polygon: window.google.maps.drawing.OverlayType.POLYGON,
              circle: window.google.maps.drawing.OverlayType.CIRCLE,
              rectangle: window.google.maps.drawing.OverlayType.RECTANGLE,
              hand: null,
            };
            drawingManagerRef.current.setDrawingMode(drawingModes[tool]);
          }
        }, 100);
      }
    }
  };

  // Add this function to focus on a specific area
  const focusOnArea = useCallback(
    (area) => {
      if (!mapInstance || !area.overlay) return;

      try {
        if (area.type === "Circle") {
          const center = area.overlay.getCenter();
          const radius = area.overlay.getRadius();

          // Calculate bounds for circle
          const bounds = new window.google.maps.Circle({
            center: center,
            radius: radius,
          }).getBounds();

          mapInstance.fitBounds(bounds);
          mapInstance.setZoom(mapInstance.getZoom() - 3); // Slight zoom out for better view
        } else if (area.type === "Polygon") {
          const path = area.overlay.getPath();
          const bounds = new window.google.maps.LatLngBounds();

          for (let i = 0; i < path.getLength(); i++) {
            bounds.extend(path.getAt(i));
          }

          mapInstance.fitBounds(bounds);
        } else if (area.type === "Rectangle") {
          const bounds = area.overlay.getBounds();
          mapInstance.fitBounds(bounds);
        }
      } catch (error) {
        console.warn("Error focusing on area:", error);
      }
    },
    [mapInstance]
  );

  const toggleAreaVisibility = (id) => {
    setAreaInfoList((prev) =>
      prev.map((area) => {
        if (area.id === id) {
          const newVisible = !area.visible;
          // Toggle overlay visibility
          if (area.overlay) {
            area.overlay.setVisible(newVisible);
          }
          return { ...area, visible: newVisible };
        }
        return area;
      })
    );
  };

  const deleteArea = (id) => {
    // Find the area to get its overlay reference
    const areaToDelete = areaInfoList.find((area) => area.id === id);
    if (areaToDelete && areaToDelete.overlay) {
      try {
        areaToDelete.overlay.setMap(null);
      } catch (error) {
        console.warn("Error removing overlay:", error);
      }
    }

    // Remove from area list
    setAreaInfoList((prev) => prev.filter((area) => area.id !== id));

    // Remove from overlays array
    setOverlays((prev) => prev.filter((o) => o.id !== id));
  };
  let staticMapUrl = "";

  const takeScreenshot = async () => {
    const container = document.getElementById("map-container"); // your map container

    if (!container) {
      alert("Map container not ready");
      return;
    }

    try {
      const canvas = await html2canvas(container, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        scale: 2, // higher resolution
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `map-screenshot-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error taking screenshot:", err);
      alert("Screenshot failed, check console.");
    }
  };

  const clearAllDrawings = () => {
    // Clear all overlays from map using the area info list which has direct overlay references
    areaInfoList.forEach((area) => {
      if (area.overlay) {
        try {
          area.overlay.setMap(null);
        } catch (error) {
          console.warn("Error removing overlay:", error);
        }
      }
    });

    // Clear state
    setAreaInfoList([]);
    setOverlays([]);
    setSelectedTool(null);

    if (
      window.google &&
      window.google.maps &&
      window.google.maps.drawing &&
      drawingManagerRef.current
    ) {
      try {
        if (drawingManagerRef.current.setDrawingMode) {
          drawingManagerRef.current.setDrawingMode(null);
        }
      } catch (error) {
        console.warn("Could not clear drawing mode:", error);
      }
    }
  };

  const getTotalArea = () => {
    const total = areaInfoList.reduce(
      (sum, area) => sum + (area.rawArea || 0),
      0
    );
    return formatArea(total);
  };

  return (
    <div
      className="relative w-full h-screen"
      id="map-container"
      // style={{
      //   backgroundImage: staticMapUrl,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
    >
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={["drawing", "geometry"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          ref={mapRef}
          onLoad={handleMapLoad}
        >
          <DrawingManager
            onLoad={handleDrawingManagerLoad}
            onOverlayComplete={handleOverlayComplete}
            options={{
              drawingControl: false,
              drawingControlOptions: {
                drawingModes: ["polygon", "circle", "rectangle"],
              },
            }}
          />
        </GoogleMap>
      </LoadScript>

      {/* Side Menu */}
      <div
        className={`absolute top-0 right-0 h-full bg-white shadow-2xl transition-all duration-300 ease-in-out ${
          isSideMenuOpen ? "w-96" : "w-0"
        } overflow-hidden border-l border-gray-200`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Area Analysis</h2>
                <p className="text-blue-100 text-sm">
                  {areaInfoList.length} shape
                  {areaInfoList.length !== 1 ? "s" : ""} drawn
                </p>
              </div>
              <button
                onClick={() => setIsSideMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Total Area Summary */}
          {areaInfoList.length > 0 && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Area</p>
                <p className="text-2xl font-bold text-green-600">
                  {getTotalArea()}
                </p>
              </div>
            </div>
          )}

          {/* Areas List */}
          <div className="flex-1 overflow-y-auto">
            {areaInfoList.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center p-6">
                <div>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Square size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No areas drawn
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Use the drawing tools to create shapes and calculate areas
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {areaInfoList.map((area, index) => (
                  <div
                    key={area.id}
                    className={`bg-white rounded-xl shadow-md border-l-4 ${
                      area.color.border
                    } transition-all duration-200 hover:shadow-lg ${
                      !area.visible ? "opacity-60" : ""
                    } cursor-pointer hover:border-l-8`}
                    onClick={() => focusOnArea(area)}
                  >
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full ${area.color.bg}`}
                          ></div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {area.type} #{index + 1}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {area.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => toggleAreaVisibility(area.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              area.visible
                                ? "text-gray-600 hover:bg-gray-100"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title={area.visible ? "Hide shape" : "Show shape"}
                          >
                            {area.visible ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => deleteArea(area.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete shape"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Area:</span>
                          <span className={`font-bold ${area.color.text}`}>
                            {area.area}
                          </span>
                        </div>

                        {area.coordinates && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Points:
                            </span>
                            <span className="font-semibold text-gray-800">
                              {area.coordinates}
                            </span>
                          </div>
                        )}

                        {area.radius && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Radius:
                            </span>
                            <span className="font-semibold text-gray-800">
                              {area.radius}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {areaInfoList.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={clearAllDrawings}
                className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Trash2 size={18} />
                <span>Clear All Areas</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Side Menu Toggle Button */}
      {!isSideMenuOpen && (
        <button
          onClick={() => setIsSideMenuOpen(true)}
          className="absolute top-6 right-6 bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition-all duration-200 border border-gray-200"
          title="Open area panel"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
      )}

      {/* Bottom Toolbar */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-2xl p-4 flex items-center space-x-2 border border-gray-200">
        {/* Hand/Pan Tool */}
        <button
          onClick={() => handleToolSelect("hand")}
          className={`p-4 rounded-lg transition-all duration-200 ${
            selectedTool === "hand"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Pan Tool"
        >
          <Hand size={32} />
        </button>

        {/* Polygon Tool */}
        <button
          onClick={() => handleToolSelect("polygon")}
          className={`p-4 rounded-lg transition-all duration-200 ${
            selectedTool === "polygon"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Draw Polygon"
        >
          <svg width={32} height={32} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>

        {/* Circle Tool */}
        <button
          onClick={() => handleToolSelect("circle")}
          className={`p-4 rounded-lg transition-all duration-200 ${
            selectedTool === "circle"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Draw Circle"
        >
          <Circle size={32} />
        </button>

        {/* Rectangle Tool */}
        <button
          onClick={() => handleToolSelect("rectangle")}
          className={`p-4 rounded-lg transition-all duration-200 ${
            selectedTool === "rectangle"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Draw Rectangle"
        >
          <Square size={32} />
        </button>

        {/* Divider */}
        <div className="w-px h-12 bg-gray-300 mx-2"></div>

        {/* Screenshot Tool */}
        <button
          onClick={takeScreenshot}
          className="p-4 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200"
          title="Take Screenshot"
        >
          <Camera size={32} />
        </button>

        {/* Areas Count Badge */}
        {areaInfoList.length > 0 && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-600 font-semibold text-sm">
              {areaInfoList.length} area{areaInfoList.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
