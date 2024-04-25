import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import '../../scss/components/_PedidosModal.scss';
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import 'leaflet-draw';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';
import { useAppSelector } from '../../Redux/Store/hooks';
import Zona from '../../Models/Zona';
import ZonaLocal from '../../Models/ZonaLocal';
import buscar from '../../assets/images/buscar.png'
import iconmarker from '../../assets/images/pin.png'
import Swal from 'sweetalert2';

interface CustomLayer extends L.Layer {
    _layer_id?: any;
  }
interface PedidoModalProps {
  onClose: () => void;
}

const PedidoModal: React.FC<PedidoModalProps> = ({ onClose }) => {
  const [direccion, setDireccion] = useState('');
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const zonas: Zona[] = useAppSelector((state: any) => state.zonas.zonas);
  const [zonesLayers, setZonesLayers] = useState<ZonaLocal[]>([]);
//Traer las zonas y pasarlas al formato indicado para mostrarlas en el mapa
console.log(zonas);

useEffect(() => {
    if (zonas.length) {
      const zoneLayer = zonas.map(zone => {
        const layer = L.geoJSON(zone.layer).getLayers()[0] as CustomLayer;
        const properties = zone.layer.properties;
        const nombre = zone.nombre;
        const id = zone.id;
        return { layer, properties, nombre, id };
      });
      console.log("zonelayer post deshabilitar editable", zoneLayer);
      setZonesLayers(zoneLayer)
    }
  }, []);
  ////////////////////////////////////////

console.log("latitud y longitud", latitud, longitud);


  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDireccion(e.target.value);
  };

  const handleBuscarClick = async () => {
    try {
        const apiKey = import.meta.env.VITE_API_KEY_MAPS;
        const direccionEncoded = encodeURIComponent(direccion);
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${direccionEncoded}&key=${apiKey}`);
        const data = await response.json();
        console.log(response);
        
        if (data.status === "ZERO_RESULTS") {
            Swal.fire({
                title: "Dirección no encontrada",
                text: "No se encontraron resultados para la dirección ingresada.",
                icon: "warning",
            });
        } else if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            setLatitud(lat);
            setLongitud(lng);
        } else {
            console.error('No se encontraron resultados para la dirección ingresada.');
        }
    } catch (error) {
        console.error('Error al obtener las coordenadas:', error);
    }
    setDireccion('');
    setDireccion('')
    // setLatitud(-31.417);
    // setLongitud(-64.495);
  };

  const handleGuardarClick = () => {
    // Aquí puedes agregar lógica para guardar el pedido
    // y asignarlo a un grupo según la latitud y longitud
    onClose();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onClose();
  };
  const SetViewOnClick: React.FC<{ coords: LatLngExpression }> = ({ coords }) => {
    const map = useMap();
    map.setView(coords, map.getZoom());
  
    return null;
  };

  const carlosPazCoords: LatLngExpression = [-31.4241, -64.4978];
//   icono
  const customIcon = L.icon({
    iconUrl: iconmarker,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });




  return (
    <div className={`modal ${showModal ? 'show-modal' : 'closed'}`}>
      <div className="modal-content">
        <span className="close" onClick={handleCloseModal}>&times;</span>
        <h2>Nuevo Pedido</h2>
        <MapContainer className='mapa' center={[latitud, longitud]} zoom={13} style={{ height: '400px', borderRadius:'10px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* Aquí puedes agregar los polígonos de las zonas */}
          {zonesLayers?.length && zonesLayers.map((zone, index) => {
             
                  return (
                    <div key={zone.id}>
                      <Polygon
                        attribution={zone.id.toString()}
                        key={index}
                        positions={zone.layer.getLatLngs()}
                        color={zone.properties.color}
                        fillOpacity={0.2}
                        fillColor='black'
                      />
                      
                    </div>
                  )
                })}
                <Marker icon={customIcon} position={[latitud, longitud]}>
            <Popup>Dirección: {direccion}</Popup>
          </Marker>
          <SetViewOnClick coords={carlosPazCoords} />
        </MapContainer>
        <div className="form-container">
            <div className='input_search'>
<div className="search-icon">
<input type="text" value={direccion} onChange={handleDireccionChange} placeholder="Dirección"></input>
  
    <img onClick={handleBuscarClick} src={buscar} alt="Buscar" />
    </div>
            </div>
  
            <button 
  disabled={latitud == 0} 
  type="button" 
  onClick={handleGuardarClick} 
  className={`btnGuardar ${latitud == 0 ? 'inactivo' : ''}`}
>
  Guardar
</button>
</div>
      </div>
    </div>
  );
};

export default PedidoModal;