import { useEffect, useState } from 'react';
import '../../scss/components/_Dashboard.scss';
import GroupCard from '../../Components/GroupCard/GroupCard';
import { FaEye, FaList } from 'react-icons/fa';
import CustomButton2 from '../../Components/Button2/CustomButton2';
import PedidoModal from '../../Components/PedidoModal/PedidoModal';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { obtenerZonas } from '../../Redux/Actions/ZonasActions';
import { traerParametros } from '../../Redux/Actions/ParamsActions';
import { obtenerGrupos } from '../../Redux/Actions/GruposActions';
import { GrupoGet } from '../../Models/GrupoGet';

// Componente Dashboard con ejemplo de datos
const Dashboard = () => {

  const grupos: GrupoGet[] = useAppSelector((state: any) => state.grupos.grupos);

  // const [groups, setGroups] = useState<Grupo[]>(exampleGroups);
  const [showOnlyOpenGroups, setShowOnlyOpenGroups] = useState(true);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  // const filteredGroups = showOnlyOpenGroups ? groups.filter(group => group.fecha_hora_cierre !== null) : groups;

  const filteredGroups = showOnlyOpenGroups ? grupos.filter(group => group.fecha_hora_envio == null) : grupos;
  // console.log("grupos",groups);
  const dispatch = useAppDispatch()
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

  const createNewGroup = () => {
  }

  const toggleShowOnlyOpenGroups = () => {
    setShowOnlyOpenGroups(!showOnlyOpenGroups);
  };
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <CustomButton2 onClick={createNewGroup}
          titulo="crear grupo"
          color1="var(--greenSoft-color)"
          color2="var(--greenSoft-color)"
          disabled={false} />
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
