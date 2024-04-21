import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Zona from '../../Models/Zona';



interface ZonasState {
  zonas: Zona[];
  zonaElegida: Zona | null;
}

const initialState: ZonasState = {
  zonas: [],
  zonaElegida: null,
};

const zonasSlice = createSlice({
  name: 'zonas',
  initialState,
  reducers: {
    getAll: (state, action) => {
        return {
            ...state,
            zonas: action.payload
        };
      },
    agregarZona: (state, action: PayloadAction<Zona>) => {
      state.zonas.push(action.payload);
    },
    eliminarZona: (state, action: PayloadAction<number>) => {
      state.zonas.splice(action.payload, 1);
    },
    limpiarZonas: (state) => {
      state.zonas = [];
    },
    elegirZona: (state, action: PayloadAction<Zona>) => {
      state.zonaElegida = action.payload;
    },
    limpiarZonaElegida: (state) => {
      state.zonaElegida = null;
    },
  },
});

export const { agregarZona, eliminarZona, limpiarZonas, elegirZona, limpiarZonaElegida, getAll } = zonasSlice.actions;
export default zonasSlice.reducer;