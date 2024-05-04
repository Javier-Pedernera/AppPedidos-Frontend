import { useEffect, useState } from "react";
import '../../scss/components/_GestionPedidos.scss';
import { useAppDispatch, useAppSelector } from "../../Redux/Store/hooks";
import { actualizarPedidoById, obtenerPedidos } from "../../Redux/Actions/PedidosActions";
import Pedido from "../../Models/Pedido";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {  obtenerGrupos } from "../../Redux/Actions/GruposActions";
import { obtenerZonas } from "../../Redux/Actions/ZonasActions";


const GestionPedidos = () => {

  const dispatch = useAppDispatch()

  const pedidos: any = useAppSelector((state: any) => state.pedidos.pedidos);
  const gruposSelect: any = useAppSelector((state: any) => state.grupos.grupos).map((g:any) => g.id);
  const zonasSelect: any = useAppSelector((state: any) => state.zonas.zonas);
  const [pedidosMap, setPedidosMap] = useState<Pedido[] | []>([]);
  // const [filteredPedidos, setFilteredPedidos] = useState<Pedido[] | []>([]);
  const [pedidoEditado, setPedidoEditado] = useState<Pedido | null>(null);
  // const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [edicionPedido, setEdicionPedido] = useState<number | null>(null);
  const [filtros, setFiltros] = useState<{ grupo: string, fecha: string, zona: string, estado: string }>({
    grupo: '',
    fecha: '',
    zona: '',
    estado: ''
  });
  console.log("pedidos", pedidos);
useEffect(() => {
  if(pedidos.length){
    setPedidosMap(pedidos)
  }
}, [pedidos]);
  // console.log(gruposSelect);
  useEffect(() => {
    if(filtros.grupo !== '' || filtros.fecha !== '' || filtros.zona !== '' || filtros.estado !== '' ){
        setPedidosMap(filteredPedidos)
    }else{
      setPedidosMap(pedidos)
    }
  }, [filtros]);

  useEffect(() => {
    dispatch(obtenerZonas())
    dispatch(obtenerPedidos());
    dispatch(obtenerGrupos())
  }, [dispatch]);
  // console.log(pedidos);
  // console.log(pedidoSeleccionado);

  const handleVerDetallePedido = (pedido: any) => {
    console.log("ver detalle", pedido);

    // setPedidoSeleccionado(pedido);
  };
  // const handleCloseModal = () => {
  //   setPedidoSeleccionado(null);
  // };

  // Función para manejar la edición de un pedido
  const handleEditarPedido = (pedidoId: any) => {

    setEdicionPedido(pedidoId);

  };
  // Función para manejar la cancelación de un pedido
  const handleCancelarPedido = (pedidoId: any, estadoPedido: any) => {
    // console.log(pedidoId, typeof(estadoPedido.id), grupo.id);
    // console.log(grupos);
    // si deseo abrir el grupo nuevamente
    // const grupoDelpedido = grupos.find((grupoIter: any)=> grupoIter.id == grupo.id)
    // console.log("grupoDelpedido",grupoDelpedido);

    if (estadoPedido.id !== 3) {
      const pedidoCancelado = {
        id_estado: 4,
        id_grupo: null
      }
      dispatch(actualizarPedidoById(pedidoId, pedidoCancelado))

      // if(grupoDelpedido.fecha_hora_cierre){
      // const grupoSinPedido = {
      //             id_estado: 1,
      //             fecha_hora_cierre: null
      //           }
      // dispatch(editarGrupoById(grupoDelpedido.id, grupoSinPedido))
      // }
    } else {
      return "no se puede cancelar un pedido enviado"
    }

  };

  // Función para manejar el cambio de grupo de un pedido
  // const handleCambiarGrupo = (pedidoId:any) => {
  //   // onCambiarGrupo(pedidoId);
  // };
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const { value } = e.target;
    setPedidoEditado((prevState: any) => ({
      ...prevState,
      [field]: value
    }));
  };
  console.log(pedidoEditado);

  // Función para manejar la confirmación de la edición de un pedido
  const handleConfirmarEdicion = (pedidoID: any) => {
    // const pedidoID = edicionPedido?.toString()
    const Editado = {
      cliente: pedidoEditado?.cliente,
      telefono: pedidoEditado?.telefono,
      pedido_nuevo: pedidoEditado?.pedido
    }
    dispatch(actualizarPedidoById(pedidoID, Editado))

    setPedidoEditado(null);
    setEdicionPedido(null);
    // console.log("respuesta del dispatch editar pedido", res);
  };

  //cortar pedido cuando sea muy largo
  const truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    };
    return str.slice(0, num) + "...";

  }
  const handleCancelarEdicion = () => {
    setPedidoEditado(null)
    setEdicionPedido(null)
    // setPedidoSeleccionado(null)
  }
  
  // Función para filtrar la lista de pedidos
  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, filtro: string) => {
    setFiltros({
      ...filtros,
      [filtro]: e.target.value
    });
  };
  const filteredPedidos = pedidos.filter((pedido:any) => {
    return (
      (filtros.grupo === '' || pedido.grupo.id.toString() == filtros.grupo) 
      &&
      (filtros.fecha === '' || pedido.grupo.fecha_hora_creacion.split('T')[0].split('-').reverse().join('-') == filtros.fecha) &&
      (filtros.zona === '' || pedido.grupo.zona.id == filtros.zona) 
      &&
      (filtros.estado === '' || pedido.estado.nombre === filtros.estado)
    );
  });
