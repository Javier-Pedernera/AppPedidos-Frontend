import React, { useEffect, useState } from 'react';
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
import { useAppSelector } from '../../Redux/Store/hooks';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../../scss/components/_reportes.scss';

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

const Reportes: React.FC = () => {
    const pedidos: any = useAppSelector((state: any) => state.pedidos.pedidos);
    const [tiempoEntregaData, setTiempoEntregaData] = useState<number[]>([]);
    const [pedidosPorCadeteData, setPedidosPorCadeteData] = useState<{ [key: string]: number }>({});
    const [pedidosPorZonaData, setPedidosPorZonaData] = useState<{ [key: string]: number }>({});
    console.log(pedidosPorZonaData);
    
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
            const duracion = fechaEnvio.diff(fechaCreacion, 'hour');
            tiempoEntrega.push(duracion);

            const cadete = pedido.grupo.cadete.nombre;
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
        setPedidosPorZonaData(pedidosPorZona);
    };

    const tiempoEntregaChartData = {
        labels: pedidos.map((
            // pedido: any,
             index: number) => `Pedido ${index + 1}`),        
        datasets: [
            {
                label: 'Horas desde la creación hasta la entrega',
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

    return (
        <div className="reportes">
            <h2>Reportes</h2>
            <Tabs>
                <TabList>
                    <Tab>Pedidos por Cadete</Tab>
                    <Tab>Tiempos de Pedidos y Estados</Tab>
                    <Tab>Pedidos por Zona</Tab>
                    <Tab>Gráficos</Tab>
                </TabList>

                <TabPanel>
                    <div className="table-container">
                        <h3>Pedidos por Cadete</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Dirección</th>
                                    <th>Fecha de Creación</th>
                                    <th>Fecha de Envío</th>
                                    <th>Duración (Horas)</th>
                                    <th>Cadete</th>
                                    <th>Estado</th>
                                    <th>Zona</th>
                                    <th>Pedido</th>
                                    <th>Teléfono</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((pedido: any) => (
                                    <tr key={pedido.id}>
                                        <td>{pedido.id}</td>
                                        <td>{pedido.cliente}</td>
                                        <td>{pedido.direccion}</td>
                                        <td>{dayjs(pedido.grupo.fecha_hora_creacion).format('YYYY-MM-DD HH:mm')}</td>
                                        <td>{dayjs(pedido.grupo.fecha_hora_envio).format('YYYY-MM-DD HH:mm')}</td>
                                        <td>{dayjs(pedido.grupo.fecha_hora_envio).diff(dayjs(pedido.grupo.fecha_hora_creacion), 'hour')}</td>
                                        <td>{pedido.grupo.cadete.nombre}</td>
                                        <td>{pedido.estado.nombre}</td>
                                        <td>{pedido.grupo.zona.nombre}</td>
                                        <td>{pedido.pedido}</td>
                                        <td>{pedido.telefono}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className="table-container">
                        <h3>Tiempos de Pedidos y Estados</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Fecha de Creación</th>
                                    <th>Fecha de Envío</th>
                                    <th>Duración (Horas)</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((pedido: any) => (
                                    <tr key={pedido.id}>
                                        <td>{pedido.id}</td>
                                        <td>{pedido.cliente}</td>
                                        <td>{dayjs(pedido.grupo.fecha_hora_creacion).format('YYYY-MM-DD HH:mm')}</td>
                                        <td>{dayjs(pedido.grupo.fecha_hora_envio).format('YYYY-MM-DD HH:mm')}</td>
                                        <td>{dayjs(pedido.grupo.fecha_hora_envio).diff(dayjs(pedido.grupo.fecha_hora_creacion), 'hour')}</td>
                                        <td>{pedido.estado.nombre}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className="table-container">
                        <h3>Pedidos por Zona</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Dirección</th>
                                    <th>Zona</th>
                                    <th>Pedido</th>
                                    <th>Teléfono</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((pedido: any) => (
                                    <tr key={pedido.id}>
                                        <td>{pedido.id}</td>
                                        <td>{pedido.cliente}</td>
                                        <td>{pedido.direccion}</td>
                                        <td>{pedido.grupo.zona.nombre}</td>
                                        <td>{pedido.pedido}</td>
                                        <td>{pedido.telefono}</td>
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
