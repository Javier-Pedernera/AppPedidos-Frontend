import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import Zona from "../../Models/Zona";
import { agregarZona, eliminarZona, getAll } from "./ZonasSlice";




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

const eliminarZonaById = (id: number) => {
  return async (dispatch: Dispatch) => {
    try {
      // Aquí realizarías la lógica para eliminar una zona por su ID
      // Por ejemplo, haciendo una solicitud DELETE al backend
      await axios.delete(`/api/zonas/${id}`);

      // Dispatch la acción para eliminar la zona del estado por su ID
      dispatch(eliminarZona(id));
    } catch (error) {
      console.error("Error al eliminar la zona:", error);
    }
  };
};

// Otras funciones para manejar acciones relacionadas con las zonas...

export { obtenerZonas, agregarZonas, eliminarZonaById };
