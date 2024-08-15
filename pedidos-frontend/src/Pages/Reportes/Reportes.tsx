import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    TimeScale,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../../scss/components/_reportes.scss';
import { modificarParametros, traerParametros } from '../../Redux/Actions/ParamsActions';
// import { obtenerPedidos } from '../../Redux/Actions/PedidosActions';
import {  formatLocalDateTime } from '../../utils/FormatearFechaHora';
import { write, utils } from 'xlsx';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    TimeScale
);

const Reportes= () => {
    const dispatch = useAppDispatch()
    const pedidos: any = useAppSelector((state: any) => state.pedidos.pedidos);
    const [tiempoEntregaData, setTiempoEntregaData] = useState<number[]>([]);
    const [pedidosPorCadeteData, setPedidosPorCadeteData] = useState<{ [key: string]: number }>({});
    // const [pedidosPorZonaData, setPedidosPorZonaData] = useState<{ [key: string]: number }>({});
    const maxTime = useAppSelector((state:any) => state.params.allParams).filter((p:any) => p.nombre == "MaxEsperaPorGrupo");
    const emailReport = useAppSelector((state:any) => state.params.allParams).filter((p:any)=> p.nombre == "EmailInformes");
    const horarioDeInforme = useAppSelector((state:any) => state.params.allParams).filter((p:any)=> p.nombre == "horasInformeDiario");
    const ultimoInforme = useAppSelector((state:any) => state.params.allParams).filter((p:any)=> p.nombre == "ultimoInforme");
    // console.log("horarioDeInforme",horarioDeInforme[0]?.valor);
    // console.log("ultimoInforme",ultimoInforme);
    const URL = import.meta.env.VITE_API_URL;
// formatLocalDateTime(ultimo)

// useEffect(() => {
//     dispatch(obtenerPedidos());
//     dispatch(traerParametros());

//     const intervalId = setInterval(() => {
//         const ahora = dayjs();
//         const fechaHoraArray = ultimoInforme[0]?.valor.split(/[\s,]+/);
//         const [dia, mes, anio] = fechaHoraArray[0]?.split('/');
//         const [hora, minutosInf] = fechaHoraArray[1]?.split(':');
//         const ultimaFechaInforme = dayjs(`${anio}-${mes}-${dia}T${hora}:${minutosInf}`);
//         // console.log("ultimaFechaInforme",ultimaFechaInforme);
        
//         const [horas, minutos] = horarioDeInforme[0]?.valor.split(':');
//         const horarioInforme = dayjs().set('hour', horas).set('minute', minutos);
//         if (ahora.diff(ultimaFechaInforme, 'day') && ahora.diff(ultimaFechaInforme, 'hour') >= 24 && ahora.diff(ultimaFechaInforme, 'minute') >= 5 && ahora.isAfter(horarioInforme, 'minute') && ahora.isAfter(horarioInforme, 'hour')) {
//             console.log("se envia email");
//             sendEmail();
//         }
//     }, 10000);

//     return () => clearInterval(intervalId);
// }, [dispatch]);

    useEffect(() => {
        
        if (pedidos.length) {
            analizarDatos(pedidos);
        }
    }, [pedidos]);

    const analizarDatos = (pedidos: any[]) => {
        const tiempoEntrega: number[] = [];
        const pedidosPorCadete: { [key: string]: number } = {};
        const pedidosPorZona: { [key: string]: number } = {};

        pedidos.forEach((pedido) => {
            const fechaCreacion = dayjs(pedido.grupo.fecha_hora_creacion);
            const fechaEnvio = dayjs(pedido.grupo.fecha_hora_envio);
            const duracion = fechaEnvio.diff(fechaCreacion, 'minutes');
            tiempoEntrega.push(duracion);

            const cadete = pedido.grupo.cadete?.nombre;
            if (pedidosPorCadete[cadete]) {
                pedidosPorCadete[cadete]++;
            } else {
                pedidosPorCadete[cadete] = 1;
            }

            const zona = pedido.grupo.zona.nombre;
            if (pedidosPorZona[zona]) {
                pedidosPorZona[zona]++;
            } else {
                pedidosPorZona[zona] = 1;
            }
        });

        setTiempoEntregaData(tiempoEntrega);
        setPedidosPorCadeteData(pedidosPorCadete);
        // setPedidosPorZonaData(pedidosPorZona);
    };

    const tiempoEntregaChartData = {
        labels: pedidos.map((
            // pedido: any,
             index: any) => `Pedido ${index.pedido + 1}`),        
        datasets: [
            {
                label: 'Minutos desde la creación hasta el envío',
                data: tiempoEntregaData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const pedidosPorCadeteChartData = {
        labels: Object.keys(pedidosPorCadeteData),
        datasets: [
            {
                label: 'Número de pedidos enviados por cadete',
                data: Object.values(pedidosPorCadeteData),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const sendEmail = async () => {
       const tiempoLimitante = dayjs().subtract(24, 'hour');
       const pedidosUltimas24Horas = await pedidos.filter((pedido: any) => {
        const fechaCreacion = dayjs(pedido.grupo.fecha_hora_creacion);
        return fechaCreacion.isAfter(tiempoLimitante);
    });
    console.log("antes",pedidosUltimas24Horas);
    
    await pedidosUltimas24Horas.sort((a:any, b:any) => {
        const fechaCreacionA:any = dayjs(a.grupo.fecha_hora_creacion);
        const fechaCreacionB:any = dayjs(b.grupo.fecha_hora_creacion);
        return fechaCreacionA - fechaCreacionB;
    });
    console.log("despues",pedidosUltimas24Horas);
    
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
        cadete: pedido.grupo.cadete?.nombre,
    }));
    //    const ultimoInformaformateada = formatLocalDateTime(ultimoInforme[0].valor)
        // console.log("ultimoInformaformateada", ultimoInformaformateada);
        console.log("pedidosTransformados",pedidosTransformados);

        const fechaLocal = dayjs().format('D/M/YYYY, H:mm');
        // console.log("fecha a formatear",fechaLocal, typeof fechaLocal);
        await dispatch( modificarParametros(ultimoInforme[0].id, fechaLocal));
        dispatch(traerParametros());
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
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
    };

    return (
        <div className="reportes">
            <div className='div_tit_btns'>
            <h2>Reportes</h2>
            <div className="buttonsContainer">
                        {/* <button className='exportarBtn' onClick={exportToExcel}>Exportar a Excel</button> */}
                      <div className='btnInfHs'>
                        <button className='exportarBtn' onClick={()=>sendEmail()}>Enviar por correo electrónico</button>
                        <div>Próximo informe: {horarioDeInforme[0]?.valor}hs</div>
                      </div>
                        
                    </div>
            </div>
            
            <Tabs>
                <TabList>
                    <Tab>Tiempos de Pedidos y Estados</Tab>
                    {/* <Tab>Pedidos por Cadete</Tab> */}
                    {/* <Tab>Pedidos por Zona</Tab> */}
                    <Tab>Gráficos</Tab>
                </TabList>
                <TabPanel>
                    <div className="table-container">
                        <h3>Tiempos de Pedidos y Estados</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Pedido</th>
                                    <th>Zona</th>
                                    <th>Cliente</th>
                                    <th>Fecha de Creación</th>
                                    <th>Fecha de Envío</th>
                                    <th>Cadete</th>
                                    <th>Duración (minutos)</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((pedido: any) => (
                                    <tr key={pedido.id}>
                                        <td>{pedido.id}</td>
                                        <td>{pedido.pedido}</td>
                                        <td>{pedido.grupo.zona.nombre }</td>
                                        <td>{pedido.cliente}</td>
                                        <td>{formatLocalDateTime(pedido.grupo.fecha_hora_creacion)}</td>
                                        <td>{formatLocalDateTime(pedido.grupo.fecha_hora_envio)}</td>
                                        <td>{pedido.grupo.cadete? pedido.grupo.cadete.nombre : 'sin cadete asignado'}</td>
                                        <td className={dayjs(pedido.grupo.fecha_hora_envio).diff(dayjs(pedido.grupo.fecha_hora_creacion), 'minutes') > maxTime[0]?.valor? "tiempoexcedido":""}>{dayjs(pedido.grupo.fecha_hora_envio).diff(dayjs(pedido.grupo.fecha_hora_creacion), 'minutes')}</td>
                                        <td>{pedido.estado.nombre}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>                    
                </TabPanel>
                <TabPanel>
                    <div className="chart-container">
                        <h3>Tiempo de entrega de pedidos</h3>
                        <Line data={tiempoEntregaChartData} />
                    </div>
                    <div className="chart-container">
                        <h3>Número de pedidos enviados por cadete</h3>
                        <Bar data={pedidosPorCadeteChartData} />
                    </div>
                </TabPanel>
            </Tabs>
            
        </div>
    );
};

export default Reportes;
