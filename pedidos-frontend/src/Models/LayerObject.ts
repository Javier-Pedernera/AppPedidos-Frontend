interface LayerObject {
        geometry: {
            tipo: string;
            coordinates: [number, number][];
        };
        properties: {
            nombre: string;
            descripcion: string;
            tipo: string;
            color: string;
            fill: boolean;
            border_width: number
        };
        type: "Polygon"
}

export default LayerObject;