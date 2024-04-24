import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import Zona from "../../Models/Zona";
import { actualizarZona, agregarZona, eliminarZona, getAll } from "./ZonasSlice";




const URL = import.meta.env.VITE_API_URL
const obtenerZonas = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/api/zonas`);
      const zonas = response.data;

      dispatch(getAll(zonas));
    } catch (error) {
      console.error("Error al obtener las zonas:", error);
    }
  };
};

const agregarZonas = (zona: Zona) => {
  return async (dispatch: Dispatch) => {
    try {
      // Dispatch la acción para agregar las zonas al estado
      dispatch(agregarZona(zona));
    } catch (error) {
      console.error("Error al agregar las zonas:", error);
    }
  };
};

const eliminarZonaById = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      let id_numero = parseInt(id);
      const response = await axios.delete(`${URL}/api/zonas/${id}`);
      console.log(response);
      dispatch(eliminarZona(id_numero));
    } catch (error) {
      console.error("Error al eliminar la zona:", error);
    }
  };
};


const editarZonaById = (id: number, Zone:any) => {
  return async (dispatch: Dispatch) => {
    try {
      console.log("idLayer, layerCoord",id, Zone);
      
      const responseDispatch = dispatch(actualizarZona(Zone));
      console.log(" respuesta del dispatch",responseDispatch);
      const response = await axios.put(`${URL}/api/zonas/${id}`,Zone);
      console.log(response);
      
    } catch (error) {
      console.error("Error al editar la zona:", error);
    }
  };
};

export { obtenerZonas, agregarZonas, eliminarZonaById, editarZonaById };
