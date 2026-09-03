import { useEffect, useRef, useState } from "react";
import {
  Navigation,
  MapPin,
  ExternalLink,
  Car,
  RotateCcw,
  Loader2,
  AlertCircle,
  Compass,
} from "lucide-react";
import { siteConfig } from "@/config/site";

// Institute coordinates in Vijayawada, Andhra Pradesh, India
const CAMPUS_COORDS: [number, number] = [16.5062, 80.648];

interface RouteInfo {
  distanceKm: string;
  durationMin: string;
  userCoords: [number, number];
}

export function CampusMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize Leaflet only in the browser (SSR-safe)
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      try {
        const LModule = await import("leaflet");
        const L = (LModule as any).default || LModule;
        await import("leaflet/dist/leaflet.css");
        if (!isMounted || !mapContainerRef.current) return;

        leafletRef.current = L;

        // Custom default icons fix for Leaflet in bundlers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        const map = L.map(mapContainerRef.current, {
          center: CAMPUS_COORDS,
          zoom: 13,
          scrollWheelZoom: false, // Prevents hijacking page scroll
        });

        // OpenStreetMap Tile Layer (100% Free & Open)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Custom Gold Campus Marker
        const campusIcon = L.divIcon({
          className: "campus-marker-wrapper",
          html: `
            <div style="
              background: #d4af37;
              color: #0b1120;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid #ffffff;
              box-shadow: 0 4px 14px rgba(0,0,0,0.5);
              font-size: 16px;
              font-weight: bold;
            ">
              ✝
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -38],
        });

        const marker = L.marker(CAMPUS_COORDS, { icon: campusIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <p style="font-weight: 700; color: #0b1120; font-size: 14px; margin: 0 0 4px 0;">
              ${siteConfig.name}
            </p>
            <p style="color: #475569; font-size: 12px; margin: 0 0 6px 0;">
              Vijayawada, Andhra Pradesh, India
            </p>
            <span style="display: inline-block; background: #fef3c7; color: #92400e; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 9999px;">
              Equipping the saints for His ministry
            </span>
          </div>
        `);

        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (err) {
        console.error("Failed to load map:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle "Navigate" button click
  const handleNavigate = () => {
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setNavigating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const userCoords: [number, number] = [userLat, userLng];

        const map = mapInstanceRef.current;
        const L = leafletRef.current;

        if (!map || !L) {
          setNavigating(false);
          return;
        }

        // Add user marker
        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
        }

        const userIcon = L.divIcon({
          className: "user-marker-wrapper",
          html: `
            <div style="
              background: #3b82f6;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              border: 3px solid #ffffff;
              box-shadow: 0 0 12px rgba(59, 130, 246, 0.8);
            "></div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        userMarkerRef.current = L.marker(userCoords, { icon: userIcon })
          .addTo(map)
          .bindPopup("<b>Your Location</b>")
          .openPopup();

        // Query Free OSRM Routing Service
        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${CAMPUS_COORDS[1]},${CAMPUS_COORDS[0]}?overview=full&geometries=geojson`
          );
          const data = await res.json();

          if (routeLayerRef.current) {
            map.removeLayer(routeLayerRef.current);
            routeLayerRef.current = null;
          }

          if (data.code === "Ok" && data.routes && data.routes[0]) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]]
            );

            // Draw route polyline
            const polyline = L.polyline(coordinates, {
              color: "#d4af37",
              weight: 5,
              opacity: 0.9,
              lineCap: "round",
            }).addTo(map);

            routeLayerRef.current = polyline;

            // Fit map to show both user and campus
            map.fitBounds(polyline.getBounds(), {
              padding: [50, 50],
            });

            const distanceKm = (route.distance / 1000).toFixed(1);
            const durationMin = Math.round(route.duration / 60).toString();

            setRouteInfo({
              distanceKm,
              durationMin,
              userCoords,
            });
          } else {
            // Fallback direct line if road route not found (e.g. overseas)
            const fallbackLine = L.polyline([userCoords, CAMPUS_COORDS], {
              color: "#d4af37",
              dashArray: "6, 8",
              weight: 4,
              opacity: 0.8,
            }).addTo(map);

            routeLayerRef.current = fallbackLine;
            map.fitBounds(fallbackLine.getBounds(), { padding: [50, 50] });

            setRouteInfo({
              distanceKm: "Direct route plotted",
              durationMin: "Flight / Distance view",
              userCoords,
            });
          }
        } catch (fetchErr) {
          console.error("Routing error:", fetchErr);
          // Fallback direct line
          const fallbackLine = L.polyline([userCoords, CAMPUS_COORDS], {
            color: "#d4af37",
            dashArray: "6, 8",
            weight: 4,
            opacity: 0.8,
          }).addTo(map);
          routeLayerRef.current = fallbackLine;
          map.fitBounds(fallbackLine.getBounds(), { padding: [50, 50] });

          setRouteInfo({
            distanceKm: "Distance available",
            durationMin: "Via GPS",
            userCoords,
          });
        } finally {
          setNavigating(false);
        }
      },
      (geoErr) => {
        setNavigating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setErrorMsg(
            "Location permission was denied. You can open directions directly in Google Maps below."
          );
        } else {
          setErrorMsg("Could not detect your location. Please check your GPS settings.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Reset to default campus view
  const handleReset = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    map.setView(CAMPUS_COORDS, 13);
    setRouteInfo(null);
    setErrorMsg(null);
  };

  const googleMapsUrl = routeInfo
    ? `https://www.google.com/maps/dir/?api=1&origin=${routeInfo.userCoords[0]},${routeInfo.userCoords[1]}&destination=Vijayawada,+Andhra+Pradesh,+India`
    : `https://www.google.com/maps/dir/?api=1&destination=Vijayawada,+Andhra+Pradesh,+India`;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 shadow-2xl backdrop-blur-md">
      {/* Interactive Map Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 bg-card/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground">
              Campus Location
            </h3>
            <p className="text-xs text-muted-foreground">
              Vijayawada, Andhra Pradesh, India
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!routeInfo ? (
            <button
              type="button"
              disabled={navigating}
              onClick={handleNavigate}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-gold-foreground shadow-md shadow-gold/20 transition-all hover:bg-gold/90 hover:scale-105 active:scale-95 disabled:opacity-60"
            >
              {navigating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Locating you...</span>
                </>
              ) : (
                <>
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Navigate to Campus</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Map</span>
            </button>
          )}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs font-medium text-gold transition-colors hover:bg-gold/20"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Map Display Container */}
      <div className="relative h-[380px] w-full sm:h-[440px]">
        <div ref={mapContainerRef} className="h-full w-full z-10" />

        {!mapLoaded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/90">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-gold" />
              <span>Loading interactive map...</span>
            </div>
          </div>
        )}

        {/* Route Details Overlay (when route is calculated) */}
        {routeInfo && (
          <div className="absolute bottom-4 left-4 right-4 z-20 mx-auto max-w-md rounded-2xl border border-gold/40 bg-background/95 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-gold">
                  <Car className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Driving Route to Campus
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {routeInfo.distanceKm} km
                    {routeInfo.durationMin !== "Flight / Distance view" &&
                      ` · ~${routeInfo.durationMin} mins`}
                  </p>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gold px-3.5 py-1.5 text-xs font-semibold text-gold-foreground shadow-sm hover:opacity-90"
              >
                Start Navigation
              </a>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {errorMsg && (
          <div className="absolute bottom-4 left-4 right-4 z-20 mx-auto max-w-md rounded-2xl border border-red-500/40 bg-background/95 p-3.5 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-foreground/90">{errorMsg}</p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-gold underline"
                >
                  <span>Open Directions in Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Helper Note */}
      <div className="bg-card/90 px-6 py-2.5 text-center text-xs text-muted-foreground border-t border-border/40">
        <span>
          Interactive map powered by OpenStreetMap. Click "Navigate to Campus" to view driving directions from your location.
        </span>
      </div>
    </div>
  );
}
