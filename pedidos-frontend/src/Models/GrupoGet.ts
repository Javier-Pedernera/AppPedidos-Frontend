
export interface GrupoGet {
    id: number;
    fecha_hora_creacion: string;
    fecha_hora_cierre: string;
    fecha_hora_envio: string;
    pedidos: Pedido[];
    zona:{
      id: number;
    nombre: string
    }
    cadete:{
        id: number;
        activo: boolean;
        nombre: string;
    }
    estado:{
        id: number;
        nombre: string;
    }
}