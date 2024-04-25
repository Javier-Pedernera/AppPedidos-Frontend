import { useEffect, useState } from 'react';
import '../../scss/components/_Dashboard.scss';
import GroupCard from '../../Components/GroupCard/GroupCard';
import { FaEye, FaList } from 'react-icons/fa';
import CustomButton2 from '../../Components/Button2/CustomButton2';
import { Group } from '../../Models/Group';
import PedidoModal from '../../Components/PedidoModal/PedidoModal';
import { useAppDispatch } from '../../Redux/Store/hooks';
import { obtenerZonas } from '../../Redux/Actions/ZonasActions';

// import Swal from 'sweetalert2';
// import { useAppDispatch } from '../../Redux/Store/hooks';

const exampleGroups: Group[] = [
  {
    id: 1,
    id_zona: 1,
    fecha_hora_creacion: new Date("2024-04-16T09:00:00"),
    fecha_hora_cierre: null,
    fecha_hora_envio: null,
    id_estado: 1,
    id_cadete: 1,
  },
  {
    id: 2,
    id_zona: 2,
    fecha_hora_creacion: new Date("2024-04-16T10:30:00"),
    fecha_hora_cierre: null,
    fecha_hora_envio: null,
    id_estado: 1,
    id_cadete: 2,
  },
  {
    id: 3,
    id_zona: 1,
    fecha_hora_creacion: new Date("2024-04-16T11:45:00"),
    fecha_hora_cierre: null,
    fecha_hora_envio: null,
    id_estado: 1,
    id_cadete: 3,
  },
  {
    id: 4,
    id_zona: 1,
    fecha_hora_creacion: new Date("2024-04-16T09:00:00"),
    fecha_hora_cierre: new Date("2024-04-16T12:00:00"),
    fecha_hora_envio: null,
    id_estado: 1,
    id_cadete: 1,
  },
  {
    id: 5,
    id_zona: 2,
    fecha_hora_creacion: new Date("2024-04-16T10:30:00"),
    fecha_hora_cierre: new Date("2024-04-16T13:30:00"),
    fecha_hora_envio: null,
    id_estado: 1,
    id_cadete: 2,
  },
];

// "coordinates": [-64.495, -31.417]
const pedido: Pedido = {
  id_grupo: 1,
  direccion: "123 Calle Falsa, Ciudad Ficticia",
  latitud: -64.495,
  longitud: -31.417,
   id_estado: 1 
}

// Componente Dashboard con ejemplo de datos
const Dashboard = () => {
  const [groups, setGroups] = useState<Group[]>(exampleGroups);
  const [showOnlyOpenGroups, setShowOnlyOpenGroups] = useState(false);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const filteredGroups = showOnlyOpenGroups ? groups.filter(group => group.fecha_hora_cierre !== null) : groups;
 
  // console.log("grupos",groups);
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(obtenerZonas())

  }, []);
  // console.log("grupos fitrados",filtro);
console.log(showPedidoModal);

  const handleCrearPedido = () => {
    setShowPedidoModal(true);
};

const handleClosePedidoModal = () => {
    setShowPedidoModal(false);
};

  const createNewGroup = () => {

    // (async () => {
    //     const { value: formValues } = await Swal.fire({
    //       heightAuto: false,
    //       title: "Create grupo",
    //       html: `
    //               <input  placeholder ="project's name" id="swal-input1" class="swal2-input"><textarea placeholder ="description..." id="swal-text" class="swal2-textarea"></textarea>
    //             `,
    //       focusConfirm: false,
    //       preConfirm: () => {
    //         const name = document.getElementById("swal-input1") as HTMLInputElement;
    //         const description = document.getElementById("swal-text") as HTMLInputElement;
    //         if (name && description) {
    //           return [name.value, description.value];
    //         }
    //         return null;
    //       }
    //     });
    //     // console.log(formValues);
    //     const data: GrupoCreate = {
    //       name: formValues[0] ? formValues[0] : "",
    //       creator_id: userActive.userData && 'id' in userActive.userData ? userActive.userData.id : "",
    //       description: formValues[1] ? formValues[1] : ""
    //     }
    //     const response = await dispatch(createGrupo(data));
    //     // console.log("data al dispatch",data);
    //     // console.log("respuesta",response);
    //     if (response?.status == 200) {
    //       dispatch(getProjectsUser(userActive.userData && 'id' in userActive.userData ? userActive.userData.id : "User  id"));
    //       Swal.fire({ heightAuto: false, title: `The ${formValues[0]} project was created successfully` });
    //     } else {
    //       Swal.fire({
    //         heightAuto: false,
    //         icon: "error",
    //         title: "Oops...",
    //         text: "Something went wrong!",
    //         // footer: '<a href="#">Try again...</a>'
    //       });
    //     }
    //   })()

    //////////////////////////////////////
    const newGroup: Group = {
      id: groups.length + 1,
      id_zona: 1,
      fecha_hora_creacion: new Date(),
      id_estado: 1,
      id_cadete: 1,
    };
    setGroups([...groups, newGroup]);
  };

  const createNewOrder = () => {
    // Lógica para crear un nuevo pedido
  };
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
        disabled={false}/>

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
