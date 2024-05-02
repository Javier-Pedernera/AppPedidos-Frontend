import * as turf from '@turf/turf';
import ZonaLocal from '../Models/ZonaLocal';

interface Point {
  lat: number;
  lng: number;
}

function encontrarZonasParaPunto(point: Point, zones: ZonaLocal[]) {
  const zonasEncontradas: ZonaLocal[] = [];
  const turfPoint = turf.point([point.lng, point.lat]);
  
  zones.forEach(zona => {
    const coordinates = zona.layer.toGeoJSON().geometry.coordinates
    
    const zonaPolygon = turf.polygon(coordinates);
    if (turf.inside(turfPoint, zonaPolygon)) { 
      zonasEncontradas.push(zona);
    }
  });

  return zonasEncontradas;
}

export default encontrarZonasParaPunto;

// Ejemplo de uso:
// const punto: Point = { lat: 40.7128, lng: -74.0060 };
// const zonas: Zone[] = [
//   { id: 1, polygon: L.polygon([...]) }, 
//   { id: 2, polygon: L.polygon([...]) },
// ];

// const zonasParaPunto = encontrarZonasParaPunto(punto, zonas);
// console.log('El punto está dentro de las siguientes zonas:', zonasParaPunto);