import { useEffect } from 'react';
import { Cadete } from '../../Models/Cadete';
import { useAppDispatch } from '../../Redux/Store/hooks';
import { useSelector } from 'react-redux';
import { addNewCadete, eliminarCadete, fetchCadetes, toggleActivoCadete } from '../../Redux/Actions/CadetesActions';
import '../../scss/components/_Cadetes.scss';
import Swal from 'sweetalert2';

const Cadetes = () => {
    const dispatch = useAppDispatch();
    const cadetes = useSelector((state:any) => state.cadetes.cadetes);
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      
    useEffect(() => {
      dispatch(fetchCadetes());
    }, [dispatch]);
  
    const handleDeleteCadete = (id: number) => {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este cadete?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--secundary-color)',
        cancelButtonColor: 'var(--primary-color)',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(eliminarCadete(id));
          Swal.fire(
            'Eliminado',
            'El parámetro ha sido eliminado.',
            'success'
          );
        }
      });
      
    };

    const handleToggleActivo = (id: number, activo: boolean) => {
      dispatch(toggleActivoCadete( id, activo= !activo ));
    };
    const handleCrearCadete = () => {
        Swal.fire({
          title: 'Agregar cadete',
          confirmButtonText: 'Crear',
          html:
            '<input id="nombre" className="swal2-input" placeholder="Nombre">'+
            '<input id="telefono" className="swal2-input" placeholder="Teléfono">',
          focusConfirm: false,
          preConfirm: () => {
            const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
            const telefono = (document.getElementById('telefono') as HTMLInputElement).value;
            console.log(nombre);
      
            dispatch(addNewCadete({ nombre, activo: true, telefono }))
          }
        }).then((result) => {
          if (result.isConfirmed) {
            Toast.fire({
                icon: "success",
                title: "Cadete creado exitosamente"
              });
          }
        });
      };
  
    return (
      <div className="cadetes-container">
      <div className='titleconBtn'>
        <h2>Cadetes</h2>
        <button className='button-crear-cadete' onClick={handleCrearCadete}>Crear Cadete</button>
      </div>
      <table className="cadetes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cadetes.map((cadete: Cadete) => (
            <tr key={cadete.id} className={`cadete-item ${cadete.activo ? "" : "inactivo"}`}>
              <td>{cadete.nombre}</td>
              <td className='telTD'>{cadete.telefono}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={cadete.activo}
                    onChange={() => handleToggleActivo(cadete.id, cadete.activo)}
                  />
                  <span className="slider"></span>
                </label>
              </td>
              <td>
                <button className='deleteCadBtn' onClick={() => handleDeleteCadete(cadete.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
};

export default Cadetes;
