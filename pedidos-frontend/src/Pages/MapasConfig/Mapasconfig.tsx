import React, { useEffect, useState } from 'react';
import { MapContainer , TileLayer, useMap, Polygon } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import { LatLngExpression } from 'leaflet';
import '../../scss/components/_Mapasconfig.scss'
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import CustomButton2 from '../../Components/Button/CustomButton2';
import ZonesList from '../../Components/ZonesList/ZonesList';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { obtenerZonas } from '../../Redux/Actions/ZonasGet';
import Zona from '../../Models/Zona';
// import L from 'leaflet';
import 'leaflet-draw';
import L from 'leaflet';
import ZonaLocal from '../../Models/ZonaLocal';
// import { Geometry } from 'geojson';
// import EditMapa from '../../Components/EditControlComponent/EditMap';

// import EditControlComponent from '../../Components/EditControlComponent/EditControlComponent';

const MapasConfig = () => {


    const zonas: Zona[] = useAppSelector((state: any) => state.zonas.zonas);
  console.log("zonas", zonas);
  
  const [zones, setZones] = useState<any[]>([]);
//   const [panelcolor, setpanelcolor] = useState(false);
//   const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [editarMapa, seteditarMapa] = useState(false);
  console.log(zones);
  const [zonesLayers, setZonesLayers] = useState<ZonaLocal[]>([]);
const [creandoZona, setCreandoZona] = useState(false);
const [editando, setEditando] = useState(false);
// console.log("zonesLayers", zonesLayers);
const [loading, setLoading] = useState(false);
// console.log("editando zonas del global",editando);
console.log("loading...",loading);

const dispatch = useAppDispatch()

useEffect(() => {
    dispatch(obtenerZonas())
    
}, []);

///////////////////////////////////////
//Traer las zonas y pasarlas al formato indicado para mostrarlas en el mapa
useEffect(() => {
  if(zonas.length){
  const zoneLayer = zonas.map(zone => {
    const layer = L.geoJSON(zone.layer).getLayers()[0];
    const properties = zone.layer.properties; 
    const nombre = zone.nombre;
    const id = zone.id;
    return { layer, properties, nombre, id };
}); 
   setZonesLayers(zoneLayer)
  }
  
}, [zonas]);
////////////////////////////////////////





const handleZoneCreated = (e: any) => {
  setLoading(true);
    const { layer } = e;
    console.log("Layer enetero sin modificar",layer);
    const polygonGeoJSON= layer.toGeoJSON();

  //   console.log("polygonGeoJSON creado con funcion",polygonGeoJSON);
  //   console.log("polygonGeoJSON creado con toGeoJSON",polygonGeoJSON2);
  //   console.log("layer reconvertido", layerOtravez);
  //   console.log("Info layer reconvertido", nueva_info_layer);

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
        polygonGeoJSON.properties.border_width= 2;
        

        const jsonEnviar = {
            nombre: nombre,
            layer: polygonGeoJSON
        }
        console.log("info enviada",jsonEnviar);
        if (!nombre) {
          Swal.showValidationMessage('El nombre de la zona es requerido');
          return false;
        }
  
        return axios.post('http://127.0.0.1:8000/api/zonas', jsonEnviar)
          .then(response => {
            console.log("response", response);
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
        setLoading(false);
        setCreandoZona(false);
        seteditarMapa(false)
      }
    });
  };
// console.log("zones",zones);

  const SetViewOnClick: React.FC<{ coords: LatLngExpression  }> = ({ coords }) => {
    const map = useMap();
    map.setView(coords, map.getZoom());
    return null;
  };
  
  const carlosPazCoords: LatLngExpression = [-31.4241, -64.4978];
  // const poligono = [[-64.490948, -31.414006], [-64.501591, -31.417958], [-64.495411, -31.424397], [-64.48494, -31.421177], [-64.490948, -31.414006]]
  // const poligonoSur = [[-64.502964, -31.430542], [-64.499702, -31.423226], [-64.487343, -31.435956], [-64.502964, -31.430542]]
  const habilitarMapa = () => {
    seteditarMapa(!editarMapa)
    // setpanelcolor(!panelcolor)
  };
  const habilitarCrearZona = () => {
    setCreandoZona(!creandoZona)
  };
console.log("creando zona", creandoZona);

const habilitarEditar = () => {
  console.log("entre a editar el mapa?");
  setEditando(!editando)
};


