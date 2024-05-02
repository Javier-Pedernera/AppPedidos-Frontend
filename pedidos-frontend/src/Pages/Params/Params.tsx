import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { crearParametros, eliminarParametros, modificarParametros, traerParametros } from '../../Redux/Actions/ParamsActions';
import { ParamsModel } from '../../Models/Params';
import '../../scss/components/_Params.scss';
import Swal from 'sweetalert2';

// parametros disponibles para la app
const nombresParametros = ['MaxPedidosPorGrupo', 'MaxEsperaPorGrupo', 'Ciudad'];

const Params = () => {
  const dispatch = useAppDispatch();
  const [valorParametro, setValorParametro] = useState('');
  const params = useAppSelector((state: any) => state.params.allParams);
  const nombresDisponibles = nombresParametros.filter(nombre => !params.find((param:any) => param.nombre === nombre));
  const [nombreSeleccionado, setNombreSeleccionado] = useState(nombresDisponibles[0]);

  // Obtener valores de los parámetros del estado global
  
console.log("nombresDisponibles",  nombresDisponibles );
console.log(nombreSeleccionado);

  useEffect(() => {
    dispatch(traerParametros());
  }, [dispatch]);
console.log("a enviar",{ nombre: nombreSeleccionado, valor: valorParametro });
useEffect(() => {
    setNombreSeleccionado(nombresDisponibles[0])
  }, [nombresDisponibles]);

  const handleCrearParametro = () => {
    dispatch(crearParametros({ nombre: nombreSeleccionado, valor: valorParametro }));
    setValorParametro('');
  };

  const handleModificarParametro = (id: number, valor: string) => {
    const nuevoValor = prompt(`Modificar valor de ${nombreSeleccionado}:`, valor);
    if (nuevoValor !== null) {
      dispatch(modificarParametros({ id, valor: nuevoValor }));
    }
  };

  const handleEliminarParametro = (id: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de eliminar este parámetro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--secundary-color)',
      cancelButtonColor: 'var(--primary-color)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(eliminarParametros(id));
        Swal.fire(
          'Eliminado',
          'El parámetro ha sido eliminado.',
          'success'
        );
      }
    });
  };

  return (
    <div className="params-container">
      <div className="params-content">
        <h2>Configuración de Parámetros</h2>
        <div className="params-list">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Valor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {params.map((parametro: ParamsModel) => (
                <tr key={parametro.id}>
                  <td>{parametro.nombre}</td>
                  <td>{parametro.valor}</td>
                  <td>
                    <button className='btnParams' onClick={() => handleModificarParametro(parametro.id, parametro.valor)}>Modificar</button>
                    <button className='btnParamseliminar' onClick={() => handleEliminarParametro(parametro.id)}>Eliminar</button>
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
