import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import '../../scss/components/_PedidosModal.scss';
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import 'leaflet-draw';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import Zona from '../../Models/Zona';
import ZonaLocal from '../../Models/ZonaLocal';
import buscar from '../../assets/images/buscar.png'
import iconmarker from '../../assets/images/pin.png'
import Swal from 'sweetalert2';
import añadir from '../../assets/images/anadir-a-la-cesta.png'
import loaderGeo from '../../assets/gif/loader_tierra.gif'
import encontrarZonasParaPunto from '../../utils/ubicacionPunto';
import buscarGruposConZonasAsignadas from '../../utils/BuscarGruposZona';
import { ParamsModel } from '../../Models/Params';

import { Grupo } from '../../Models/Grupo';
import { crearGrupo, editarGrupoById, obtenerGrupos } from '../../Redux/Actions/GruposActions';
import { GrupoGet } from '../../Models/GrupoGet';

import { crearPedido } from '../../Redux/Actions/PedidosActions';
import { formatDatabaseDateTime, formatLocalDateTime } from '../../utils/FormatearFechaHora';
interface CustomLayer extends L.Layer {
    _layer_id?: any;
}
interface PedidoModalProps {
    onClose: () => void;
}

const PedidoModal: React.FC<PedidoModalProps> = ({ onClose }) => {

    const dispatch = useAppDispatch()
    const zonas: Zona[] = useAppSelector((state: any) => state.zonas.zonas);
    const parametros: ParamsModel[] = useAppSelector((state: any) => state.params.allParams);
    const grupos: GrupoGet[] = useAppSelector((state: any) => state.grupos.grupos);
// console.log("grupos", grupos);
// console.log("parametros", parametros);
    const [inputs, setInputs] = useState({
        direccion: '',
        nombre: '',
        pedido:'',
        telefono: ''
      });
      const [loading, setloading] = useState(false);
    const [direccionPop, setdireccionPop] = useState('');
    const [latitud, setLatitud] = useState(0);
    const [longitud, setLongitud] = useState(0);
    const [showModal, setShowModal] = useState(true);
    const [grupoAsignado, setGrupoAsignado] = useState(0);
    const [posiblesGrupos, setPosiblesGrupos] = useState<GrupoGet[]>([]);
    const [zonesLayers, setZonesLayers] = useState<ZonaLocal[]>([]);
    const [posiblesZonasPedido, setposiblesZonasPedido] = useState<ZonaLocal[]>([]);
    const [camposVacios, setCamposVacios] = useState(true);
    console.log("posibles zonas para ese pedido ", posiblesZonasPedido);
    // console.log(zonas);
    
    useEffect(() => {
        if (zonas.length) {
            const zoneLayer = zonas.map(zone => {
                const layer = L.geoJSON(zone.layer).getLayers()[0] as CustomLayer;
                const properties = zone.layer.properties;
                const nombre = zone.nombre;
                const id = zone.id;
                return { layer, properties, nombre, id };
            });
            
            setZonesLayers(zoneLayer)
        }
    }, []);
    ////////////////////////////////////////

 

    const handleInputChange = (event:any) => {
        const { name, value } = event.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));

        const { nombre, pedido, telefono } = inputs;
        const algunCampoVacio = nombre.trim() === '' || pedido.trim() === '' || telefono.trim() === '';
        setCamposVacios(algunCampoVacio);
      };