const handleEdited = (e: any) => {
  const { layers } = e;
  layers.eachLayer((layer: any) => {
      // Aquí puedes acceder al GeoJSON editado y actualizarlo según sea necesario
      const editedGeoJSON = layer.toGeoJSON();
      console.log("Zona editada:", editedGeoJSON);
      // Aquí puedes enviar el GeoJSON editado al servidor para actualizar la base de datos, si es necesario
  });
};

const handleDeleted = (e: any) => {
  console.log("queriendo eliminar");
  console.log(e);
  
  const { layers } = e;
  layers.eachLayer((layer: any) => {
      console.log("Zona eliminada:", layer.toGeoJSON());
  });
};
  // const handleCancel = () => {
  //   setZones([])
  //   seteditarMapa(false)
  //   setCreandoZona(false)
  //   // setSelectedColor(undefined)
    
  // };
//   const handleZoneNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setZoneName(e.target.value);
//   };
// console.log(editarMapa);


  return (
    <div className="draw-map-container">
        <div className='divZonaColor'>
            <h4>Zonas:</h4>
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

            {

                !editarMapa? 
                <CustomButton2 onClick={habilitarMapa} disabled= {editarMapa} titulo= "Editar Mapa" color1='#a8a6a6' color2='#666464'/>:
               <div className='botones'>
                 { creandoZona&&<div className=''>Crea zonas nuevas</div>}
                 { editando&&<div className=''>Edita tus zonas</div>}
                    <div className= {`creandoZonaCont ${editando? "editandozona": ""  } `}>
                    {!creandoZona?
                    <CustomButton2  onClick={habilitarCrearZona} disabled= {editando} titulo= "Crear zonas" color1='#a8a6a6' color2='#666464'/>:
                    <CustomButton2 onClick={habilitarCrearZona} disabled= {editando} titulo= "Cancelar" color1='#e83737' color2='#fc2a2a'/>
                  }
                    </div>
                  
                  <div className= {`editandoZonaCont ${creandoZona? "creandozona": ""  } `}>
                      {!editando?
                       <CustomButton2 onClick={habilitarEditar} disabled= {creandoZona} titulo= "Editar Zonas" color1='var(--secundary-color);' color2='var(--secundary-color)'/>:
                      <CustomButton2 onClick={habilitarEditar} disabled= {creandoZona} titulo= "Cancelar" color1='#e83737' color2='#fc2a2a'/>
                                        }
                  </div>
                 
                </div>
                
            }
            <div className={`cancelBtn ${editarMapa? "activecancel": ""
                }`}>
              {/* <CustomButton2 onClick={handleCancel} titulo= "Cancelar" color1='#e83737' color2='#fc2a2a'
            />   */}
            </div>
        </div>
        
    <MapContainer
      center={carlosPazCoords}
      zoom={13}
  scrollWheelZoom={true}
  style={{ height: '600px', width: '800px' }}
    >
        
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <div className="draw-controls-container">
          <FeatureGroup>
            { creandoZona && (
                <EditControl
                    position="topright"
                    onCreated={handleZoneCreated}
                    onEdited={handleEdited}
                    onDeleted={handleDeleted}
                    draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        polygon: creandoZona
                    }}
                    edit={{
                      remove: false,
                      edit: false
                    }}
                />
            )}
           { editando && (
              <EditControl
                  position="topright"
                  onCreated={handleZoneCreated}
                  onEdited={handleEdited}
                  onDeleted={handleDeleted}
                  draw={{
                      rectangle: false,
                      circle: false,
                      circlemarker: false,
                      marker: false,
                      polyline: false,
                      polygon: creandoZona
                  }}
              />
          )
            
            }

{zonesLayers.length && zonesLayers.map((zone, index) => (
          //  <GeoJSON key={index} data={zone.layer} />
<Polygon 
      key={index} 
      positions={zone.layer.getLatLngs()} 
      color={zone.properties.color} />        
        )
        )}

{/* <GeoJSON key={index} data={zone.layer} style={(feature:any) => ({
        fillColor: feature.properties.color,
        color: "#878585",  
        weight: 1,
        fillOpacity: 0.3
    })} /> */}
          </FeatureGroup>
        </div>
        
        {/* <EditMapa></EditMapa> */}

        
      <SetViewOnClick coords={carlosPazCoords} />
    </MapContainer>
    <div className="draw-map-container">
      <ZonesList zones={zonas} /> 
    </div>
  </div>
  );
};

export default MapasConfig;
