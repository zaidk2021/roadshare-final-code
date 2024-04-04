// components/MapTilerDisplay.jsx
import { useEffect} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const geocodeLocation = async (locationName) => {
    const geoapifyApiKey = '40f4e9c2b7c244b1a952de52ae481ec1';

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationName)}&apiKey=${geoapifyApiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Geocoding failed');
  const data = await response.json();
  if (data.features.length === 0) throw new Error('Location not found');
  return data.features[0].geometry.coordinates;
};

const MapTilerDisplay = ({ from, to }) => {
  useEffect(() => {
    const map = L.map('map', {
      center: [20.5937, 78.9629], // Default to India's coordinates; will be updated.
      zoom: 5,
    });
    
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=V8izIOAgRgaHX6bmmpbi', {
      attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors',
    }).addTo(map);

    const updateMap = async () => {
      try {
        const [fromLon, fromLat] = await geocodeLocation(from);
        const [toLon, toLat] = await geocodeLocation(to);

        L.marker([fromLat, fromLon]).addTo(map).bindPopup(from);
        L.marker([toLat, toLon]).addTo(map).bindPopup(to);

        // Optionally draw a line between the points
        const latlngs = [
          [fromLat, fromLon],
          [toLat, toLon]
        ];
        L.polyline(latlngs, {color: 'red'}).addTo(map);

        // Adjust map to show both points
        map.fitBounds(latlngs);
      } catch (error) {
        console.error(error);
      }
    };

    updateMap();

    return () => map.remove();
  }, [from, to]);

  return <div id="map" style={{ height: '400px' }}></div>;
};

export default MapTilerDisplay;