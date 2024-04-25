import '../../scss/components/_GroupCard.scss';
import openBox from '../../assets/iconos/openBox.svg';
import closeBox from '../../assets/iconos/closeBox.svg';
import { Group } from '../../Models/Group';

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const handleCloseGroup = () => {
    // Aquí puedes agregar la lógica para cerrar el grupo
  };

  return (
    <div className={`group-card ${group.id_estado === 1 ? 'open' : 'closed'}`}>

      <div className='divtitle'>
        <h3>Grupo {group.id}</h3>
        {group.fecha_hora_cierre? <img src={openBox} className='iconoBox' alt="" />:
        <img src={closeBox} className='iconoBox' alt="" />}
      </div>
      
      <p>Cantidad de Pedidos: 
        {/* {group.ordersCount} */}
        3
      </p>
      <p>Tiempo desde que se creó: {group.fecha_hora_creacion.toLocaleString()}</p>
      { group.fecha_hora_cierre?
      <p>
        Tiempo desde que se cerró: {group.fecha_hora_cierre.toLocaleString()}
        </p>: <p></p>
    }
        
      <div className='contBtn'>
       { group.fecha_hora_cierre? <button className="close-group-btn" onClick={handleCloseGroup} disabled={group.id_estado !== 1}>Cerrar Grupo</button>: <div></div> }
         
      </div>
     
    </div>
  );
};

export default GroupCard;