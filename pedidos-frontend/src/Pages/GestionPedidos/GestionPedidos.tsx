import { useEffect, useState } from "react";
import '../../scss/components/_GestionPedidos.scss';
import { useAppDispatch, useAppSelector } from "../../Redux/Store/hooks";
import { actualizarPedidoById, obtenerPedidos } from "../../Redux/Actions/PedidosActions";
import Pedido from "../../Models/Pedido";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { obtenerGrupos } from "../../Redux/Actions/GruposActions";
import { obtenerZonas } from "../../Redux/Actions/ZonasActions";
import DetallePedido from "../../Components/DetallePedido/detallepedido";
import Swal from "sweetalert2";
import PedidoDescripcion from "../../Components/PedidoDescripcion/PedidoDescripcion";
import { formatLocalDateTime } from "../../utils/FormatearFechaHora";


const GestionPedidos = () => {

  const dispatch = useAppDispatch()

  const pedidos: any = useAppSelector((state: any) => state.pedidos.pedidos);
  const gruposSelect: any = useAppSelector((state: any) => state.grupos.grupos);
  const zonasSelect: any = useAppSelector((state: any) => state.zonas.zonas);
  const [pedidosMap, setPedidosMap] = useState<Pedido[] | []>([]);
  // const [filteredPedidos, setFilteredPedidos] = useState<Pedido[] | []>([]);
  const [pedidoEditado, setPedidoEditado] = useState<Pedido | null>(null);
  // const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [edicionPedido, setEdicionPedido] = useState<number | null>(null);
  const [descripcionPedido, setDescripcionPedido] = useState<string>("");
  const [detallesPedido, setdetallesPedido] = useState<any>({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalDescripcionOpen, setModalDescripcionOpen] = useState<boolean>(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number |undefined> ( undefined );
  // console.log(pedidos);
  
  const [filtros, setFiltros] = useState<{ grupo: string, fechaDesde: string, fechaHasta: string, zona: string, estado: string, pedido:string }>({
    grupo: '',
    fechaDesde: '',
    fechaHasta: '',
    zona: '',
    estado: '',
    pedido: ''
  });
  // console.log("pedidos", pedidos);
  // Función para abrir el modal
  const handleVerDetallePedido = (descripcion: string) => {
    setDescripcionPedido(descripcion);
    setModalOpen(true);
  };
// console.log("grupos abiertos", gruposSelect.filter((g:any)=> g.estado.nombre == "Abierto"));

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalDescripcionOpen(false);
  };
  useEffect(() => {
    if (pedidos.length) {
      setPedidosMap(pedidos)
    }
  }, [pedidos]);
  // console.log(gruposSelect);
  useEffect(() => {
    if (filtros.grupo !== '' || filtros.fechaDesde !== '' || filtros.fechaHasta !== '' || filtros.zona !== '' || filtros.estado !== '' || filtros.pedido !== '') {
      setPedidosMap(filteredPedidos)
    } else {
      setPedidosMap(pedidos)
    }
  }, [filtros]);

  useEffect(() => {
    dispatch(obtenerZonas())
    dispatch(obtenerPedidos());
    dispatch(obtenerGrupos())
  }, [dispatch, modalOpen]);

  // Función para manejar la edición de un pedido
  const handleEditarPedido = (pedidoId: any) => {

    setEdicionPedido(pedidoId);

  };
  // Función para manejar cómo cancelar un pedido
  const handleCancelarPedido = (pedidoId: any, estadoPedido: any) => {
    // si deseo abrir el grupo nuevamente
    // const grupoDelpedido = grupos.find((grupoIter: any)=> grupoIter.id == grupo.id)
    // console.log("grupoDelpedido",grupoDelpedido);
    if (estadoPedido.id !== 3) {
      const pedidoCancelado = {
        id_estado: 4,
        id_grupo: null
      }
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas cancelar el pedido?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--secundary-color)',
        cancelButtonColor: 'var(--primary-color)',
        confirmButtonText: 'Sí, cancelar pedido',
        cancelButtonText: 'No cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(actualizarPedidoById(pedidoId, pedidoCancelado))
          Swal.fire(
            'Cancelado',
            'El pedido fue cancelado!',
            'success'
          );
        }
      });
      

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
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    const { value } = e.target;
    if (field === 'grupo') {
      // console.log(value);
      setGrupoSeleccionado(parseInt(value));
    } else {
      setPedidoEditado((prevState: any) => ({
        ...prevState,
        [field]: value
      }));
    }
  };
  // console.log(pedidoEditado);
  // console.log(grupoSeleccionado);
  
  // Función para manejar la confirmación de la edición de un pedido
  const handleConfirmarEdicion = (pedidoID: any) => {
    // const pedidoID = edicionPedido?.toString()
    const Editado = {
      id_grupo:grupoSeleccionado,
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
  function formatDateToISO(dateString: string): string {
    const [day, month, year] = dateString.split('/').map(Number);
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${year}-${formattedMonth}-${formattedDay}`;
}
  // Función para filtrar la lista de pedidos
  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, filtro: string) => {
    setFiltros({
      ...filtros,
      [filtro]: e.target.value
    });
  };
  const filteredPedidos = pedidos.filter((pedido: any) => {
    const creacion = formatLocalDateTime(pedido.grupo.fecha_hora_creacion).split(',')[0]
    const fechaFormateada = formatDateToISO(creacion);
    const fechaCreacionPedido = new Date(fechaFormateada);
    const fechaDesde = filtros.fechaDesde !== '' ? new Date(filtros.fechaDesde) : null;
    const fechaHasta = filtros.fechaHasta !== '' ? new Date(filtros.fechaHasta) : null;
//     console.log("fechacreacionbase de datos",creacion);
// console.log("fechacreacionbase desde",fechaDesde);
// console.log("fechacreacionbase hasta",fechaHasta);
    return (
      (filtros.grupo === '' || pedido.grupo.id.toString() == filtros.grupo)
      &&
      (!fechaDesde || fechaCreacionPedido >= fechaDesde) &&
    (!fechaHasta || fechaCreacionPedido <= fechaHasta) &&
      (filtros.zona === '' || pedido.grupo.zona.id == filtros.zona)
      &&
      (filtros.estado === '' || pedido.estado.nombre === filtros.estado)&&
      (filtros.pedido === '' || pedido.pedido.toLowerCase().includes(filtros.pedido.toLowerCase()))
    );
  });
  console.log(filteredPedidos);
  
  const handleLimpiarFiltros = () => {
    setFiltros({
      grupo: '',
      fechaDesde: '',
      fechaHasta: '',
      zona: '',
      estado: '',
      pedido:''
    })
  }
  const handleDescripcionPedido = (pedido:Pedido) => {
    setModalDescripcionOpen(!modalDescripcionOpen)
    setdetallesPedido(pedido)
  }
  // console.log("pedido en filtros", pedidos);
  // console.log("pedido en filtros", filtros.pedido);

  return (
    <div className="gestion-pedidos">
      <h2>Gestión de Pedidos</h2>
      {!edicionPedido ? <div className="filtros">
        <div className="campofiltro">
          <label>Fecha Desde</label>
          <input type="date" value={filtros.fechaDesde} onChange={(e) => handleFiltroChange(e, 'fechaDesde')} />
        </div>
        <div className="campofiltro">
          <label>Fecha Hasta</label>
          <input type="date" value={filtros.fechaHasta} onChange={(e) => handleFiltroChange(e, 'fechaHasta')} />
        </div>
        <div className="campofiltro">
          <label className={filtros.estado !== '' ? "selecc" : ""}>Estado</label>
          <select value={filtros.estado} onChange={(e) => handleFiltroChange(e, 'estado')}>
            <option value={''}> todos </option>
            <option value={'Abierto'}> Abierto </option>
            <option value={'Cancelado'}> Cancelado </option>
            <option value={'Enviado'}> Enviado </option>
          </select>
        </div>
        <div className="campofiltro">
            <label className={filtros.grupo !== '' ? "selecc" : ""}>Grupo</label>
            <input
              type="text"
              value={filtros.grupo}
              onChange={(e) => handleFiltroChange(e, 'grupo')}
              placeholder="Filtrar por grupo"
            />
          </div>
          <div className="campofiltro">
            <label className={filtros.pedido !== '' ? "selecc" : ""}>Pedido</label>
            <input
              type="text"
              value={filtros.pedido}
              onChange={(e) => handleFiltroChange(e, 'pedido')}
              placeholder="Buscar por pedido"
            />
          </div>
        <div className="campofiltro">
          <label className={filtros.zona !== '' ? "selecc" : ""}>Zona</label>
          <select value={filtros.zona} onChange={(e) => handleFiltroChange(e, 'zona')}>
            <option value={''}> todas </option>
            {zonasSelect?.map((zona: any) =>
              <option value={zona.id}> {zona.nombre} </option>
            )}
          </select>
        </div>


        <div className="btnlimpDiv">
          <button onClick={() => handleLimpiarFiltros()} className={`btnLimpiar /div>
        ${filtros.grupo !== '' || filtros.fechaDesde !== '' || filtros.fechaHasta !== '' || filtros.zona !== '' || filtros.estado !== '' ? "mostrar" : ""}`}>Limpiar filtros</button>
        </div>
      </div> : <div className="filtros"></div>}

      <table>
        <thead>
          <tr>
            <th>Fecha y hora</th>
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

          {pedidosMap.length ? pedidosMap.map((pedido: Pedido) => (
            <tr key={pedido.id} className={edicionPedido == pedido.id ? "trEdit" : ""}>
              <td>{formatLocalDateTime(pedido.grupo.fecha_hora_creacion)}hs</td>
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
                  <span className="ver-mas" onClick={(e) => { e.stopPropagation(); handleVerDetallePedido(pedido.pedido) }}>
                    Ver <AiOutlinePlusCircle />
                  </span>
                )}

              </td>

              <td>{pedido.estado.nombre}</td>
              <td>
                {edicionPedido === pedido.id ? (
                  <div className="grupoSelect">
                    <label>Grupo:</label>
                    <select value={grupoSeleccionado} onChange={(e) => handleEditInputChange(e, 'grupo')}>
                      <option value="">Seleccionar grupo</option>
                      {gruposSelect.filter((g: any) => g.estado.nombre === "Abierto").length ? gruposSelect.filter((g: any) => g.estado.nombre == "Abierto").map((grupo: any) => (
                        <option key={grupo.id} value={grupo.id}>
                          {grupo.id}/ {grupo.zona.nombre}
                        </option>
                      )) : <option  value="">No hay otros grupos abiertos</option>}
                    </select>
                  </div>
                ) : (
                  // Mostrar nombre del grupo y zona si no se está editando
                  <div className="divgrupoestado">
                    <span>
                      {pedido.grupo.id} / {pedido.grupo.zona.nombre}
                    </span>
                      {pedido.grupo.estado.nombre == "Cerrado"? <span className="grupoCerradomsj">Grupo cerrado</span> : ''}
                  </div>
                )}
              </td>
              <td className="tdBotones">
                <div className={edicionPedido ? "divBtnsEdit" : "divBtns"}>
                  {edicionPedido ? <div></div> : <button onClick={() =>handleDescripcionPedido(pedido)} className="verBtn">Ver +</button>
                  }
                  {edicionPedido && edicionPedido == pedido.id ? (
                    <div className="divBtnsEdit">
                      <button onClick={() => handleConfirmarEdicion(pedido.id)} className="guardarBtn">Guardar</button>
                      <button onClick={() => handleCancelarEdicion()} className="CancelarCambiosBtn">No guardar</button>
                    </div>
                  ) : (
                    pedido.estado.nombre !== "Abierto" ? <div className="finaliz"> pedido finalizado</div> : <button
                      onClick={() => handleEditarPedido(pedido.id)} className={`editarBtn ${edicionPedido && edicionPedido !== pedido.id ? "noeditable" : ""}`}
                      disabled={edicionPedido !== null && edicionPedido !== pedido.id}
                    >Editar</button>

                  )}

                  {/* Preguntar si para cancelar un pedido es necesario que el grupo  no este ccerrado */}
                  {pedido.estado.id == 1 && <button disabled={edicionPedido !== null} onClick={() => handleCancelarPedido(pedido.id, pedido.estado)}
                    className={`cancelarBtn ${edicionPedido ? "nocancelable" : ""}`}
                  >Cancelar</button>}
                </div>


              </td>
            </tr>
          )) : <div className="noHayPed">No hay coincidencias o no se crearon pedidos aún.</div>}
        </tbody>
        {modalOpen && (
          <div className="detallePedido">
            <DetallePedido
              descripcion={descripcionPedido}
              onClose={handleCloseModal}
            />
          </div>
        )}
        {modalDescripcionOpen && (
          <div className="detallePedido">
            <PedidoDescripcion
              pedido={detallesPedido}
              onClose={handleCloseModal}
            />
          </div>
        )}
      </table>
    </div>
  );
};

export default GestionPedidos;
