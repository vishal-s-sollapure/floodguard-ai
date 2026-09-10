import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import RiskBadge from './RiskBadge';

const neighborhoodData = [
  {
    name: 'Koramangala',
    lat: 12.9352,
    lng: 77.6245,
    risk: 'HIGH',
    rainfall: '58.5 mm',
    waterLevel: '3.1 m',
    color: '#f97316'
  },
  {
    name: 'Whitefield',
    lat: 12.9698,
    lng: 77.7499,
    risk: 'MODERATE',
    rainfall: '32.0 mm',
    waterLevel: '1.8 m',
    color: '#f59e0b'
  },
  {
    name: 'Indiranagar',
    lat: 12.9784,
    lng: 77.6408,
    risk: 'LOW',
    rainfall: '12.2 mm',
    waterLevel: '0.6 m',
    color: '#10b981'
  },
  {
    name: 'HSR Layout',
    lat: 12.9121,
    lng: 77.6446,
    risk: 'CRITICAL',
    rainfall: '84.0 mm',
    waterLevel: '4.5 m',
    color: '#ef4444'
  },
  {
    name: 'Jayanagar',
    lat: 12.9308,
    lng: 77.5838,
    risk: 'LOW',
    rainfall: '10.0 mm',
    waterLevel: '0.4 m',
    color: '#10b981'
  }
];

const MapView = () => {
  const bengaluruCenter = [12.9716, 77.5946];

  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl relative">
      <MapContainer
        center={bengaluruCenter}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {neighborhoodData.map((item, idx) => (
          <CircleMarker
            key={idx}
            center={[item.lat, item.lng]}
            radius={item.risk === 'CRITICAL' ? 24 : item.risk === 'HIGH' ? 20 : 16}
            pathOptions={{
              fillColor: item.color,
              fillOpacity: 0.6,
              color: item.color,
              weight: 2
            }}
          >
            <Popup>
              <div className="p-1 space-y-2">
                <div className="flex items-center justify-between gap-4 border-b border-slate-700 pb-1.5">
                  <h4 className="font-bold text-base text-white">{item.name}</h4>
                  <RiskBadge risk_level={item.risk} size="small" />
                </div>
                <div className="text-xs space-y-1 text-slate-300">
                  <div className="flex justify-between gap-6">
                    <span>Rainfall Intensity:</span>
                    <span className="font-bold text-blue-400">{item.rainfall}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span>Water Level:</span>
                    <span className="font-bold text-cyan-400">{item.waterLevel}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-[400] bg-[#111827]/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs shadow-xl space-y-1.5">
        <div className="font-bold text-slate-300 mb-1 border-b border-slate-700/60 pb-1">Risk Map Legend</div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span> Critical Risk Zone
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span> High Risk Zone
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span> Moderate Warning
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Safe / Low Risk
        </div>
      </div>
    </div>
  );
};

export default MapView;
