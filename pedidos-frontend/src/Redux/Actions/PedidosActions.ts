import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { actualizarPedido, agregarPedido, eliminarPedido, getAllPedidos } from './PedidosSlice';

const URL = import.meta.env.VITE_API_URL;

const obtenerPedidos = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${URL}/api/pedidos`);
      const pedidos = response.data;

      dispatch(getAllPedidos(pedidos));
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
    }
  };
};

const crearPedido = (pedido: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${URL}/api/pedidos`, pedido);
      console.log('Respuesta de crear pedido', response.data);

      dispatch(agregarPedido(response.data));
    } catch (error) {
      console.error('Error al agregar pedido:', error);
    }
  };
};

const eliminarPedidoById = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.delete(`${URL}/api/pedidos/${id}`);
      console.log(response);
      dispatch(eliminarPedido(id));
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };
};

const actualizarPedidoById = (id: any, pedido: any) => {
  return async (dispatch: Dispatch) => {
    try {
      console.log('Id pedido, pedido:', id, pedido);
const response = await axios.put(`${URL}/api/pedidos/${id}`, pedido);
      const responseDispatch = dispatch(actualizarPedido(response.data));
      console.log('Respuesta del dispatch actualizar pedido', response.data, responseDispatch);
      
      console.log(response);
    } catch (error) {
      console.error('Error al editar el pedido:', error);
    }
  };
};

export { obtenerPedidos, crearPedido, eliminarPedidoById, actualizarPedidoById };
