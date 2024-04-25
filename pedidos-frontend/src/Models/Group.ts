export interface Group {
    id: number;
    id_zona: number;
    fecha_hora_creacion: Date;
    fecha_hora_cierre?: Date | null;
    fecha_hora_envio?: Date | null;
    id_estado: number;
    id_cadete: number;
  }