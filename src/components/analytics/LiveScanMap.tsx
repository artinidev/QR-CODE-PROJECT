'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon } from 'leaflet';

// Fix for default marker icon in Next.js/Leaflet
const defaultIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Western Sahara GeoJSON Data (Simplified Polygon)
const westernSaharaBorder = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": { "name": "Western Sahara" },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-8.67, 27.67], [-8.67, 26.00], [-12.00, 26.00],
                    [-12.00, 21.33], [-13.00, 21.33], [-16.85, 21.33],
                    [-17.06, 20.77], [-17.10, 20.80], [-17.00, 21.00],
                    [-16.00, 23.00], [-15.00, 25.00], [-13.17, 27.67],
                    [-8.67, 27.67]
                ]]
            }
        }
    ]
};

interface LocationData {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    count: number;
}

interface LiveScanMapProps {
    data: LocationData[];
}

export default function LiveScanMap({ data }: LiveScanMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [geoJsonData, setGeoJsonData] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
        setGeoJsonData(westernSaharaBorder);
    }, []);

    if (!isMounted) {
        return <div className="w-full h-[400px] bg-slate-100 dark:bg-zinc-900 rounded-xl animate-pulse" />;
    }

    // Custom text label icon
    const labelIcon = divIcon({
        className: 'map-label',
        html: '<div style="font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; width: 100px; transform: translate(-50%, -50%); opacity: 0.7;">Western Sahara</div>',
        iconSize: [100, 20]
    });

    return (
        <div className="w-full h-[400px] relative rounded-xl overflow-hidden z-0">
            <MapContainer
                center={[25, -10]}
                zoom={4}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
                minZoom={2}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {geoJsonData && (
                    <GeoJSON
                        data={geoJsonData}
                        style={{
                            color: "#94a3b8",
                            weight: 1,
                            fillColor: "#e2e8f0",
                            fillOpacity: 0.1,
                            dashArray: '5, 5'
                        }}
                    />
                )}

                {/* Western Sahara Label (Centered approximately) */}
                <Marker
                    position={[24.5, -13.0]}
                    icon={labelIcon}
                    interactive={false}
                />

                {data.map((loc, index) => (
                    <CircleMarker
                        key={index}
                        center={[loc.latitude, loc.longitude]}
                        pathOptions={{
                            fillColor: "#3B82F6",
                            fillOpacity: 0.6,
                            color: "#fff",
                            weight: 2,
                        }}
                        radius={Math.min(20, Math.max(5, loc.count * 2))}
                    >
                        <Popup>
                            <div className="text-slate-900 text-sm font-medium">
                                <strong className="block text-base mb-1">{loc.city}, {loc.country}</strong>
                                <span className="text-blue-600 font-bold">{loc.count} Scans</span>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            <style jsx global>{`
                .leaflet-container {
                    background: #f8fafc;
                }
                .dark .leaflet-container {
                     background: #18181b;
                }
                .leaflet-div-icon {
                    background: transparent;
                    border: none;
                }
            `}</style>
        </div>
    );
}
