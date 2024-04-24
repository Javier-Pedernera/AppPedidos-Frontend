import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ParamsData {
  maxTiempoEspera: number;
  maxPedidos: number;
}

export const saveParams = createAsyncThunk<void, ParamsData>(
  'params/saveParams',
  async (paramsData) => {
    try {
      // Lógica para enviar los datos al backend (por ejemplo, con axios)
      await axios.post('/api/params', paramsData);
    } catch (error) {
      console.error('Error al guardar los parámetros:', error);
      throw error;
    }
  }
);