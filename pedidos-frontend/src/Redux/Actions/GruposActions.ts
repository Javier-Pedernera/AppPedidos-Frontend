import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import {getAllGrupos, agregarGrupo, eliminarGrupo, actualizarGrupo } from "./GruposSlice";
import { GrupoGet } from "../../Models/GrupoGet";
// import { Grupo } from "../../Models/Grupo";

const URL = import.meta.env.VITE_API_URL
const obtenerGrupos = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/api/grupos-con-pedidos`);
      const grupos = response.data;

      dispatch(getAllGrupos(grupos));
    } catch (error) {
      console.error("Error al obtener los grupos:", error);
    }
  };
};

const crearGrupo = (grupo: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${URL}/api/grupos-pedidos`, grupo);
      console.log("resp crear grupo", response.data);
      
      const grupoCreado: GrupoGet = response.data;

      dispatch(agregarGrupo(grupoCreado));
      
      return grupoCreado; 
    } catch (error) {
      console.error("Error al agregar grupo:", error);
      throw error; 
    }
  };
};

const eliminarGrupoById = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      let id_numero = parseInt(id);
      const response = await axios.delete(`${URL}/api/grupos-pedidos/${id}`);
      console.log(response);
      dispatch(eliminarGrupo(id_numero));
    } catch (error) {
      console.error("Error al eliminar el grupo:", error);
    }
  };
};


const editarGrupoById = (id: number, Grupo:any) => {
  return async (dispatch: Dispatch) => {
    try {
      console.log("idLayer, layerCoord",id, Grupo);
      const response = await axios.put(`${URL}/api/grupos-pedidos/${id}`,Grupo);

      console.log("respuesta del backend",response);
      const responseDispatch = dispatch(actualizarGrupo(response.data));
      console.log(" respuesta del dispatch",responseDispatch);
      
      
      
    } catch (error) {
      console.error("Error al editar la zona:", error);
    }
  };
};

export { obtenerGrupos, crearGrupo, eliminarGrupoById, editarGrupoById };
