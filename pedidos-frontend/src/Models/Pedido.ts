export default interface Pedido {
    cliente: string;
    direccion: string;
    estado: {
      id: number;
      nombre: string;
    };
    grupo: {
      cadete: {
        activo: boolean | null;
        id: number | null;
        nombre: string | null;
      };
      estado: {
        id: number;
        nombre: string;
      };
      fecha_hora_cierre: string | null;
      fecha_hora_creacion: string;
      fecha_hora_envio: string | null;
      id: number;
      zona: {
        id: number;
        nombre: string;
      };
    };
    id: number;
    id_estado: number;
    id_grupo: number;
    latitud: string;
    longitud: string;
    pedido: string;
    telefono: string;
  }