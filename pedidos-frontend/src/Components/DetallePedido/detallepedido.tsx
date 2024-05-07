import { IoClose } from 'react-icons/io5';
import '../../scss/components/_DetallePedido.scss'

interface DetallePedidoProps {
    descripcion: string;
    onClose: () => void;
  }
  
  const DetallePedido: React.FC<DetallePedidoProps> = ({ descripcion, onClose }) => {

    const elementos = descripcion.split("\n");

    return (
        <div className="modaldetail">
        <div className="modal-contentDetail">
          <span className="close" onClick={onClose}><IoClose /></span>
          <h2>Descripción del Pedido</h2>
          {elementos.map(elem => <p>{elem}</p>)}
        </div>
      </div>
    );
  };
  
  export default DetallePedido;