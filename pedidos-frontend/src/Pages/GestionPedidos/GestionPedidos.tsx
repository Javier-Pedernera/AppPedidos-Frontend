import { useEffect, useState } from "react";
import '../../scss/components/_GestionPedidos.scss';
import { useAppDispatch, useAppSelector } from "../../Redux/Store/hooks";
import { actualizarPedidoById, obtenerPedidos } from "../../Redux/Actions/PedidosActions";
import Pedido from "../../Models/Pedido";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { editarGrupoById, obtenerGrupos } from "../../Redux/Actions/GruposActions";


const GestionPedidos = () => {

  const dispatch = useAppDispatch()

  const pedidos: any = useAppSelector((state: any) => state.pedidos.pedidos);
  const grupos: any = useAppSelector((state: any) => state.grupos.grupos);
  const [pedidoEditado, setPedidoEditado] = useState<Pedido | null>(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [edicionPedido, setEdicionPedido] = useState<number | null>(null);

console.log("edicionPedido",edicionPedido);

  useEffect(() => {
   dispatch(obtenerPedidos());
   dispatch(obtenerGrupos())
  }, [dispatch]);
  console.log(pedidos);
  console.log(pedidoSeleccionado);
  
  const handleVerDetallePedido = (pedido: any) => {
    console.log("ver detalle", pedido);
    
    setPedidoSeleccionado(pedido);
  };
  // const handleCloseModal = () => {
  //   setPedidoSeleccionado(null);
  // };

  // Función para manejar la edición de un pedido
  const handleEditarPedido = (pedidoId:any) => {
  
     setEdicionPedido(pedidoId );
 
  };

  // Función para manejar la cancelación de un pedido
  const handleCancelarPedido = (pedidoId:any, estadoPedido: any, grupo:any) => {
    console.log(pedidoId, typeof(estadoPedido.id), grupo.id);
    console.log(grupos);
    
const grupoDelpedido = grupos.find((grupoIter: any)=> grupoIter.id == grupo.id)
console.log("grupoDelpedido",grupoDelpedido);

    if(estadoPedido.id !== 3 ){
      const pedidoCancelado ={
            id_estado: 4,
            id_grupo: null
          }
          dispatch(actualizarPedidoById(pedidoId, pedidoCancelado))
          
          if(grupoDelpedido.fecha_hora_cierre){
          const grupoSinPedido = {
                      id_estado: 1,
                      fecha_hora_cierre: null
                    }
                    dispatch(editarGrupoById(grupoDelpedido.id, grupoSinPedido))
          }
    }else{
      return "no se puede cancelar un pedido enviado"
    }
    
  };

  // Función para manejar el cambio de grupo de un pedido
  // const handleCambiarGrupo = (pedidoId:any) => {
  //   // onCambiarGrupo(pedidoId);
  // };
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const { value } = e.target;
    setPedidoEditado((prevState:any) => ({
      ...prevState,
      [field]: value
    }));
  };
  console.log(pedidoEditado);
  
  // Función para manejar la confirmación de la edición de un pedido
  const handleConfirmarEdicion = (pedidoID:any) => {
  // const pedidoID = edicionPedido?.toString()
  const Editado = {
    cliente: pedidoEditado?.cliente,
    telefono: pedidoEditado?.telefono,
    pedido_nuevo: pedidoEditado?.pedido
  }
   const res= dispatch(actualizarPedidoById(pedidoID , Editado))
    setPedidoEditado(null);
    setEdicionPedido(null);
    console.log("respuesta del dispatch editar pedido", res);
  };

//cortar pedido cuando sea muy largo
const truncateString = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
    };
  return str.slice(0, num) + "...";

}

  return (
    <div className="gestion-pedidos">
      <h2>Gestión de Pedidos</h2>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Pedido</th>
            <th>Estado</th>
            <th className="titulo_acc">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido:Pedido) => (
            <tr key={pedido.id}>
              <td>
                {edicionPedido == pedido.id ? (
                  <input 
                  type="text" 
                  value={pedidoEditado?.cliente || pedido.cliente}
                  onChange={(e) => handleEditInputChange(e, 'cliente')}  />
                ) : (
                  pedido.cliente
                )}
              </td>
              <td>{pedido.direccion}</td>
              <td>
                {edicionPedido == pedido.id? (
                  <input 
                  type="text" 
                  value={pedidoEditado?.telefono || pedido.telefono}
                  onChange={(e) => handleEditInputChange(e, 'telefono')} />
                ) : (
                  pedido.telefono
                )}
              </td>
              <td>
                {edicionPedido == pedido.id? (
                  <input 
                  type="text" 
                  value={pedidoEditado?.pedido || pedido.pedido} 
                  onChange={(e) => handleEditInputChange(e, 'pedido')}/>
                ) : (
                  truncateString(pedido.pedido, 10)
                  
                )}
                {pedido.pedido.length > 10 && edicionPedido !== pedido.id && (
                  <span className="ver-mas" onClick={(e) => {e.stopPropagation(); handleVerDetallePedido(pedido);}}>
                    Ver <AiOutlinePlusCircle />
                  </span>
                )}
              </td>
              
              <td>{pedido.estado.nombre}</td>
              
              <td className="tdBotones">
                {edicionPedido && edicionPedido == pedido.id  ? (
                  <button onClick={() => handleConfirmarEdicion(pedido.id)} className="guardarBtn">Guardar cambios</button>
                ) : (
                  <button 
                  onClick={() => handleEditarPedido(pedido.id)} className="editarBtn"
                  disabled= {edicionPedido !==null && edicionPedido !== pedido.id}
                  >Editar</button>
                )}
                
                {pedido.estado.id == 1 && <button onClick={() => handleCancelarPedido(pedido.id, pedido.estado, pedido.grupo)} className="cancelarBtn">Cancelar</button>}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal o componente de edición de pedido */}
    
    </div>
  );
};

export default GestionPedidos;
