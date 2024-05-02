import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cadete } from '../../Models/Cadete';

interface CadetesState {
  cadetes: Cadete[];
  cadeteSeleccionado: Cadete | null;
}

const initialState: CadetesState = {
  cadetes: [],
  cadeteSeleccionado: null,
};

const cadetesSlice = createSlice({
  name: 'cadetes',
  initialState,
  reducers: {
    getAllCadetes: (state, action: PayloadAction<Cadete[]>) => {
      state.cadetes = action.payload;
    },
    addCadete: (state, action: PayloadAction<Cadete>) => {
      state.cadetes.push(action.payload);
    },
    deleteCadete: (state, action: PayloadAction<number>) => {
      state.cadetes = state.cadetes.filter((cadete) => cadete.id !== action.payload);
    },
    updateCadete: (state, action: PayloadAction<Cadete>) => {
      const cadeteActualizado = action.payload;
      state.cadetes = state.cadetes.map((cadete) => {
        if (cadete.id === cadeteActualizado.id) {
          return cadeteActualizado;
        }
        return cadete;
      });
    },
    clearCadetes: (state) => {
      state.cadetes = [];
    },
    selectCadete: (state, action: PayloadAction<Cadete>) => {
      state.cadeteSeleccionado = action.payload;
    },
    clearSelectedCadete: (state) => {
      state.cadeteSeleccionado = null;
    },
  },
});

export const {
  addCadete,
  deleteCadete,
  updateCadete,
  clearCadetes,
  selectCadete,
  clearSelectedCadete,
  getAllCadetes
} = cadetesSlice.actions;
export default cadetesSlice.reducer;