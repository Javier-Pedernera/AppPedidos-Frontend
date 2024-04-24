import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Polygon } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import { LatLngExpression } from 'leaflet';
import '../../scss/components/_Mapasconfig.scss'
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import CustomButton2 from '../Button2/CustomButton2';
import ZonesList from '../../Components/ZonesList/ZonesList';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { obtenerZonas } from '../../Redux/Actions/ZonasActions';
import Zona from '../../Models/Zona';
import L from 'leaflet';
import 'leaflet-draw';

const EditMap = () => {


  const zonas: Zona[] = useAppSelector((state: any) => state.zonas.zonas);

  const [zonesLayers, setZonesLayers] = useState<any[]>([]);
  const [editarMapa, seteditarMapa] = useState(false);
  console.log("zonesLayers", zonesLayers);
  const [creandoZona, setCreandoZona] = useState(false);
  const [editando, setEditando] = useState(false);


  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(obtenerZonas())

  }, []);
  useEffect(() => {
    if (zonas) {


      const zoneLayer = zonas.map(zone => {
        const layer = L.geoJSON(zone.layer).getLayers()[0]; // Obtener la capa de la zona
        const properties = zone.layer.properties; // Obtener las propiedades de la zona
        const nombre = zone.nombre; // Obtener el nombre de la zona

        return { layer, properties, nombre }; // Crear el objeto con la capa, las propiedades y el nombre
      });
      setZonesLayers(zoneLayer)
    }

  }, []);
  ///////////////////////////////////////


  ////////////////////////////////////////



  // console.log("zonas del global",zonas);


  const SetViewOnClick: React.FC<{ coords: LatLngExpression }> = ({ coords }) => {
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


  const handleZoneCreated = () => {
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

        {!editarMapa ?
          <CustomButton2 onClick={habilitarMapa} disabled={editarMapa} titulo="Editar Mapa" color1='#a8a6a6' color2='#666464' /> :
          <div className='botones'>
            {creandoZona && <div className=''>Crea zonas nuevas</div>}
            {editando && <div className=''>Edita tus zonas</div>}
            <div className={`creandoZonaCont ${editando ? "editandozona" : ""} `}>
              {!creandoZona ?
                <CustomButton2 onClick={habilitarCrearZona} disabled={editando} titulo="Crear zonas" color1='#a8a6a6' color2='#666464' /> :
                <CustomButton2 onClick={habilitarCrearZona} disabled={editando} titulo="Cancelar" color1='#e83737' color2='#fc2a2a' />
              }
            </div>

            <div className={`editandoZonaCont ${creandoZona ? "creandozona" : ""} `}>
              {!editando ?
                <CustomButton2 onClick={habilitarEditar} disabled={creandoZona} titulo="Editar Zonas" color1='var(--secundary-color);' color2='var(--secundary-color)' /> :
                <CustomButton2 onClick={habilitarEditar} disabled={creandoZona} titulo="Cancelar" color1='#e83737' color2='#fc2a2a' />
              }
            </div>

          </div>}


        <div className={`cancelBtn ${editarMapa ? "activecancel" : ""
          }`}>
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

            {editarMapa && (
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
                  polygon: true
                }}
              />
            )}

            {zonesLayers.length && zonesLayers.map((zone, index) => {
              console.log('Zona:', zone
              ); // Agregar console.log dentro del bloque de llaves
              const coordinates = zone.layer.getLatLngs(); // Obtener las coordenadas del polígono
              console.log(coordinates);
              // console.log('Coordenadas del polígono:', zone._layers.feature.geometry.coordinates);
              return (
                <Polygon
                  key={index}
                  positions={zone.layer.getLatLngs()}
                  color={zone.properties.color} />
              );
            })}


            {/* <GeoJSON key={index} data={zone.getLatLngs()[0]} style={(feature:any) => ({
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

export default EditMap;

// {
//   "type": "Feature",
//   "properties": {
//     "name": "My Polygon",
//     "color": "red",
//     "border_width": 2,
//     "fill": true,
//     "description": "This is a red polygon with a thick border.",
//     "type": "residential"
//   },
//   "geometry": {
//     "type": "Polygon",
//     "coordinates": [
//       [
//         [10.0, 10.0],
//         [20.0, 10.0],
//         [20.0, 20.0],
//         [10.0, 20.0],
//         [10.0, 10.0]
//       ]
//     ]
//   }
// }
