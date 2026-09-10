import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Marker } from 'react-leaflet';
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

const sheltersData = [
  { name: "Koramangala Indoor Stadium Shelter", lat: 12.9360, lng: 77.6200, capacity: "500 beds", status: "SAFE / OPEN" },
  { name: "Indiranagar Civic Community Relief Center", lat: 12.9719, lng: 77.6412, capacity: "450 beds", status: "SAFE / OPEN" },
  { name: "Silk Board Emergency Relief Center", lat: 12.9175, lng: 77.6238, capacity: "350 beds", status: "NEAR CAPACITY" },
  { name: "HSR Layout Sector 3 Disaster Relief Camp", lat: 12.9100, lng: 77.6450, capacity: "600 beds", status: "SAFE / OPEN" }
];

const MapView = ({ activeRoute }) => {
  const bengaluruCenter = [12.9716, 77.5946];
  const [showShelters, setShowShelters] = React.useState(true);

  const routePolyline = activeRoute?.route_waypoints
    ? activeRoute.route_waypoints.map(wp => [wp.lat, wp.lng])
    : [
        [12.9352, 77.6245],
        [12.9355, 77.6230],
        [12.9360, 77.6200]
      ];

  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl relative">
      {/* Shelter Toggle Overlay */}
      <div className="absolute top-4 right-4 z-[400] bg-[#111827]/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-xs shadow-xl flex items-center gap-2">
        <button
          onClick={() => setShowShelters(!showShelters)}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            showShelters ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          🏥 {showShelters ? 'Shelters Active' : 'Show Emergency Shelters'}
        </button>
      </div>

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

        {/* Evacuation Route Polyline */}
        <Polyline
          positions={routePolyline}
          pathOptions={{
            color: '#10b981',
            weight: 5,
            opacity: 0.95,
            dashArray: '1, 2'
          }}
        />

        {/* Neighborhood Risk Markers */}
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

        {/* Emergency Shelter Markers */}
        {showShelters && sheltersData.map((shelter, sIdx) => (
          <CircleMarker
            key={`shelter-${sIdx}`}
            center={[shelter.lat, shelter.lng]}
            radius={10}
            pathOptions={{
              fillColor: '#10b981',
              fillOpacity: 0.9,
              color: '#ffffff',
              weight: 2
            }}
          >
            <Popup>
              <div className="p-1 space-y-1 text-xs text-slate-200">
                <div className="font-extrabold text-emerald-400 border-b border-slate-700 pb-1 flex items-center gap-1">
                  🏥 Emergency Evacuation Shelter
                </div>
                <p className="font-bold text-white text-sm">{shelter.name}</p>
                <p className="text-slate-400">Capacity: <strong className="text-white">{shelter.capacity}</strong></p>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px]">
                  {shelter.status}
                </span>
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
          <span className="w-3 h-3 rounded-full bg-[#10b981]"></span> Safe Evacuation Route
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-semibold border-t border-slate-700/60 pt-1">
          <span className="w-3 h-3 rounded-full bg-emerald-400 border border-white"></span> Emergency Shelter
        </div>
      </div>
    </div>
  );
};

export default MapView;
