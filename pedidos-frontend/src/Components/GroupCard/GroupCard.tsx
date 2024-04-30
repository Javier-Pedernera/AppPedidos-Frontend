import '../../scss/components/_GroupCard.scss';
import openBox from '../../assets/iconos/openBox.svg';
import closeBox from '../../assets/iconos/ClosedBox.svg';
import { GrupoGet } from '../../Models/GrupoGet';
import { useEffect, useState } from 'react';
import calcularMinutosTranscurridos from '../../utils/TiempoTranscurrido';
import Swal from 'sweetalert2';
// import { useAppDispatch } from '../../Redux/Store/hooks';
// import { editarGrupoById } from '../../Redux/Actions/GruposActions';
import { formatLocalDateTime } from '../../utils/FormatearFechaHora';

interface GroupCardProps {
  group: GrupoGet;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {

const [tiempo, setTiempo] = useState(0);
// const dispatch = useAppDispatch()
useEffect(() => {
 const tiempoTranscurrido =  calcularMinutosTranscurridos(group.fecha_hora_creacion);
  setTiempo(tiempoTranscurrido)
}, []);

const handleCloseGroup = () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres cerrar este grupo de forma manual?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar grupo',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const fechaHoraActual = new Date();
      const fechaHoraCierre = fechaHoraActual.toISOString();
      console.log("fechaHoraCierre", fechaHoraCierre);
      
      // dispatch(editarGrupoById(group.id, {fecha_hora_cierre:fechaHoraActual, id_estado: 2}))
      Swal.fire('¡Grupo cerrado!', '', 'success');
    }
  });
};

const handleSendGroup = () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres enviar este grupo?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, enviar grupo',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      
      Swal.fire('¡Grupo enviado!', '', 'success');
    }
  });
};
  
// console.log(group);

  return (
    <div className={`group-card ${group.estado.id == 1 ? 'open' : 'closed'}`}>

      <div className='divtitle'>
        <h3>Grupo {group.id}</h3>
       
        {!group.fecha_hora_cierre ? <img src={openBox} className='iconoBox' alt="" /> :
          <img src={closeBox} className='iconoBox' alt="" />}
      </div>
      <p>
  Zona: <span className="valor">{group.zona.nombre}</span>
</p>
<p>
  Cantidad de Pedidos: <span className="valor">{group.pedidos?.length}</span>
</p>
<p>
    Creado: <span className="valor">{ formatLocalDateTime(group.fecha_hora_creacion )}</span>
  </p> 

<p>
  Tiempo transcurrido: <span className="valor">{tiempo} min</span>
</p>
{group.fecha_hora_cierre ?
  <p>
    Tiempo desde que se cerró: <span className="valor">{ formatLocalDateTime(group.fecha_hora_cierre) }</span>
  </p> 
  : <p></p>
}
      <div className='contBtn'>
        {!group.fecha_hora_cierre ? <button className="close-group-btn" onClick={handleCloseGroup} >Cerrar Grupo</button> : <button className="enviar-group-btn" onClick={handleSendGroup} >Enviar</button> }

      </div>

    </div>
  );
};

export default GroupCard;