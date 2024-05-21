import { useEffect, useState } from 'react';
import '../../scss/components/_Dashboard.scss';
import GroupCard from '../../Components/GroupCard/GroupCard';
import { FaEye, FaList } from 'react-icons/fa';
import CustomButton2 from '../../Components/Button2/CustomButton2';
import PedidoModal from '../../Components/PedidoModal/PedidoModal';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { obtenerZonas } from '../../Redux/Actions/ZonasActions';
import {  traerParametros } from '../../Redux/Actions/ParamsActions';
import { obtenerGrupos } from '../../Redux/Actions/GruposActions';
import { GrupoGet } from '../../Models/GrupoGet';
// import useEmailSender from '../../utils/enviosEmail';
// import { obtenerPedidos } from '../../Redux/Actions/PedidosActions';
// import dayjs from 'dayjs';
// import Swal from 'sweetalert2';

// Componente Dashboard con ejemplo de datos
const Dashboard = () => {

  const grupos: GrupoGet[] = useAppSelector((state: any) => state.grupos.grupos);
  const [showOnlyOpenGroups, setShowOnlyOpenGroups] = useState(true);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  // const filteredGroups = showOnlyOpenGroups ? groups.filter(group => group.fecha_hora_cierre !== null) : groups;
  const filteredGroups = showOnlyOpenGroups ? grupos.filter(group => group.fecha_hora_envio == null) : grupos;
//  const pedidos = useAppSelector((state) => state.pedidos.pedidos);
//     const emailReport = useAppSelector((state:any) => state.params.allParams).filter((p:any)=> p.nombre == "EmailInformes");
  const dispatch = useAppDispatch()
  // const horarioDeInforme = useAppSelector((state:any) => state.params.allParams).filter((p:any)=> p.nombre == "horasInformeDiario");
  // const ultimoInforme = useAppSelector((state:any) => state.params.allParams).filter((p:any)=> p.nombre == "ultimoInforme");
////////////////////
// console.log(horarioDeInforme);
// console.log(ultimoInforme);
  // useEffect(() => {
  //       dispatch(obtenerPedidos());
  //       // dispatch(traerParametros());
  //       if(horarioDeInforme && ultimoInforme){

  //         const intervalId = setInterval(() => {
  
  //             const ahora = dayjs();
  //             const [horas, minutos] = horarioDeInforme[0]?.valor.split(':');
  //             const horarioInforme = dayjs().set('hour', horas).set('minute', minutos).set('second', 0);
              
  //             const fechaHoraArray = ultimoInforme[0]?.valor.split(/[\s,]+/);
  //             const [dia, mes, anio] = fechaHoraArray[0]?.split('/');
  //             const [hora, minutosInf] = fechaHoraArray[1]?.split(':');
  //             const ultimaFechaInforme = dayjs(`${anio}-${mes}-${dia}T${hora}:${minutosInf}`);
  //             console.log("dia", dia);
  //             // Verifica si la hora y los minutos coinciden con el horario de informe
  //             const esHoraDeInforme = ahora.isSame(horarioInforme, 'minute');
  //             console.log("esHoraDeInforme",esHoraDeInforme);
  //             // Verifica si es un dia diferente desde el último informe
  //             const esElMismoDia = ahora.isSame(ultimaFechaInforme, 'day');
  //             console.log("haPasadoUnDia",esElMismoDia);
  //             console.log("diferencia horas",ahora.diff(ultimaFechaInforme, 'hour'))
  //             console.log("diferencia dia",ahora.diff(ultimaFechaInforme, 'day'))
  //             if (esHoraDeInforme && !esElMismoDia) {
  //               useEmailSender(pedidos, emailReport).then(
  //                 (response)=>{
  //                   // console.log("respuesta de la  funcion enviar email",response);
  //                   // console.log("id del ultimo informe",ultimoInforme[0].id);
  //               dispatch( modificarParametros(ultimoInforme[0].id,response));
  //               Swal.fire('¡Informe diario enviado correctamente!', '', 'success');
  //                 }
  //               )
                
               
  //               dispatch(traerParametros)
  //             }
  //         }, 60000);

  //         return () => clearInterval(intervalId);
  //       }
  //   }, [dispatch]);


    ///////////////////////////////////////////
  useEffect(() => {
    dispatch(traerParametros())
  }, []);
  useEffect(() => {
    dispatch(obtenerGrupos())
    dispatch(obtenerZonas())
  }, [showPedidoModal]);

  const handleCrearPedido = () => {
    setShowPedidoModal(true);
  };

  const handleClosePedidoModal = () => {
    setShowPedidoModal(false);
  };
// console.log("grupos filtrados o no",filteredGroups);

  // const createNewGroup = () => {
  // }

  const toggleShowOnlyOpenGroups = () => {
    setShowOnlyOpenGroups(!showOnlyOpenGroups);
  };
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        {/* <CustomButton2 onClick={createNewGroup}
          titulo="crear grupo"
          color1="var(--greenSoft-color)"
          color2="var(--greenSoft-color)"
          disabled={false} /> */}
        <CustomButton2 onClick={handleCrearPedido}
          titulo="crear pedido"
          color1="var(--primary-color)"
          color2="var(--primary-color)"
          disabled={false} />

        <button className="toggle-btn" onClick={toggleShowOnlyOpenGroups}>
          {showOnlyOpenGroups ? <FaEye /> : <FaList />}
          {showOnlyOpenGroups ? 'Ver Todos los Grupos' : 'Ver Solo Grupos Activos'}
        </button>
      </div>
      <div className="group-cards">
        {filteredGroups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
      {showPedidoModal && <PedidoModal onClose={handleClosePedidoModal} />}
    </div>
  );
};
export default Dashboard;
