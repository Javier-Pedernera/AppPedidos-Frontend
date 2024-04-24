import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { addCadete, deleteCadete, getAllCadetes, updateCadete } from "./CadetesSlice";

const URL = import.meta.env.VITE_API_URL;

export const fetchCadetes = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/api/cadetes`);
      dispatch(getAllCadetes(response.data));
    } catch (error) {
      console.error("Error al obtener los cadetes:", error);
    }
  };
};

export const addNewCadete = (cadete:any) => {
  return async (dispatch: Dispatch) => {
  try {
    const response = await axios.post(`${URL}/api/cadetes`, cadete);
    console.log(response);
    
    dispatch(addCadete(response.data));
  } catch (error) {
    console.error("Error al agregar el cadete:", error);
  }
}
};

export const eliminarCadete = (id: number) => {
  return async (dispatch: Dispatch) => {
  try {
    await axios.delete(`${URL}/api/cadetes/${id}`);
    dispatch(deleteCadete(id));
  } catch (error) {
    console.error("Error al eliminar el cadete:", error);
  }
}
};

export const toggleActivoCadete = (id: number, activo: boolean) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put(`${URL}/api/cadetes/${id}`, { activo });
      dispatch(updateCadete(response.data));
    } catch (error) {
      console.error('Error al actualizar el estado activo del cadete:', error);
      throw error;
    }
  }
}