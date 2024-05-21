// import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { write, utils } from 'xlsx';
import { formatLocalDateTime } from './FormatearFechaHora';

const useEmailSender = async (pedidos:any, emailReport:any) => {
  
    const URL = import.meta.env.VITE_API_URL;

    const tiempoLimitante = dayjs().subtract(24, 'hour');
    const pedidosUltimas24Horas = await pedidos.filter((pedido: any) => {
     const fechaCreacion = dayjs(pedido.grupo.fecha_hora_creacion);
     return fechaCreacion.isAfter(tiempoLimitante);
 });
 await pedidosUltimas24Horas.sort((a:any, b:any) => {
     const fechaCreacionA:any = dayjs(a.grupo.fecha_hora_creacion);
     const fechaCreacionB:any = dayjs(b.grupo.fecha_hora_creacion);
     return fechaCreacionA - fechaCreacionB;
 });
 
 const pedidosTransformados = pedidosUltimas24Horas.map((pedido: any) => ({
     id: pedido.id,
     pedido: pedido.pedido,
     abierto:  formatLocalDateTime(pedido.grupo.fecha_hora_creacion),
     cerrado: formatLocalDateTime(pedido.grupo.fecha_hora_cierre),
     enviado: formatLocalDateTime(pedido.grupo.fecha_hora_envio),
     duración_min: dayjs(pedido.grupo.fecha_hora_envio).diff(dayjs(pedido.grupo.fecha_hora_creacion),'minutes'),
     estado: pedido.estado.nombre,
     cliente: pedido.cliente,
     dirección: pedido.direccion,
     zona: pedido.grupo.zona.nombre,
     cadete: pedido.grupo.cadete.nombre,
 }));

     const fechaLocal = dayjs().format('D/M/YYYY, H:mm');
     const wb = utils.book_new();
     const ws = utils.json_to_sheet(pedidosTransformados);
     utils.book_append_sheet(wb, ws, 'Pedidos');
     const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
     const excelBlob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
     const file = new File([excelBlob], "reporte_pedidos.xlsx", { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
     const formData = new FormData();
     formData.append('file', file);
     formData.append('sender_email', emailReport[0]?.valor);
     formData.append('receiver_email', emailReport[0]?.valor);
     formData.append('subject', "Reportes");
     formData.append('body', "Se envían los reportes del último día");
 
     try {
         const response = await axios.post(`${URL}/api/send_excel`, formData, {
             headers: {
                 'Content-Type': 'multipart/form-data'
             }
         });

         console.log('Correo electrónico enviado con éxito:', response.data);
         return  fechaLocal
       
     } catch (error) {
         console.error('Error al enviar el correo electrónico:', error);
         return 'Error al enviar el correo electrónico'
     }

};

export default useEmailSender;









