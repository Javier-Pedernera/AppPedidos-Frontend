import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Pedido {
  id: string;
  // Otras propiedades del pedido
}

interface PedidosState {
  pedidos: Pedido[];
}

const initialState: PedidosState = {
  pedidos: [],
};

const pedidosSlice = createSlice({
  name: 'pedidos',
  initialState,
  reducers: {
    getAllPedidos: (state, action: PayloadAction<Pedido[]>) => {
      state.pedidos = action.payload;
    },
    agregarPedido: (state, action: PayloadAction<any>) => {
      state.pedidos.push(action.payload);
    },
    eliminarPedido: (state, action: PayloadAction<string>) => {
      state.pedidos = state.pedidos.filter((pedido) => pedido.id !== action.payload);
    },
    actualizarPedido: (state, action: PayloadAction<any>) => {
      const pedidoActualizado = action.payload;
      state.pedidos = state.pedidos.map((pedido) => (pedido.id === pedidoActualizado.id ? pedidoActualizado : pedido));
    },
  },
});

export const { getAllPedidos, agregarPedido, eliminarPedido, actualizarPedido } = pedidosSlice.actions;

export default pedidosSlice.reducer;