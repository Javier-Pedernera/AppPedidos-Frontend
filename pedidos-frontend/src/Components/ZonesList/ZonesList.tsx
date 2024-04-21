import '../../scss/components/_ZonasLista.scss'; // Importa el archivo Sass
import Zona from '../../Models/Zona';


interface ZonesListProps {
  zones: Zona[];
}

const ZonesList: React.FC<ZonesListProps> = ({ zones }) => {
    // console.log(zones);
    
  return (
    <div className="zones-list">
      <h4>Zonas Creadas:</h4>
      <ul className="zone-list">
        {zones.map((zone, index) => (
          <li key={index} className="zone-item">
            <div className="zone-number">{`${index + 1}: `}</div>
            <div className="zone-details">
              <div className="zone-title">{zone.nombre}</div>
              <div className="zone-color"  style={{ backgroundColor: zone.layer.properties.color }}></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ZonesList;
