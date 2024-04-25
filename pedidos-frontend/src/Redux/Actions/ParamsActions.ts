import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { deleteParams, getAllParams, setParams } from "./ParamsSlice";

const URL = import.meta.env.VITE_API_URL;

const traerParametros = ( ) => {
    return async (dispatch: Dispatch) => {
      try {
        // Aquí realizarías la petición al backend para crear los parámetros
      //   console.log("Parámetros creados:", maxTiempoEspera, maxPedidos);
        const response = await axios.get(`${URL}/api/parametros`);
        console.log(response);
        
        // Despachar la acción para actualizar el estado global con los nuevos parámetros
        dispatch(getAllParams(response.data));
      } catch (error) {
        console.error("Error al crear los parámetros:", error);
      }
    };
  };

const crearParametros = (paramsData:any) => {
  return async (dispatch: Dispatch) => {
    try {
      console.log("Parámetros creados:", paramsData);
      const response = await axios.post(`${URL}/api/parametros`, paramsData);
      console.log(response);
      
      dispatch(setParams(response.data));
    } catch (error) {
      console.error("Error al crear los parámetros:", error);
    }
  };
};
const modificarParametros = (paramsData:any) => {
    return async (dispatch: Dispatch) => {
      try {
        // Aquí realizarías la petición al backend para crear los parámetros
      //   console.log("Parámetros creados:", maxTiempoEspera, maxPedidos);
        const response = await axios.post(`${URL}/api/parametros`, paramsData);
        console.log(response);
        
        // Despachar la acción para actualizar el estado global con los nuevos parámetros
        dispatch(setParams(response));
      } catch (error) {
        console.error("Error al crear los parámetros:", error);
      }
    };
  };
  const eliminarParametros = (id:number) => {
    return async (dispatch: Dispatch) => {
      try {
        // Aquí realizarías la petición al backend para crear los parámetros
      //   console.log("Parámetros creados:", maxTiempoEspera, maxPedidos);
        const response = await axios.delete(`${URL}/api/parametros/${id}`);
        console.log(response);
        dispatch(deleteParams(id));
      } catch (error) {
        console.error("Error al crear los parámetros:", error);
      }
    };
  };

export { crearParametros, traerParametros, modificarParametros, eliminarParametros };