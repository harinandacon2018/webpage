import React, { useEffect, useRef } from "react";

// StreetViewPreview is intentionally "loader-agnostic":
// pass `isLoaded` and `loadError` from the parent that calls useJsApiLoader
const StreetViewPreview = ({ lat, lng, height = "150px", isLoaded, loadError }) => {
  const containerRef = useRef(null);
  const panoRef = useRef(null);

  useEffect(() => {
    if (!isLoaded || loadError || !containerRef.current) return;

    // Prevent double initialization (idempotent)
    const node = containerRef.current;
    if (node.dataset.svpInitialized) return;

    if (!window.google || !window.google.maps || !window.google.maps.StreetViewPanorama) return;

    panoRef.current = new window.google.maps.StreetViewPanorama(node, {
      position: { lat, lng },
      pov: { heading: 34, pitch: 10 },
      visible: true,
      disableDefaultUI: true,
    });

    node.dataset.svpInitialized = "1";

    return () => {
      // cleanup DOM and instance
      if (panoRef.current && panoRef.current.setVisible) {
        try { panoRef.current.setVisible(false); } catch (e) { /* ignore */ }
      }
      panoRef.current = null;
      if (node) {
        node.removeAttribute("data-svp-initialized");
        node.innerHTML = "";
      }
    };
  }, [isLoaded, loadError, lat, lng]);

  if (!isLoaded) return <div className="map-placeholder">Loading Street View…</div>;
  if (loadError) return <div className="map-placeholder">Street View failed to load</div>;

  return <div ref={containerRef} className="streetview-preview" style={{ height }} />;
};

export default StreetViewPreview;
