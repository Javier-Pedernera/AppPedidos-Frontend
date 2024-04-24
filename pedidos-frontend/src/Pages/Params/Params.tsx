import { useState, useEffect } from 'react';
import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import './Params.scss'; // Estilos personalizados

const Params = () => {
  const [maxTiempoEspera, setMaxTiempoEspera] = useState('');
  const [maxPedidosGrupo, setMaxPedidosGrupo] = useState('');

  // Obtener valores predeterminados del estado global
  const defaultMaxTiempoEspera = useSelector((state:any) => state.params.maxTiempoEspera);
  const defaultMaxPedidosGrupo = useSelector((state:any) => state.params.maxPedidosGrupo);

  useEffect(() => {
    // Establecer los valores predeterminados en los estados locales al montar el componente
    setMaxTiempoEspera(defaultMaxTiempoEspera.toString());
    setMaxPedidosGrupo(defaultMaxPedidosGrupo.toString());
  }, [defaultMaxTiempoEspera, defaultMaxPedidosGrupo]);

  const handleSaveConfig = async () => {
    try {
      // Aquí realizarías la solicitud POST al backend para guardar la configuración
      await axios.post('/api/config', {
        maxTiempoEspera,
        maxPedidosGrupo
      });
      // Agregar cualquier lógica adicional después de guardar la configuración
      alert('Configuración guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      alert('Ocurrió un error al guardar la configuración.');
    }
  };

  return (
    <div className="params-container">
      <img className="params-background" src="../../assets/images/fondo2.png" alt="Fondo" />
      <div className="params-content">
        <h2>Configuración de Parámetros</h2>
        <div className="params-inputs">
          <div className="input-group">
            <label htmlFor="maxTiempoEspera">Tiempo máximo de espera por grupo:</label>
            <input
              type="text"
              id="maxTiempoEspera"
              value={maxTiempoEspera}
              onChange={(e) => setMaxTiempoEspera(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="maxPedidosGrupo">Máximo de pedidos por grupo:</label>
            <input
              type="text"
              id="maxPedidosGrupo"
              value={maxPedidosGrupo}
              onChange={(e) => setMaxPedidosGrupo(e.target.value)}
            />
          </div>
        </div>
        <button className="save-button" onClick={handleSaveConfig}>
          {/* <FontAwesomeIcon icon={faSave} /> */}
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};

export default Params;