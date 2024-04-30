import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Grupo } from '../../Models/Grupo';



interface GruposState {
  grupos: Grupo[];
  grupo_elegido: Grupo | null;
}

const initialState: GruposState = {
  grupos: [],
  grupo_elegido: null,
};

const gruposSlice = createSlice({
  name: 'grupos',
  initialState,
  reducers: {
    getAllGrupos: (state, action) => {
        return {
            ...state,
            grupos: action.payload
        };
      },
      agregarGrupo: (state, action: PayloadAction<any>) => {
      state.grupos.push(action.payload);
    },
    eliminarGrupo: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        grupos: state.grupos.filter((grupo) => grupo.id !== action.payload),
      };

    },
    actualizarGrupo: (state, action: PayloadAction<Grupo>) => {
      const grupoActualizado = action.payload;
      state.grupos = state.grupos.map(grupo => {
        if (grupo.id === grupoActualizado.id) {
          return grupoActualizado;
        }
        return grupo;
      });
    },
    limpiarGrupos: (state) => {
      state.grupos = [];
    },
    elegirGrupo: (state, action: PayloadAction<Grupo>) => {
      state.grupo_elegido = action.payload;
    },
    limpiarGrupoElegido: (state) => {
      state.grupo_elegido = null;
    },
  },
});

export const { agregarGrupo, eliminarGrupo, actualizarGrupo, limpiarGrupos, elegirGrupo, limpiarGrupoElegido, getAllGrupos } = gruposSlice.actions;
export default gruposSlice.reducer;