const handleLimpiarFiltros = () =>{
  setFiltros({
    grupo: '',
    fecha: '',
    zona: '',
    estado: ''
  })
}
console.log("edicion pedido", edicionPedido);

  return (
    <div className="gestion-pedidos">
      <h2>Gestión de Pedidos</h2>
      {!edicionPedido? <div className="filtros">
        <div className="campofiltro">
          <label className={filtros.fecha !== ''? "selecc":"" }>Fecha</label>
        <input type="text" value={filtros.fecha} onChange={(e) => handleFiltroChange(e, 'fecha')} placeholder="dd-mm-yyyy" />
        </div>
        <div className="campofiltro">
          <label className={filtros.estado !== ''? "selecc":"" }>Estado</label>
        <select value={filtros.estado} onChange={(e) => handleFiltroChange(e, 'estado')}>
        <option value={''}> todos </option>
        <option value={'Abierto'}> Abierto </option>
        <option value={'Cancelado'}> Cancelado </option>
        <option value={'Enviado'}> Enviado </option>
        </select>
        </div>
        <div className="campofiltro">
          <label className={filtros.grupo !== ''? "selecc":"" }>Grupo</label>
        <select value={filtros.grupo} onChange={(e) => handleFiltroChange(e, 'grupo')}>
        <option value={''}> todos </option>
          {gruposSelect?.map((grupo:any )=> 
          <option value={grupo}> {grupo} </option>
          )}
        </select>
        </div>
        <div className="campofiltro">
          <label className={filtros.zona !== ''? "selecc":"" }>Zona</label> 
          <select value={filtros.zona} onChange={(e) => handleFiltroChange(e, 'zona')}>
        <option value={''}> todas </option>
        {zonasSelect?.map((zona:any )=> 
          <option value={zona.id}> {zona.nombre} </option>
          )}
        </select>
        </div>
        
        
        <div className="btnlimpDiv">
        <button onClick={() => handleLimpiarFiltros()} className={`btnLimpiar /div>
        ${filtros.grupo !== '' || filtros.fecha !== '' || filtros.zona !== '' || filtros.estado !== ''? "mostrar" : ""}`}>Limpiar filtros</button>
        </div>
      </div> : <div className="filtros"></div>}
      
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Pedido</th>
            <th>Estado</th>
            <th>Grupo/Zona</th>
            <th className="titulo_acc">Acciones</th>
          </tr>
        </thead>
        <tbody>
          
          {pedidosMap.length? pedidosMap.map((pedido: Pedido) => (
            <tr key={pedido.id} className={edicionPedido == pedido.id ? "trEdit" : ""}>
              <td>{pedido.grupo.fecha_hora_creacion.split('T')[0].split('-').reverse().join('-')}</td>
              <td>
                {edicionPedido == pedido.id ? (
                  <input
                    type="text"
                    value={pedidoEditado?.cliente || pedido.cliente}
                    onChange={(e) => handleEditInputChange(e, 'cliente')} />
                ) : (
                  pedido.cliente
                )}
              </td>
              <td>{pedido.direccion}</td>
              <td>
                {edicionPedido == pedido.id ? (
                  <input
                    type="text"
                    value={pedidoEditado?.telefono || pedido.telefono}
                    onChange={(e) => handleEditInputChange(e, 'telefono')} />
                ) : (
                  pedido.telefono
                )}
              </td>
              <td>
                {edicionPedido == pedido.id ? (
                  <input
                    type="text"
                    value={pedidoEditado?.pedido || pedido.pedido}
                    onChange={(e) => handleEditInputChange(e, 'pedido')} />
                ) : (
                  truncateString(pedido.pedido, 10)

                )}
                {pedido.pedido.length > 10 && edicionPedido !== pedido.id && (
                  <span className="ver-mas" onClick={(e) => { e.stopPropagation(); handleVerDetallePedido(pedido); }}>
                    Ver <AiOutlinePlusCircle />
                  </span>
                )}
              </td>

              <td>{pedido.estado.nombre}</td>
              <td>{pedido.grupo.id} / {pedido.grupo.zona.nombre}</td>
              <td className="tdBotones">
                <div className="divBtns">
                  {edicionPedido && edicionPedido == pedido.id ? (
                    <div className="divBtns">
                      <button onClick={() => handleConfirmarEdicion(pedido.id)} className="guardarBtn">Guardar</button>
                      <button onClick={() => handleCancelarEdicion()} className="CancelarCambiosBtn">No guardar</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditarPedido(pedido.id)} className={`editarBtn ${edicionPedido && edicionPedido !== pedido.id ? "noeditable" : ""}`}
                      disabled={edicionPedido !== null && edicionPedido !== pedido.id}
                    >Editar</button>
                  )}
                  {/* Preguntar si para cancelar un pedido es necesario que el grupo  no este ccerrado */}
                  {pedido.estado.id == 1 && <button disabled={edicionPedido !== null }  onClick={() => handleCancelarPedido(pedido.id, pedido.estado)} 
                  className={`cancelarBtn ${edicionPedido? "nocancelable" : ""}`}
                  >Cancelar</button>}
                </div>


              </td>
            </tr>
          )) : <div className="noHayPed">No hay coincidencias o no se crearon pedidos aún.</div> }
        </tbody>
      </table>
    </div>
  );
};

export default GestionPedidos;
