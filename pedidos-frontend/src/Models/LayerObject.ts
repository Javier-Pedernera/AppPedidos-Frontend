interface LayerObject {
        geometry: {
            tipo: string;
            coordinates: [number, number][];
        };
        properties: {
            nombre: string;
            descripcion: string;
            tipo: string;
            color: string
        };
        type: "Polygon"
}

export default LayerObject;