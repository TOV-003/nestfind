import { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function PropertyMap({ addresses = [] }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function getCoordinates() {
            if (!addresses || addresses.length === 0) {
                setLoading(false);
                setError(true);
                return;
            }

            setLoading(true);
            try {
                // Nominatim requires a descriptive User-Agent header
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addresses[0])}&format=json&limit=1`,
                    {
                        headers: {
                            'User-Agent': 'RealEstateApp/1.0 (contact@yourdomain.com)'
                        }
                    }
                );
                const data = await response.json();

                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    setPositions([{
                        address: addresses[0],
                        latitude: parseFloat(lat),
                        longitude: parseFloat(lon)
                    }]);
                    setError(false);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Geocoding failed:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        getCoordinates();
    }, [addresses]);

    useEffect(() => {
        if (positions.length === 0 || !mapContainerRef.current) return;

        if (!mapRef.current) {
            mapRef.current = new maplibregl.Map({
                container: mapContainerRef.current,
                style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
                center: [positions[0].longitude, positions[0].latitude],
                zoom: 15,
            });

            mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        positions.forEach((pos) => {
            const el = document.createElement('div');
            el.className = 'text-3xl';
            el.innerHTML = '📍';
            el.style.cursor = 'pointer';

            const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
                `<p style="margin:0;font-family:sans-serif;font-size:14px;color:#333;">${pos.address}</p>`
            );

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([pos.longitude, pos.latitude])
                .setPopup(popup)
                .addTo(mapRef.current);

            markersRef.current.push(marker);
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [positions]);

    if (loading) {
        return <div className="w-full h-full min-h-100 animate-pulse rounded bg-gray-200"></div>;
    }

    if (error || positions.length === 0) {
        return (
            <div className="flex h-full w-full min-h-100 items-center justify-center rounded bg-gray-100 text-gray-500 border border-gray-200">
                Location not found on map
            </div>
        );
    }

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-full min-h-100"
            style={{ borderRadius: '0.5rem' }}
        />
    );
}

export default PropertyMap;