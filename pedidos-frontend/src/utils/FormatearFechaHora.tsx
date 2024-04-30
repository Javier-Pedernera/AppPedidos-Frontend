import { DateTime } from "luxon";

// Función para formatear la fecha y hora local para mostrar en la interfaz de usuario
export const formatLocalDateTime = (dateTime: string): string => {
  // console.log("dateTime", dateTime);
  
 
  const utcDateTime = DateTime.fromISO(dateTime);
  // console.log("utcDateTime", utcDateTime);

  const localDateTime = utcDateTime.minus({ hours: 3 }); 
  // Restar 3 horas para ajustar a la zona horaria local (UTC-3)
  // console.log("localDateTime", localDateTime);
  
  const formattedLocalTime = localDateTime.toLocaleString(DateTime.DATETIME_SHORT);
  // console.log(`Fecha y hora local: ${formattedLocalTime}`);
  
  return formattedLocalTime;
};
// Función para formatear la fecha y hora para guardar en la base de datos
export const formatDatabaseDateTime = (): string => {
  const utcDateTime = DateTime.utc();
  return utcDateTime.toISO();
};