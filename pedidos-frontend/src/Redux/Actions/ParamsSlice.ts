import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ParamsState {
  maxTiempoEspera: number;
  maxPedidos: number;
}

const initialState: ParamsState = {
  maxTiempoEspera: 10,
  maxPedidos: 5,
};

const paramsSlice = createSlice({
  name: 'params',
  initialState,
  reducers: {
    setMaxTiempoEspera: (state, action: PayloadAction<number>) => {
      state.maxTiempoEspera = action.payload;
    },
    setMaxPedidos: (state, action: PayloadAction<number>) => {
      state.maxPedidos = action.payload;
    },
  },
});

export const { setMaxTiempoEspera, setMaxPedidos } = paramsSlice.actions;
export default paramsSlice.reducer;

