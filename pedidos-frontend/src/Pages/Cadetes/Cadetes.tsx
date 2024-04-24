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
      dispatch(eliminarCadete(id));
    };

    const handleToggleActivo = (id: number, activo: boolean) => {
      dispatch(toggleActivoCadete( id, activo= !activo ));
    };
    const handleCrearCadete = () => {
        Swal.fire({
          title: 'Agregar cadete',
          confirmButtonText: 'Crear',
          html:
            '<input id="nombre" className="swal2-input" placeholder="Nombre">',
          focusConfirm: false,
          preConfirm: () => {
            const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
            console.log(nombre);
      
            dispatch(addNewCadete({ nombre, activo: true }))
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
        <div className="cadetes-list">
          {cadetes.map((cadete: Cadete) => (
            <div key={cadete.id} className={`cadete-item ${cadete.activo? "":"inactivo"}`} >
              <div>
                <strong>Nombre:</strong> {cadete.nombre}
              </div>
              <div className='Active_btn'>
                 <div>
                <strong>Activo:</strong>{' '}
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={cadete.activo}
                    onChange={() => handleToggleActivo(cadete.id, cadete.activo)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <button onClick={() => handleDeleteCadete(cadete.id)}>Eliminar</button>
              </div>
             
            </div>
          ))}
        </div>
      </div>
    );
};

export default Cadetes;
