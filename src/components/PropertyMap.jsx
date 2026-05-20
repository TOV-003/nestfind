import { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { supabase } from '../api/supabaseClient';
import 'maplibre-gl/dist/maplibre-gl.css';

function PropertyMap({ addresses = [] }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const prevAddressesRef = useRef('');

    useEffect(() => {
        const serializedAddresses = JSON.stringify(addresses);
        if (prevAddressesRef.current === serializedAddresses) {
            return;
        }
        prevAddressesRef.current = serializedAddresses;

        const geocodeAll = async () => {
            if (!addresses || addresses.length === 0) {
                setPositions([]);
                setLoading(false);
                setError(true);
                return;
            }

            try {
                setLoading(true);
                setError(false);

                const validPositions = [];
                const uniqueAddresses = [...new Set(addresses)];

                const { data: cachedGeo, error: supabaseError } = await supabase
                    .from('geocaching')
                    .select('address, latitude, longitude')
                    .in('address', uniqueAddresses);

                if (supabaseError) {
                    console.error(supabaseError);
                }

                const cachedMap = new Map(cachedGeo?.map(item => [item.address, item]) || []);
                const missingAddresses = uniqueAddresses.filter(addr => !cachedMap.has(addr));

                for (const item of cachedGeo || []) {
                    validPositions.push({
                        address: item.address,
                        latitude: item.latitude,
                        longitude: item.longitude
                    });
                }

                for (const address of missingAddresses) {
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&email=victortoba03@gmail.com`
                        );

                        if (response.status === 429) {
                            await new Promise((resolve) => setTimeout(resolve, 3000));
                            continue;
                        }

                        if (!response.ok) {
                            continue;
                        }

                        const data = await response.json();
                        if (data && data.length > 0) {
                            const lat = parseFloat(data[0].lat);
                            const lon = parseFloat(data[0].lon);

                            validPositions.push({
                                address,
                                latitude: lat,
                                longitude: lon,
                            });

                            await supabase
                                .from('geocaching')
                                .insert([{ address, latitude: lat, longitude: lon }]);
                        }
                    } catch (err) {
                        console.error(err);
                    }

                    await new Promise((resolve) => setTimeout(resolve, 1500));
                }

                if (validPositions.length > 0) {
                    setPositions(validPositions);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        geocodeAll();
    }, [addresses]);

    useEffect(() => {
        if (positions.length === 0 || !mapContainerRef.current) return;

        if (!mapRef.current) {
            mapRef.current = new maplibregl.Map({
                container: mapContainerRef.current,
                style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
                center: [positions[0].longitude, positions[0].latitude],
                zoom: 12,
            });

            mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        const bounds = new maplibregl.LngLatBounds();

        positions.forEach((pos) => {
            const el = document.createElement('div');
            el.className = 'text-3xl';
            el.innerHTML = '📍';
            el.style.cursor = 'pointer';

            const popup = new maplibregl.Popup({
                offset: 25,
                focusAfterOpen: false,
            }).setHTML(`<p style="margin:0;font-family:sans-serif;font-size:14px;color:#333;">${pos.address}</p>`);

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([pos.longitude, pos.latitude])
                .setPopup(popup)
                .addTo(mapRef.current);

            markersRef.current.push(marker);
            bounds.extend([pos.longitude, pos.latitude]);
        });

        if (positions.length === 1) {
            mapRef.current.flyTo({
                center: [positions[0].longitude, positions[0].latitude],
                zoom: 15,
            });
        } else {
            mapRef.current.fitBounds(bounds, {
                padding: 50,
                maxZoom: 15,
            });
        }

        return () => {
            if (!addresses || addresses.length === 0) {
                markersRef.current.forEach((marker) => marker.remove());
                markersRef.current = [];
                if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null;
                }
            }
        };
    }, [positions, addresses]);

    if (loading) {
        return <div className="w-full h-full min-h-100 animate-pulse rounded bg-gray-200"></div>;
    }

    if (error || positions.length === 0) {
        return (
            <div className="flex h-full w-full min-h-100 items-center justify-center rounded bg-gray-100 text-gray-500 border border-gray-200">
                No addresses found
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