import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParamsModel } from '../../Models/Params';



interface ParamsState {
  allParams: ParamsModel[];
}

const initialState: ParamsState = {
  allParams: [],
};

const paramsSlice = createSlice({
  name: 'params',
  initialState,
  reducers: {
    setParams: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        allParams: [...state.allParams , action.payload]
    };
    },
    getAllParams: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        allParams: action.payload
    };
    },
    deleteParams: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        allParams: state.allParams.filter(param => param.id !== action.payload)
    };
    },
    updateParams: (state, action: PayloadAction<{ id: number; valor: string }>) => {
      const { id, valor } = action.payload;
      const paramIndex = state.allParams.findIndex(param => param.id === id);
      if (paramIndex !== -1) {
        state.allParams[paramIndex].valor = valor;
      }
    },
  },
});

export const { setParams, getAllParams, deleteParams,updateParams } = paramsSlice.actions;
export default paramsSlice.reducer;
