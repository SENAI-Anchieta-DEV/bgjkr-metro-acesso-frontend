import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CENTER, DEFAULT_ZOOM, MOCK_STATIONS, getLinePaths } from './mapUtils';
import { StationDetailPanel } from './StationDetailPanel';

// Componente para focar o mapa quando uma estação é selecionada
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  if (center) {
    map.setView(center, zoom, { animate: true });
  }
  return null;
};

export const MetroMap = () => {
  const [stations, setStations] = useState(MOCK_STATIONS);
  const [selectedStation, setSelectedStation] = useState(null);
  const [linePaths] = useState(getLinePaths());

  // Simulação de atualização em tempo real (WebSockets futura)
  useEffect(() => {
    const interval = setInterval(() => {
      // Pequena lógica para variar os PCDs e testar a animação
      setStations(prev => prev.map(s => ({
        ...s,
        pcds: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : s.pcds
      })));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="metro-map-wrapper">
      <div className={`map-container-inner ${selectedStation ? 'with-panel' : ''}`}>
        <MapContainer 
          center={MAP_CENTER} 
          zoom={DEFAULT_ZOOM} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
        >
          <ChangeView 
            center={selectedStation ? [selectedStation.lat, selectedStation.lng] : null} 
            zoom={15} 
          />
          
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Linhas do Metrô */}
          {linePaths.map(line => (
            <Polyline 
              key={line.id} 
              positions={line.coords} 
              pathOptions={{ color: line.cor, weight: 6, opacity: 0.7 }} 
            />
          ))}

          {/* Marcadores das Estações */}
          {stations.map(station => (
            <CircleMarker
              key={station.id}
              center={[station.lat, station.lng]}
              pathOptions={{
                fillColor: station.pcds > 0 ? '#ff0000' : station.cor,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
              }}
              radius={station.pcds > 0 ? 12 : 8}
              className={station.pcds > 0 ? 'pulse-marker' : ''}
              eventHandlers={{
                click: () => setSelectedStation(station)
              }}
            />
          ))}
        </MapContainer>
      </div>

      {selectedStation && (
        <StationDetailPanel 
          station={selectedStation} 
          onClose={() => setSelectedStation(null)} 
        />
      )}
    </div>
  );
};