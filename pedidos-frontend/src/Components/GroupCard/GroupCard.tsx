import '../../scss/components/_GroupCard.scss';
import openBox from '../../assets/iconos/openBoxYellow.svg';
import closeBox from '../../assets/iconos/ClosedBox.svg';
import BoxShipped from '../../assets/iconos/BoxShipped.svg';
import { GrupoGet } from '../../Models/GrupoGet';
import { useEffect, useState } from 'react';
import calcularMinutosTranscurridos from '../../utils/TiempoTranscurrido';
import Swal from 'sweetalert2';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { editarGrupoById } from '../../Redux/Actions/GruposActions';
import { formatDatabaseDateTime, formatLocalDateTime } from '../../utils/FormatearFechaHora';
import calcularMinutosHastaCierre from '../../utils/TiempoHastaCierre';
import { fetchCadetes } from '../../Redux/Actions/CadetesActions';
import { actualizarPedidoById } from '../../Redux/Actions/PedidosActions';
import Pedido from '../../Models/Pedido';


interface GroupCardProps {
  group: GrupoGet;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {

const [tiempo, setTiempo] = useState(0);
const [tiempoTotal, setTiempoTotal] = useState(0);
const [pedidosActivos, setPedidosActivos] = useState<Pedido[]>([]);
const [params, setParams] = useState({maxPedidos: 0,maxEspera:0 });
const dispatch = useAppDispatch();
const cadetes = useAppSelector((state:any) => state.cadetes.cadetes).filter((cadete:any) => cadete.activo == true);
const parametros = useAppSelector((state:any) => state.params.allParams);
const grupos = useAppSelector((state:any) => state.grupos.grupos);
// console.log(group.id, "pedidosActivos", pedidosActivos);
useEffect(() => {
  if(group){
    const pedidos = group.pedidos?.filter( p => p.estado.id !== 4);
    setPedidosActivos(pedidos)
  }
}, [grupos, group, dispatch]);
useEffect(() => {
  if(parametros){
    const maxPedidos = parametros.find((p:any)=> p.nombre == "MaxPedidosPorGrupo")?.valor
    const maxEspera = parametros.find((p:any)=> p.nombre == "MaxEsperaPorGrupo")?.valor
    setParams({maxPedidos: parseInt(maxPedidos) ,maxEspera: parseInt(maxEspera)})
  }
}, []);
useEffect(() => {
  dispatch(fetchCadetes())

    const tiempoTranscurrido = calcularMinutosHastaCierre(group.fecha_hora_creacion, group.fecha_hora_cierre)
    setTiempo(tiempoTranscurrido)
 
    const tiempoTranscurridoTotal = calcularMinutosTranscurridos(group.fecha_hora_creacion);
  setTiempoTotal(tiempoTranscurridoTotal)
  
}, [grupos, group, dispatch]);

console.log(tiempoTotal);
// console.log(tiempo);

useEffect(() => {
  const intervalId = setInterval(() => {
    const tiempoTranscurridoTotal = calcularMinutosTranscurridos(group.fecha_hora_creacion);
    setTiempoTotal(tiempoTranscurridoTotal);
  }, 10000);

  return () => clearInterval(intervalId);
}, [group.fecha_hora_creacion]);


const handleCloseGroup = () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres cerrar este grupo de forma manual?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar grupo',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if(!pedidosActivos.length){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No puedes cerrar un grupo sin pedidos"
        });
      }else{
        if (result.isConfirmed) {      
         const fechaHoraCierre = formatDatabaseDateTime();      
      dispatch(editarGrupoById(group.id, {fecha_hora_cierre:fechaHoraCierre, id_estado: 2}))
      // dispatch(obtenerGrupos())
      Swal.fire('¡Grupo cerrado!', '', 'success');
    }
      }
    
  });
};

