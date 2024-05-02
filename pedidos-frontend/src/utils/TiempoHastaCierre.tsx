import { DateTime } from "luxon";

export default function calcularMinutosHastaCierre(desde: string, hasta: string): number {

    const fechaInicio: DateTime = DateTime.fromISO(desde);
    const cierre: DateTime = DateTime.fromISO(hasta)
    const diferencia: number = cierre.diff(fechaInicio, 'minutes').minutes ;
    return Math.abs(Math.floor(diferencia)); 
}