console.log("hay camposVacios?",camposVacios);

    const handleBuscarClick = async () => {
        try {
            setloading(true)
            const gruposAbiertos = grupos.filter(grupo => grupo.estado.id === 1);
            const apiKey = import.meta.env.VITE_API_KEY_MAPS;
            const direccionEncoded = encodeURIComponent(`${inputs.direccion}, Carlos Paz`);
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${direccionEncoded}&key=${apiKey}`);
            const data = await response.json();
            if (data.status === "ZERO_RESULTS") {
                Swal.fire({
                    title: "Dirección no encontrada",
                    text: "No se encontraron resultados para la dirección ingresada.",
                    icon: "warning",
                });
            } else if (data.results && data.results.length > 0) {
                setloading(false)
                const { lat, lng } = data.results[0].geometry.location;
                setLatitud(lat);
                setLongitud(lng);
                const point = { lat, lng }

                const zonasParaPedido = await encontrarZonasParaPunto(point, zonesLayers)

                if (zonasParaPedido.length) {
                    setposiblesZonasPedido(zonasParaPedido)
                     const GruposPos =  buscarGruposConZonasAsignadas(zonasParaPedido, gruposAbiertos )// revisar esta funcion
                    //  console.log("Grupos posibles",GruposPos);
                     
                     if(!GruposPos.length){
                        // const fechaHoraActual = new Date();
                        // const fechaHoraFormateada = formatearFechaHora(fechaHoraActual)
                        // const fechaHoraFormateada = fechaHoraActual.toISOString().slice(0, 19).replace('T', ' ');
                        // const fechaHoraUTC: Date = new Date()
                        
                        // console.log("fechaHoraUTC",fechaHoraUTC);
                        
                        // const fechaReConvertida =  new Date(fechaHoraUTC).toLocaleString(undefined, { timeZone: 'America/Buenos_Aires'});

                        // console.log("fechareConvertida",fechaReConvertida);
                       //////////
                        const fechaConFuncion =formatDatabaseDateTime()
                        console.log("fechaConFuncion",fechaConFuncion);
                        // const fechaReconvertidaConFuncion = formatLocalDateTime(fechaConFuncion)
                        // console.log("fechaReconvertidaConFuncion",fechaReconvertidaConFuncion);

                        const nuevoGrupo: Grupo = { id_zona: zonasParaPedido[0].id, fecha_hora_creacion: fechaConFuncion, id_estado: 1, id_cadete: null}
                        const resp = await dispatch(crearGrupo(nuevoGrupo)) as GrupoGet;
                        console.log(resp);
                        setPosiblesGrupos([resp])
                        setGrupoAsignado(resp.id)
                        dispatch(obtenerGrupos())
                     }else{
                        let grupoConMasPedidos = GruposPos[0];
                        for (let i = 1; i < GruposPos.length; i++) {
                        if (GruposPos[i].pedidos.length > grupoConMasPedidos.pedidos.length) {
                            grupoConMasPedidos = GruposPos[i];
                        }
                        }
                        // console.log("grupoConMasPedidos", grupoConMasPedidos);
                        setPosiblesGrupos(GruposPos)
                        setGrupoAsignado(grupoConMasPedidos.id)          
                        console.log("asignar grupo segun pedidos");                      
                     }
                }
            } else {
                console.error('No se encontraron resultados para la dirección ingresada.');
            }
        } catch (error) {
            console.error('Error al obtener las coordenadas:', error);
        }
        setdireccionPop(inputs.direccion)
        setInputs(inputs => ({ ...inputs, direccion: '' }));
        
    };

    const handleGuardar = () => {
        const pedidoNuevo ={
                            id_grupo: grupoAsignado,
                            direccion: direccionPop,
                            latitud: latitud,
                            longitud: longitud,
                            id_estado: 1,
                            cliente : inputs.nombre,
                            pedido: inputs.pedido,
                            telefono : inputs.telefono
                        }
            const GrupoCompleto = grupos.find(grupo => grupo.id == grupoAsignado);
            console.log("GrupoCompleto" ,GrupoCompleto);
            
           if(GrupoCompleto && GrupoCompleto?.pedidos.length == parseInt(parametros[0].valor )- 1 ){
                        dispatch(crearPedido(pedidoNuevo))
                        dispatch(editarGrupoById(grupoAsignado, {id_estado: 2}))
                        dispatch(obtenerGrupos())
                            onClose();
                        }else{
                           dispatch(crearPedido(pedidoNuevo))
                           dispatch(obtenerGrupos())
                            onClose();
                        }
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
    // let polig 26 = [[-31.408301, -64.495232], [-31.398043, -64.510686],[-31.406541, -64.53215],[-31.416172, -64.533091],[-31.422026, -64.526052],[-31.428372, -64.505364]]
    const handleCheckboxChange = (event:any) => {
        setGrupoAsignado(event.target.value);
      };

    const carlosPazCoords: LatLngExpression = [-31.4241, -64.4978];
    console.log("grupo asignado", grupoAsignado);
    

    //   icono
    const customIcon = L.icon({
        iconUrl: iconmarker,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });


// console.log("inputs",inputs);

// console.log("grupos del global",grupos);
    return (
        <div className={`modal ${showModal ? 'show-modal' : 'closed'}`}>
            
            <div className="modal-content">
                {loading ?
                    <div className='divLoaderGeo'>
                        <img src={loaderGeo} className='loaderGeo' alt="Loading..." />
                    </div> : ""
                }
                <span className="close" onClick={handleCloseModal}>&times;</span>
                <h2>Nuevo Pedido</h2>
                <MapContainer className='mapa' center={[latitud, longitud]} zoom={13} style={{ height: '400px', borderRadius: '10px' }}>
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
                        <Popup>Dirección: {direccionPop}</Popup>
                    </Marker>
                    <SetViewOnClick coords={latitud? [latitud, longitud] : carlosPazCoords} />
                </MapContainer>
                <div className="form-container">
                    <div className='input_search'>
                        <div className="search-icon">
                            <input
                                type="text"
                                name="direccion"
                                value={inputs.direccion}
                                onChange={handleInputChange}
                                placeholder="Dirección"
                            />
                            <img onClick={handleBuscarClick} src={buscar} alt="Buscar" />

                        </div>
                        <div className={`direccpop ${direccionPop ? 'acivePop' : ""}`} >Direccion de envío:
                            <div className='direccpop2'>{direccionPop}</div>
                        </div>
                    </div>
      <div className='nameDirecc'>
        <input
          type="text"
          name="nombre"
          value={inputs.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
          className='NameInput'
        />
        <input
          type="text"
          name="telefono"
          value={inputs.telefono}
          onChange={handleInputChange}
          placeholder="Teléfono"
          className='TelInput'
        />
       
      </div>

                    <div className='divbtnAsign'>
                        <textarea
                            name="pedido"
                            value={inputs.pedido}
                            onChange={handleInputChange}
                            placeholder="Pedido"
                            className='textpedido'
                        />

                        <div className='GruposPos'>
                            {posiblesGrupos.map((grupo) => (
                            <label key={grupo.id}>
                                <div className='checkBoxDiv'>
                                   <input
                                className='checkB'
                                 type="checkbox"
                                 value={grupo.id}
                                 checked={grupoAsignado == grupo.id}
                                 onChange={handleCheckboxChange}
                                /> 
                                </div>
                                <div className='descriptGrupo'>
                                    <p>Id: {grupo.id}</p>
                                    <p>Creado: {formatLocalDateTime(grupo.fecha_hora_creacion)}</p>
                                    <p>Pedidos: {grupo.pedidos?  grupo.pedidos.length: 0 } </p>
                                </div>
                            </label>
                            ))}
                        </div>
                        <button
                            disabled={latitud == 0}
                            type="button"
                            onClick={handleGuardar}
                            className={`btnAsingnar ${latitud == 0 || camposVacios ? 'inactivo' : ''}`}
                        >
                            Agregar pedido
                            <img className='imagenAñadir' src={añadir} alt="Icono" />
                        </button>

                    </div>
                    {/* <button
                        disabled={grupoAsignado == null}
                        type="button"
                        onClick={handleGuardar}
                        className={`btnGuardar ${grupoAsignado == 0 ? 'inactivo' : ''}`}
                    >
                        Guardar
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default PedidoModal;