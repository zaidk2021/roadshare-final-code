import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const geocodeLocation = async (locationName) => {
    const geoapifyApiKey = '1636de9510f44457802f46fd1284a428';
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationName)}&apiKey=${geoapifyApiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding failed');
    const data = await response.json();
    if (data.features.length === 0) throw new Error('Location not found');
    return data.features[0].geometry.coordinates;
};

// Define your custom icon
const customIcon = new L.Icon({
  iconUrl: '/images/marker-icon-blue.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41] // Size of the shadow
});

const MapTilerDisplay = ({ from, to }) => {
  useEffect(() => {
    const map = L.map('map', {
      center: [20.5937, 78.9629], // Default to India's coordinates; will be updated.
      zoom: 5,
    });
    
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=oELt362boAVL37TwNG4W', {
      attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors',
    }).addTo(map);

    const updateMap = async () => {
      try {
        const [fromLon, fromLat] = await geocodeLocation(from);
        const [toLon, toLat] = await geocodeLocation(to);

        // Use the custom icon for markers
        L.marker([fromLat, fromLon], { icon: customIcon }).addTo(map).bindPopup(from);
        L.marker([toLat, toLon], { icon: customIcon }).addTo(map).bindPopup(to);

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
