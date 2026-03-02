import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// ensure default marker icons resolve correctly
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const LeafletMap = ({ center = [13.0827, 80.2707], zoom = 13, marker = true, height = 250, onClick, id }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const containerIdRef = useRef(id || `leaflet-map-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    const containerId = containerIdRef.current;
    if (!mapRef.current) {
      mapRef.current = L.map(containerId, { center, zoom, scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      if (marker) {
        markerRef.current = L.marker(center).addTo(mapRef.current);
      }

      if (onClick) {
        mapRef.current.on('click', function (e) {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
          }
          onClick([lat, lng]);
        });
      }
    } else {
      mapRef.current.setView(center, zoom);
      if (markerRef.current) markerRef.current.setLatLng(center);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, mapRef.current.getZoom() || zoom);
      if (markerRef.current) markerRef.current.setLatLng(center);
    }
  }, [center, zoom]);

  return <div id={containerIdRef.current} style={{ height: `${height}px`, width: '100%' }} />;
};

export default LeafletMap;
