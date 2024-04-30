import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Polygon, Marker } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import { LatLngExpression } from 'leaflet';
import '../../scss/components/_Mapasconfig.scss'
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import CustomButton2 from '../../Components/Button2/CustomButton2';
import ZonesList from '../../Components/ZonesList/ZonesList';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { editarZonaById, eliminarZonaById, obtenerZonas } from '../../Redux/Actions/ZonasActions';
import Zona from '../../Models/Zona';
import 'leaflet-draw';
import L from 'leaflet';
import ZonaLocal from '../../Models/ZonaLocal';

interface CustomLayer extends L.Layer {
  _layer_id?: any;
}

const MapasConfig = () => {


  const zonas: Zona[] = useAppSelector((state: any) => state.zonas.zonas);
  // console.log("zonas", zonas);

  const [zones, setZones] = useState<any[]>([]);
  const [editarMapa, seteditarMapa] = useState(false);
  console.log(zones);
  const [zonesLayers, setZonesLayers] = useState<ZonaLocal[]>([]);
  const [creandoZona, setCreandoZona] = useState(false);
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(true);
  // const [loading, setLoading] = useState(false);
  const [editingZone, setEditingZone] = useState<string | "">("");
  const [zoneSelect, setzoneSelect] = useState<any>();
  const [noEditingZones, setNonEditingZone] = useState<ZonaLocal[] | null>(null);
  // console.log("zone Select", zoneSelect);
  // console.log("loading...", loading);
  // console.log("zonesLayers", zonesLayers);
  // console.log("editingZone", editingZone);
  // console.log("noEditingZones", noEditingZones);
  // console.log("editando zonas?", editando);
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(obtenerZonas())

  }, []);

  useEffect(() => {
    const editingZoneId = editingZone ? parseInt(editingZone) : null;
    if (editingZoneId && zonesLayers.length > 0) {
      const zonaEditando = zonesLayers.find(zone => zone.id === editingZoneId);
      const zonasNoEditando = zonesLayers.filter(zone => zone.id !== editingZoneId);
      if (zonaEditando) {
        // Aquí puedes hacer lo que necesites con la zona que se está editando
        setzoneSelect(zonaEditando)
        zonasNoEditando.forEach(zone => {
          const result = zone.layer.editing.disable();
          console.log(`Edición deshabilitada para la zona con ID ${zone.id}`, result);
        });
      } else {
        console.log("No se encontró la zona que se está editando");
      }
      setNonEditingZone(zonasNoEditando)
    }
  }, [editingZone, zonesLayers]);

  ///////////////////////////////////////
  //Traer las zonas y pasarlas al formato indicado para mostrarlas en el mapa
  useEffect(() => {
    if (zonas.length) {
      const zoneLayer = zonas.map(zone => {
        const layer = L.geoJSON(zone.layer).getLayers()[0] as CustomLayer;
        const properties = zone.layer.properties;
        const nombre = zone.nombre;
        const id = zone.id;
        // console.log("layer dentro del map", layer);
        // layer.editing.disable();
        return { layer, properties, nombre, id };
      });

      // console.log("zonelayer post deshabilitar editable", zoneLayer);

      setZonesLayers(zoneLayer)
    }

  }, [zonas]);
  ////////////////////////////////////////
  //Creando zonas
  const handleZoneCreated = (e: any) => {
    // setLoading(true);
    const { layer } = e;
    // console.log("Layer enetero sin modificar", layer);
    const polygonGeoJSON = layer.toGeoJSON();

    Swal.fire({
      title: 'Ingrese los detalles de la zona:',
      html: `
        <input id="nombre" type="text" placeholder="Nombre de la zona" class="swal2-input">
        <textarea id="descripcion" rows="4" cols="50" placeholder="Descripción"></textarea>
        <input id="tipo" type="text" placeholder="Tipo de zona" class="swal2-input">
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

        const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
        const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value;
        const tipo = (document.getElementById('tipo') as HTMLInputElement).value;

        polygonGeoJSON.properties.name = nombre;
        polygonGeoJSON.properties.description = descripcion;
        polygonGeoJSON.properties.type = tipo;
        polygonGeoJSON.properties.color = randomColor;
        polygonGeoJSON.properties.fill = true;
        polygonGeoJSON.properties.border_width = 2;


        const jsonEnviar = {
          nombre: nombre,
          layer: polygonGeoJSON
        }
        // console.log("info enviada", jsonEnviar);
        if (!nombre) {
          Swal.showValidationMessage('El nombre de la zona es requerido');
          return false;
        }
        return axios.post('http://127.0.0.1:8000/api/zonas', jsonEnviar)
          .then(response => {
            // console.log("response", response);
            setZones(prevZones => [...prevZones, response.data]);
          })
          .catch(error => {
            console.error('Error al enviar la zona:', error);
            Swal.showValidationMessage('Ocurrió un error al enviar la zona');
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        // El usuario canceló, no hagas nada
      } else {
        dispatch(obtenerZonas())
        // setLoading(false);
        setCreandoZona(false);
        seteditarMapa(false)
      }
    });
  };
  const SetViewOnClick: React.FC<{ coords: LatLngExpression }> = ({ coords }) => {
    const map = useMap();
    map.setView(coords, map.getZoom());
    return null;
  };

  const carlosPazCoords: LatLngExpression = [-31.4241, -64.4978];

  //////// Cambiar estados del mapa //////////////
  const habilitarMapa = () => {
    seteditarMapa(!editarMapa)
    // setpanelcolor(!panelcolor)
  };
  const habilitarCrearZona = () => {
    setCreandoZona(!creandoZona)
  };

  const habilitarEditar = () => {
    setEditando(!editando)
  };

  /////////////   Editando zona  ///////////////////////
  const handleEdited = (e: any) => {
    const { layers } = e;

    layers.eachLayer((layer: any) => {
      const layerId = layer.options.attribution;
      const editedGeoJSON = layer.toGeoJSON();
      // Busca la zona correspondiente a la capa editada
      const zonaBuscada = zonas.find(zone => zone.id == layerId);
      console.log("zona buscada", zonaBuscada);
      if (zonaBuscada) {
        editedGeoJSON.properties.color = zonaBuscada.layer.properties.color;
        editedGeoJSON.properties.name = zonaBuscada.layer.properties.nombre;
        editedGeoJSON.properties.description = zonaBuscada.layer.properties.descripcion;
        editedGeoJSON.properties.type = zonaBuscada.layer.properties.tipo;
        editedGeoJSON.properties.fill = zonaBuscada.layer.properties.fill;
        editedGeoJSON.properties.border_width = zonaBuscada.layer.properties.border_width;

        const jsonEnviar = {
          nombre: zonaBuscada.nombre,
          layer: editedGeoJSON
        }
        dispatch(editarZonaById(zonaBuscada.id, jsonEnviar));
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "La zona se actualizo correctamente",
          showConfirmButton: false,
          timer: 1500
        });
        dispatch(obtenerZonas())
      } else {
        console.log("No se encontró la zona para actualizar");
      }
    });
  };



  const activarEdicion = () => {
    setEliminando(!eliminando)
  };


  /////////     Eliminando zonas     ///////////

  const handleDeleted = (e: any) => {
    console.log("ingresa más de una vez a delete");
    const { layers } = e;
    if (layers) {
      layers.eachLayer((layer: any) => {
        const layerDelete = layer.options.attribution
        dispatch(eliminarZonaById(layerDelete))
        // handleCancelEditar()
      });
    }

  };

  const createCustomIcon = (nombre: number, color: string) => {
    const labelStyle = {
      // position: 'absolute',
      display: "flex",
      "background-color": 'rgba(43, 43, 43, 0.899)',
      padding: '0px',
      width: '30px',
      height: '30px',
      "border-radius": '50px',
      "font-size": '0.7rem',
      "font-weight": 'bold',
      color: color,
      "justify-content": "center",
      pointerEvents: 'none',
      "align-items": "center"
    };
    const styleString = Object.entries(labelStyle).map(([key, value]) => `${key}:${value}`).join(';');
    return L.divIcon({
      className: 'custom-icon',
      html: `<div style="${styleString}">${nombre}</div>`,
      iconAnchor: [10, 12],
    });
  };

  const handleCancelEditar = () => {
    seteditarMapa(false)
    setCreandoZona(false)
    setEliminando(true)
    setEditando(false)
  };
 
  return (
    <div className="draw-map-container">
      <div className='allMapContainer'>
        {
          !editarMapa ?
            <div className='botones'>
              <CustomButton2 onClick={habilitarMapa} disabled={editarMapa} titulo="Editar Mapa" color1='#a8a6a6' color2='#666464' />
            </div> :
            <div className='botones'>
              {creandoZona && <div className=''>Crea zonas nuevas</div>}
              {editando && <div className=''>Selecciona la zona a editar o eliminar</div>}
              <div className={`creandoZonaCont ${editando ? "editandozona" : ""} `}>
                {!creandoZona ?
                  <CustomButton2 onClick={habilitarCrearZona} disabled={editando} titulo="Crear zonas" color1='var(--secundary-color)' color2='var(--secundary-color)' /> :
                  <CustomButton2 onClick={habilitarCrearZona} disabled={editando} titulo="Cancelar" color1='#e83737' color2='#fc2a2a' />
                }
              </div>
              {!creandoZona && !editando && <CustomButton2 onClick={habilitarMapa} disabled={creandoZona} titulo="Finalizar" color1='#3e3f3f' color2='#3e3f3f' />}
              <div className={`editandoZonaCont ${creandoZona ? "creandozona" : ""} `}>
                {!editando ?
                  <CustomButton2 onClick={habilitarEditar} disabled={creandoZona} titulo="Editar Zonas" color1='#1e81b2' color2='#1e81b2' /> :
                  <CustomButton2 onClick={handleCancelEditar} disabled={creandoZona} titulo="Finalizar" color1='#e83737' color2='#fc2a2a' />
                }
              </div>

            </div>

        }
        <div className={`cancelBtn ${editarMapa ? "activecancel" : ""
          }`}>
        </div>
        <MapContainer
          center={carlosPazCoords}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {!editando ?
            <div className="draw-controls-container">
              <FeatureGroup>
                {creandoZona && (
                  <EditControl
                    position="topright"
                    onCreated={handleZoneCreated}
                    edit={{
                      remove: false,
                      edit: false
                    }}
                    draw={{
                      rectangle: false,
                      circle: false,
                      circlemarker: false,
                      marker: false,
                      polyline: false,
                      polygon: creandoZona,

                    }}
                  />
                )}
                {zonesLayers?.length && zonesLayers.map((zone, index) => {
                  const bounds = zone.layer.getBounds();
                  const center = bounds.getCenter();

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
                      <Marker
                        position={center}
                        eventHandlers={{
                          click: () => {
                            console.log('marker clicked')
                          },
                        }}
                        icon={createCustomIcon(zone.id, zone.properties.color)}
                      >
                      </Marker>
                    </div>
                  )
                })}
              </FeatureGroup>
            </div> :
            <div className="draw-controls-container">
              <FeatureGroup>
                {editando && zoneSelect && (
                  <EditControl
                    position="topright"
                    onEditStart={activarEdicion}
                    onEdited={handleEdited}
                    onDeleted={handleDeleted}
                    draw={{
                      rectangle: false,
                      circle: false,
                      circlemarker: false,
                      marker: false,
                      polyline: false,
                      polygon: false
                    }}
                    edit={{
                      edit: {},
                      remove: eliminando
                    }}

                  />
                )}
                {zoneSelect && (
                  <div key={zoneSelect.id}>
                    <Polygon
                      attribution={zoneSelect.id.toString()}
                      positions={zoneSelect.layer.getLatLngs()}
                      color={zoneSelect.properties.color}
                      fillOpacity={0.5}
                      fillColor={zoneSelect.properties.color}
                    />
                    <Marker
                      position={zoneSelect?.layer.getBounds().getCenter()}
                      eventHandlers={{
                        click: () => {
                          console.log('marker clicked')
                        },
                      }}
                      icon={createCustomIcon(zoneSelect.id, zoneSelect.properties.color)}
                    />
                  </div>
                )}
              </FeatureGroup>
              <FeatureGroup>
                {noEditingZones?.length && noEditingZones.map((zone, index) => {
                  const bounds = zone.layer.getBounds();
                  const center = bounds.getCenter();

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
                      <Marker
                        position={center}
                        eventHandlers={{
                          click: () => {
                            setEditingZone(zone.id.toString())
                          },
                        }}
                        icon={createCustomIcon(zone.id, zone.properties.color)}
                      >
                      </Marker>
                    </div>
                  )
                })}
              </FeatureGroup>
            </div>
          }
          <SetViewOnClick coords={carlosPazCoords} />
        </MapContainer>
      </div>
      <div className='listZone'>
        <ZonesList zones={zonas} zoneEdi={editingZone} setEditingZone={setEditingZone} />
      </div>
    </div>
  );
};

export default MapasConfig;





{/* <GeoJSON key={index+1} data={zone.layer} style={(feature:any) => ({
        fillColor: feature.properties.color,
        color: "#878585",  
        weight: 1,
        fillOpacity: 0.3
    })} /> */}

{/* <div className='divZonaColor'> */ }
{/* <input 
                type="text" 
                id="zoneName" 
                value={zoneName} 
                onChange={handleZoneNameChange} 
                placeholder="Nombre de la zona" 
                /> */}

{
                  /* Este codigo sirve para cambiar el color de los mapas despues de ser creados...
                  <div className={`color-picker-container ${panelcolor? "colorselect": ""}`}>
                <label htmlFor="colorPicker">Seleccionar color: </label>
                <input 
                  type="color" 
                  id="colorPicker" 
                  value={selectedColor} 
                  onChange={handleColorChange} 
                />
              </div>  */}