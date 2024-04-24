import React, { useEffect, useState } from 'react';
import '../../scss/components/_ZonasLista.scss';
import Zona from '../../Models/Zona';

interface ZonesListProps {
  zones: Zona[];
  zoneEdi: string
  setEditingZone: any; 
}

const ZonesList: React.FC<ZonesListProps> = ({ zones, zoneEdi, setEditingZone }) => {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  useEffect(() => {
    setSelectedZone(parseInt(zoneEdi))
  }, [zoneEdi]);

  const handleZoneClick = (zoneId: number) => {
    const zoneIdStr = zoneId.toString()
    setSelectedZone(zoneId);
    setEditingZone(zoneIdStr);
  };

  return (
    <div className="zones-list">
      <h4>Zonas Creadas:</h4>
      <ul className="zone-list">
        {zones.map((zone, index) => (
          <li key={index} className={`zone-item ${selectedZone === zone.id ? 'selected' : ''}`} onClick={() => handleZoneClick(zone.id)}>
            <div className="zone-details">
              <div className="zone-color" style={{ backgroundColor: zone.layer.properties.color, color:"white" }}>{zone.id}</div>
              <div className="zone-title">{zone.nombre}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ZonesList;