const handleSendGroup = () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres enviar este grupo de pedidos?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, enviar pedidos',
    cancelButtonText: 'Cancelar',
    showCloseButton: true,
    html: `
      <div>
        <p>Selecciona un cadete:</p>
        <select id="cadetesSelect"></select>
      </div>
    `,
    didOpen: async () => {
      try {
        const select = Swal.getHtmlContainer()?.querySelector('#cadetesSelect') as HTMLSelectElement;
        if (cadetes.length > 0) {
          cadetes.forEach((cadete: any )=> {
            const option = document.createElement('option');
            option.text = cadete.nombre;
            option.value = cadete.id.toString();
            select.add(option);
          });
        } else {
          const option = document.createElement('option');
          option.text = 'No hay cadetes disponibles';
          option.disabled = true;
          select.add(option);
        }
      } catch (error) {
        console.error('Error al obtener la lista de cadetes:', error);
      }
    }
  }).then((result) => {
    if(!pedidosActivos?.length){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No puedes enviar un grupo sin pedidos"
      });
    }else{
      if (result.isConfirmed) {
      const fecha = formatDatabaseDateTime()
      const cadeteId = (document.getElementById('cadetesSelect') as HTMLSelectElement).value;
      // console.log("cadeteId para enviar",cadeteId);
      
      const grupoEdit = {
        fecha_hora_envio: fecha,
        id_estado: 3, // el 3 es el estado enviado
        id_cadete: cadeteId
      }
      const pedidoEdit = {
        id_estado: 3
      }
      dispatch(editarGrupoById(group.id, grupoEdit)) // actualizo grupo
      group.pedidos?.forEach(pedido => {
    dispatch(actualizarPedidoById(pedido.id, pedidoEdit)); // actuaizo pedido
  });
      Swal.fire('¡Informe diario enviado correctamente!', '', 'success');
    }
    }
  });
};
// console.log(group, pedidosActivos?.length);
// console.log("tiepmo y max ped",tiempoTotal, parametros[1].valor.split(' ')[0]);

  return (
    <div className={`group-card ${group.estado.id == 1 ? `open ${ pedidosActivos?.length && group.estado.nombre !== "Enviado" && tiempoTotal > params.maxEspera ?"tiempoSuperado":""}`: `closed ${ pedidosActivos?.length && group.estado.nombre == "Cerrado"?"EnviarPedido":""}`}`}>
      <div className='divtitle'>
        <h3>{`Grupo #${group.id}`}</h3>
        <p></p>
        {!group.fecha_hora_cierre && <div className='boxestado'><img src={openBox} className='iconoBox' alt="" /> <span className="valor">{group.estado.nombre}</span></div> }
        { group.fecha_hora_cierre && !group.fecha_hora_envio &&  <div className='boxestado'><img src={closeBox} className='iconoBox' alt="" />
          <span className="valor">{group.estado.nombre}</span></div>}
          { group.fecha_hora_cierre && group.fecha_hora_envio &&  <div className='boxestado'><img src={BoxShipped} className='iconoBox' alt="" />
          <span className="valor">{group.estado.nombre}</span></div>}
      </div>
      <p>
  Zona: <span className="valor">{group.zona.nombre}</span>
</p>
<p>
  Cantidad de Pedidos: <span className="valor">{pedidosActivos?.length}</span>
</p>
<p>
    Creado: <span className="valor">{ formatLocalDateTime(group.fecha_hora_creacion )}</span>
  </p> 

<p>
  Tiempo transcurrido: {pedidosActivos?.length? <span className="valor">{tiempo ? tiempo : tiempoTotal} min</span> : <span>0 min</span> } 
</p>
{group.fecha_hora_cierre ?
  <p>
    Cerrado: <span className="valor">{ formatLocalDateTime(group.fecha_hora_cierre) }</span>
  </p> 
  : <p></p>
}
      <div className='contBtn'>
        {!group.fecha_hora_cierre && <button className="close-group-btn" onClick={handleCloseGroup} >Cerrar Grupo</button>   }
        {group.fecha_hora_cierre && !group.fecha_hora_envio && <button className="enviar-group-btn" onClick={handleSendGroup} >Enviar</button> }
      
      </div>
     
<div className='maxEspera' > 
<span className={`espera ${ pedidosActivos?.length && group.estado.nombre == "Cerrado" ? "listoenviar": ""} `}>*Pedido listo para enviar.</span> 
<span className={`espera ${ pedidosActivos?.length && group.estado.nombre !== "Enviado"&& group.estado.nombre == "Abierto" && tiempoTotal > params.maxEspera ? "superada": ""} `}>*Superó el tiempo máximo de espera.</span> 
</div>

    </div>
  );
};

export default GroupCard;