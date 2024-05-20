import React from "react";
import '../../scss/components/_pedidoDetalle.scss';
import Pedido from "../../Models/Pedido";
import { formatLocalDateTime } from "../../utils/FormatearFechaHora";

interface DetallePedidoProps {
    pedido: Pedido;
  onClose: () => void;
}

const PedidoDescripcion: React.FC<DetallePedidoProps> = ({ pedido, onClose }) => {
    console.log(pedido);
    
    return (
      <div className="detalle-pedido-modal__overlay">
        <div className="detalle-pedido-modal__content">
          <button className="detalle-pedido-modal__close-btn" onClick={onClose}>
            &times;
          </button>
          <h2 className="detalle-pedido-modal__title">Detalle del Pedido</h2>
          <div className="detalle-pedido-modal__info">
          <div className="detalle-pedido-modal__info-item">
              <strong>ID:</strong> {pedido.id}
            </div>
            <div className="detalle-pedido-modal__info-item">
              <strong>Cliente:</strong> {pedido.cliente}
            </div>
            <div className="detalle-pedido-modal__info-item">
              <strong>Dirección:</strong> {pedido.direccion}
            </div>
            <div className="detalle-pedido-modal__info-item">
              <strong>Teléfono:</strong> {pedido.telefono}
            </div>
            <div className="detalle-pedido-modal__info-item">
              <strong>Pedido:</strong> {pedido.pedido}
            </div>
            <div className="detalle-pedido-modal__info-item">
              <strong>Estado:</strong> {pedido.estado.nombre}
            </div>
            <div className="detalle-pedido-modal__info-item">
              <strong>Cadete:</strong> {pedido.grupo.cadete.nombre? pedido.grupo.cadete.nombre : "-"}
            </div>
            <div className="detalle-pedido-modal__info-item">
              <strong>Fecha y hora de creación:</strong> {formatLocalDateTime(pedido.grupo.fecha_hora_creacion) }
            </div>
            <div className="detalle-pedido-modal__info-item">
              <strong>Fecha y hora de envío:</strong> {pedido.grupo.fecha_hora_envio? formatLocalDateTime(pedido.grupo.fecha_hora_envio):"-"}
            </div>
            <div className="detalle-pedido-modal__info-item">
              <strong>Zona:</strong> {pedido.grupo.zona.nombre}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default PedidoDescripcion;
