import L from 'leaflet';

interface Point {
  lat: number;
  lng: number;
}

interface Zone {
  id: number;
  polygon: L.Polygon;
}

function encontrarZonasParaPunto(point: Point, zones: Zone[]): Zone[] {
  const zonasEncontradas: Zone[] = [];

  zones.forEach(zona => {
    if (zona.polygon.getBounds().contains(point)) {
      zonasEncontradas.push(zona);
    }
  });

  return zonasEncontradas;
}

export default encontrarZonasParaPunto

// Ejemplo de uso:
// const punto: Point = { lat: 40.7128, lng: -74.0060 };
// const zonas: Zone[] = [
//   { id: 1, polygon: L.polygon([...]) }, 
//   { id: 2, polygon: L.polygon([...]) },
// ];

// const zonasParaPunto = encontrarZonasParaPunto(punto, zonas);
// console.log('El punto está dentro de las siguientes zonas:', zonasParaPunto);