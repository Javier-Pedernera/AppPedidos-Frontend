import { DateTime } from "luxon";

export default function calcularMinutosTranscurridos(desde: string): number {

    const fechaInicio: DateTime = DateTime.fromISO(desde).minus({ hours: 3 }) ;
    
    const ahora: DateTime = DateTime.utc()
    const diferencia: number = ahora.diff(fechaInicio, 'minutes').minutes ;
    return Math.abs(Math.floor(diferencia)); 
}

