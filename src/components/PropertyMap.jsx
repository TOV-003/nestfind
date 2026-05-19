import { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function PropertyMap({ address }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const [position, setPosition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const geocode = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
                );

                const data = await response.json();

                if (data && data.length > 0) {
                    setPosition({
                        latitude: parseFloat(data[0].lat),
                        longitude: parseFloat(data[0].lon),
                    });
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Geocoding error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (address) {
            geocode();
        } else {
            function noop() {
                setLoading(false);
                setError(true);
            }

            noop()
        }
    }, [address]);
    useEffect(() => {
        if (!position || !mapContainerRef.current) return;

        if (!mapRef.current) {
            mapRef.current = new maplibregl.Map({
                container: mapContainerRef.current,
                style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
                center: [position.longitude, position.latitude],
                zoom: 15,
            });

            mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        } else {
            mapRef.current.flyTo({
                center: [position.longitude, position.latitude],
                zoom: 15
            });
        }

        if (markerRef.current) {
            markerRef.current.setLngLat([position.longitude, position.latitude]);
        } else {
            const el = document.createElement('div');
            el.className = 'text-3xl';
            el.innerHTML = '📍';
            el.style.cursor = 'pointer';
            const popup = new maplibregl.Popup({
                offset: 25,
                focusAfterOpen: false
            })
                .setHTML(`<p style="margin:0;font-family:sans-serif;font-size:14px;">${address}</p>`);
            markerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([position.longitude, position.latitude])
                .setPopup(popup)
                .addTo(mapRef.current);
            markerRef.current.togglePopup();
        }
        return () => {
            if (!address) {
                if (markerRef.current) {
                    markerRef.current.remove();
                    markerRef.current = null;
                }
                if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null;
                }
            }
        };
    }, [position, address]);

    if (loading) {
        return (
            <div className="w-full h-full min-h-100 animate-pulse rounded bg-gray-200"></div>
        );
    }

    if (error || !position) {
        return (
            <div className="flex h-full w-full min-h-100 items-center justify-center rounded bg-gray-100 text-gray-500 border border-gray-200">
                Address not found
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