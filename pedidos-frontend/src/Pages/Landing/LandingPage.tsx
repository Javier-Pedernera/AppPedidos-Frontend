
import {  useNavigate } from 'react-router-dom';
import '../../scss/components/landing.scss';
import logo from "../../assets/logos/logo1-sinfondo.png"
import CustomButton from '../../Components/Button/CustomButton.tsx';

const Landing = () => {

    const navigate = useNavigate();
    const handleInit = () => {
        navigate("/faq");
    };

    return (
        <div className="landing">
           <img src={logo} className='logo-landing' alt="" />
            {/* <Link to="/home" className="landing-button">Ir al Inicio</Link> */}
            {/* <button className="btn" onClick={() => handleInit()}>Iniciar envíos</button> */}
            <CustomButton onClick={handleInit} titulo="Iniciar pedidos" color1="var(--greenSoft-color)" color2="var(--greenSoft-color)"/>
        </div>
    );
};

export default Landing;
