import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { crearParametros, modificarParametros, traerParametros } from '../../Redux/Actions/ParamsActions';
import { ParamsModel } from '../../Models/Params';
import '../../scss/components/_Params.scss';
import Swal from 'sweetalert2';
// import { formatLocalDateTime } from '../../utils/FormatearFechaHora';
// parametros disponibles para la app
const nombresParametros = ['MaxPedidosPorGrupo', 'MaxEsperaPorGrupo', 'Ciudad','EmailInformes', 'horasInformeDiario'];

const Params = () => {
  const dispatch = useAppDispatch();
  const [valorParametro, setValorParametro] = useState('');
  const params = useAppSelector((state: any) => state.params.allParams);
  const nombresDisponibles = nombresParametros.filter(nombre => !params.find((param:any) => param.nombre === nombre));
  const [nombreSeleccionado, setNombreSeleccionado] = useState(nombresDisponibles[0]);
  const [paramEdit, setParamEdit] = useState<{ id: number, valor: string } | null>(null);
  // Obtener valores de los parámetros del estado global
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }});

console.log("nombresDisponibles",  nombresDisponibles );
console.log(nombreSeleccionado);

  useEffect(() => {
    dispatch(traerParametros());
  }, [dispatch]);
console.log("a enviar",paramEdit);
useEffect(() => {
    setNombreSeleccionado(nombresDisponibles[0])
  }, [nombresDisponibles]);

  const handleCrearParametro = () => {
    dispatch(crearParametros({ nombre: nombreSeleccionado, valor: valorParametro }));
    setValorParametro('');
  };

  const handleModificarParametro = async () => {

    console.log(valorParametro);
     
  const res = await dispatch(modificarParametros(paramEdit?.id, valorParametro))
    if(res?.status == 200){
      Toast.fire({
        icon: "success",
        title: "Parametro editado exitosamente"
      });
      setValorParametro('');
      setParamEdit(null);
    }else{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudo modificar el parámetro"
      });
      setValorParametro('');
      setParamEdit(null);
    }
  
    
    
  };
  
  const handleCancelarModificarParametro = ( ) => {
    setValorParametro('');
      setParamEdit(null);
  }
  // const handleEliminarParametro = (id: number) => {
  //   Swal.fire({
  //     title: '¿Estás seguro?',
  //     text: '¿Estás seguro de eliminar este parámetro?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: 'var(--secundary-color)',
  //     cancelButtonColor: 'var(--primary-color)',
  //     confirmButtonText: 'Sí, eliminar',
  //     cancelButtonText: 'Cancelar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       dispatch(eliminarParametros(id));
  //       Swal.fire(
  //         'Eliminado',
  //         'El parámetro ha sido eliminado.',
  //         'success'
  //       );
  //     }
  //   });
  // };

  return (
    <div className="params-container">
      <div className="params-content">
        <h2>Configuración de Parámetros</h2>
        <div className="params-list">
          <table>
            <thead>
              <tr>
                <th className='nombreTit'>Nombre</th>
                <th>Valor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {params.map((parametro: ParamsModel) => (
                <tr key={parametro.id}>
                  <td>
                  {parametro.nombre == "Ciudad" ? "Ciudad":"" }
                  {parametro.nombre == "MaxEsperaPorGrupo" ? "Tiempo de espera max. por grupo":"" }
                  {parametro.nombre == "MaxPedidosPorGrupo" ? "Pedidos max. por grupo":"" }
                  {parametro.nombre == "EmailInformes" ? "Email para informes":"" }
                  {parametro.nombre == "horasInformeDiario" ? "Horario de informes diarios":"" }
                  {parametro.nombre == "ultimoInforme" ? "Fecha del último informe":"" }                     
                    </td>
                  <td>
                  {paramEdit?.id == parametro.id ? (
                      <input placeholder={`valor ${parametro.nombre == "horasInformeDiario"? "en formato hh:mm":"" }${parametro.nombre == "MaxEsperaPorGrupo"? "en minutos":"" }`} 
                      type="text" 
                      value={valorParametro} 
                      onChange={(e) => setValorParametro(e.target.value)} />
                    ) : (
                      `${parametro.nombre !== "ultimoInforme"? parametro.valor : parametro.valor  } ${parametro.nombre == "MaxEsperaPorGrupo"? "min":"" } ${parametro.nombre == "horasInformeDiario"? "hs":"" } `
                    )}
                    </td>
                  <td>
                    {paramEdit?.id == parametro.id ? (
                      <div className='divbtnsEdit'>
                         <button className='btnParamsGdr' onClick={handleModificarParametro}>Guardar</button>
                      <button className='btnParamsClr' onClick={handleCancelarModificarParametro}>Cancelar</button>
                      </div>
                     
                    ) : (
                      parametro.nombre !== "ultimoInforme" ?
                        <button className='btnParams' onClick={() => setParamEdit({ id: parametro.id, valor: parametro.valor })}>Editar</button>:
                        <div></div>
                    )}
                    {/* <button className='btnParamseliminar' onClick={() => handleEliminarParametro(parametro.id)}>Eliminar</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {
          nombresDisponibles.length > 0?  <div className="params-form">
          <select value={nombreSeleccionado} onChange={(e) => setNombreSeleccionado(e.target.value)}>
            { nombresDisponibles.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder={"valor"}
            value={valorParametro}
            onChange={(e) => setValorParametro(e.target.value)}
          />
          <button className='btnParams' onClick={handleCrearParametro} disabled={nombresDisponibles.length == 0? true: false } >Crear Parámetro</button>
        </div>: <div>No puedes crear más parámetros</div> 
        }
        
      </div>
    </div>
  );
};

export default Params;
