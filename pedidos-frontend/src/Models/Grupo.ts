export interface Grupo {
    id?: number;
    id_zona: number;
    fecha_hora_creacion: any;
    fecha_hora_cierre?: Date | null | string;
    fecha_hora_envio?: Date | null | string;
    id_estado: number;
    id_cadete?: number| null;
  }