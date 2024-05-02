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
      return {
        ...state,
        zonas: state.zonas.filter((zona) => zona.id !== action.payload),
      };

    },
    actualizarZona: (state, action: PayloadAction<Zona>) => {
      const zonaActualizada = action.payload;
      state.zonas = state.zonas.map(zona => {
        if (zona.id === zonaActualizada.id) {
          return zonaActualizada;
        }
        return zona;
      });
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

export const { agregarZona, eliminarZona, actualizarZona, limpiarZonas, elegirZona, limpiarZonaElegida, getAll } = zonasSlice.actions;
export default zonasSlice.reducer;