import React, { useEffect } from 'react';
import '../../scss/components/_navBar.scss';
import { Link } from 'react-router-dom';
import user from "../../assets/images/imageUser.png"
import logo from "../../assets/logos/oaxaca.png"
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { UserState } from '../../Redux/Actions/UserSlice';
import { userLogIn } from '../../Redux/Actions/UserActions';
import 'balloon-css';
import dayjs from 'dayjs';
import useEmailSender from '../../utils/enviosEmail';
import { modificarParametros, traerParametros } from '../../Redux/Actions/ParamsActions';
import Swal from 'sweetalert2';
import { obtenerPedidos } from '../../Redux/Actions/PedidosActions';
// import salida from "../../assets/gif/salida.gif"

const Navbar: React.FC = () => {
    const userActive: UserState = useAppSelector((state: any) => state.user);
    // console.log(userActive.accessToken);
    const pedidos = useAppSelector((state) => state.pedidos.pedidos);
    const emailReport = useAppSelector((state:any) => state.params.allParams).filter((p:any)=> p.nombre == "EmailInformes");
  const dispatch = useAppDispatch()
  const horarioDeInforme = useAppSelector((state:any) => state.params.allParams).filter((p:any)=> p.nombre == "horasInformeDiario");
  const ultimoInforme = useAppSelector((state:any) => state.params.allParams).filter((p:any)=> p.nombre == "ultimoInforme");
console.log("hora de informe",horarioDeInforme,"ultimo informe", ultimoInforme);

    useEffect(() => {
        dispatch(traerParametros());
        dispatch(obtenerPedidos ());
    }, [dispatch]);
  useEffect(() => {
    // dispatch(traerParametros());
    if(horarioDeInforme[0] && ultimoInforme[0]){

      const intervalId = setInterval(() => {

          const ahora = dayjs();
          const [horas, minutos] = horarioDeInforme[0]?.valor?.split(':');
          const horarioInforme = dayjs().set('hour', horas).set('minute', minutos).set('second', 0);
          
          const fechaHoraArray = ultimoInforme[0]?.valor.split(/[\s,]+/);
          const [dia, mes, anio] = fechaHoraArray[0]?.split('/');
          const [hora, minutosInf] = fechaHoraArray[1]?.split(':');
          const ultimaFechaInforme = dayjs(`${anio}-${mes}-${dia}T${hora}:${minutosInf}`);
        //   console.log("dia", dia);
          // Verifica si la hora y los minutos coinciden con el horario de informe
        //   console.log("comparar",ahora,horarioInforme);
          const esHoraDeInforme = ahora.isSame(horarioInforme, 'minute');
        //   console.log("esHoraDeInforme",esHoraDeInforme);
          // Verifica si es un dia diferente desde el último informe
        //   const esElMismoDia = ahora.isSame(ultimaFechaInforme, 'day');
          // si ya paso al minos un minuto de envio de email se puede enviar automaticamente el proximo
          const controlDeCambioDehorario = ahora.diff(ultimaFechaInforme, 'minute')
        //   console.log("es el mismo dia?",esElMismoDia);
        //   console.log("diferencia horas",ahora.diff(ultimaFechaInforme, 'hour'))
        //   console.log("diferencia minutos",ahora.diff(ultimaFechaInforme, 'minute'))
        //   console.log("diferencia dia",ahora.diff(ultimaFechaInforme, 'day'))
          if (esHoraDeInforme && controlDeCambioDehorario) {
            console.log("envio  de email");
            
            useEmailSender(pedidos, emailReport).then(
              (response)=>{
                // console.log("respuesta de la  funcion enviar email",response);
                // console.log("id del ultimo informe",ultimoInforme[0].id);
            dispatch( modificarParametros(ultimoInforme[0].id,response));
            Swal.fire('¡Informe diario enviado correctamente!', '', 'success');
              }
            )
            dispatch(traerParametros)
          }
      }, 60000);
      return () => clearInterval(intervalId);
    }
}, [dispatch, ultimoInforme]);

    useEffect(() => {
        const token = Cookies.get("data");
        if (token && !userActive.accessToken) {
            dispatch(userLogIn(null, token));
        }
    }, [dispatch]);

    let routes = []
    if (userActive.accessToken?.length) {
        routes = [
            {
                path: "/userProfile",
                name: userActive.userData && 'email' in userActive.userData ? userActive.userData.email : "User Email",
                style: "userName"
            },
        ]
    } else {
        routes = [
            // {
            //     path: "/faq",
            //     name: "Home",
            //     style: "route"
            // },
            {
                path: "/login",
                name: "LogIn",
                style: "route"
            },
            {
                path: "/register",
                name: "SignUp",
                style: "route"
            },
        ]
    }
    // const logOut = () => {
    //     dispatch(logOutUser())
    // }
    return (
        <nav className="navbar">
            <div className='divLogo'>
                <Link to="/faq">
                    <img src={logo} alt="" />
                </Link>
            </div>
            <ul className="navbar-list">
                {routes.map((route, index) => (
                    <li key={index}>
                        <Link className={route.style} to={route.path}>
                            {route.name}
                        </Link>
                    </li>
                ))}
                <li>
                    {userActive.accessToken?.length ?
                        <div className='divUser'>
                            <div className='divUser'>
                                <img src={user} title='Edit' className='imageUser' alt="userImg" />

                            </div>
                        </div> : <div></div>}
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;