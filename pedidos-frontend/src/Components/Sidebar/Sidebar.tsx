import React, { useEffect, useState } from 'react';
import '../../scss/components/sidebar.scss';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { UserState } from '../../Redux/Actions/UserSlice';
import Route from '../../Models/RouteModel';
import { logOutUser } from '../../Redux/Actions/UserActions';
import salir from "../../assets/iconos/salir.svg"
import moto from "../../assets/iconos/3.svg"
import panel from "../../assets/iconos/panel.svg"
import pedidos from "../../assets/iconos/pedidos.svg"
import reportes from "../../assets/iconos/reportes.svg"
import user from "../../assets/iconos/user.svg"
import faq from "../../assets/iconos/faq.svg"
import mapas from "../../assets/iconos/mapas.svg"
import parametros from "../../assets/iconos/parametros.svg"


const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const isSidebarOpen = true
  const userActive: UserState = useAppSelector((state: any) => state.user);
  // if (userActive) 
  //   { console.log(userActive.accessToken); 

  //   }
  const [routes, setRoutes] = useState<Route[]>([]);
  const dispatch = useAppDispatch()

  //     useEffect(() => {
  //         const token = Cookies.get("data");
  //         if (token && !userActive.accessToken) {
  //             dispatch(userLogIn(null, token));
  //         }
  //     }, [dispatch]);


  useEffect(() => {
    if (userActive && userActive.accessToken) {
      setRoutes([
        {
          path: "/dashboard",
          name: "Panel General",
          style: "panelicono"
        },
        {
          path: "/cadetes",
          name: "Cadetes",
          style: "cadetes"
        },
        {
          path: "/gestion",
          name: "Gestión de pedidos",
          style: "gestion"
        },
        {
          path: "/reportes",
          name: "Reportes",
          style: "reportes"
        },
        {
          path: "/config_maps",
          name: "Configurar zonas",
          style: "zonas"
        },
        {
          path: "/params",
          name: "Parámetros",
          style: "parametros"
        },
        {
          path: "/userProfile",
          name: "Perfil",
          style: "userProfile"
        },
        {
          path: "/",
          name: "Salir",
          style: "salir"
        },
        {
          path: "/faq",
          name: "FAQ",
          style: "faqicono"
        },
      ])
    } else {
      setRoutes([
        {
          path: "/faq",
          name: "FAQ",
          style: "faqicono"
        }
      ])
    }
  }, [userActive]);



  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false);
  };
  // const handleNavigation = (path) => {
  //   // history.push(path);
  // };
  const logOut = () => {
    dispatch(logOutUser())

  }
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className='cont'>
        <ul className="sidebar-list">
          {routes.map((route: any, index: any) => (
            <li key={index}>
              <div className="sidebar-icon">
                {route.path !== "/" ?
                  <Link className="linkSidebar" to={route.path == "/" ? undefined : route.path}>
                    {route.style == "panelicono" ? <img src={panel} className='iconos' /> : null}
                    {route.style == "cadetes" ? <img src={moto} className='iconos' /> : null}
                    {route.style == "gestion" ? <img src={pedidos} className='iconos' /> : null}
                    {route.style == "reportes" ? <img src={reportes} className='iconos' /> : null}
                    {route.style == "zonas" ? <img src={mapas} className='iconos' /> : null}
                    {route.style == "parametros" ? <img src={parametros} className='iconos' /> : null}
                    {route.style == "userProfile" ? <img src={user} className='iconos' /> : null}
                    {route.style == "faqicono" ? <img src={faq} className='iconos' /> : null}

                    <span className={`sidebar-text ${isSidebarOpen ? 'open' : ''}`}>{route.name}</span>
                  </Link> :
                  <div className='divSalir'> {route.style == "salir" ? <img src={salir} className='iconos' /> : null}
                    <span onClick={logOut} className={`sidebar-text ${isSidebarOpen ? 'open' : ''}`}>{route.name}</span>
                  </div>
                }
              </div>
            </li>
          ))}
        </ul>

      </div>
      <div className={`politicas ${isSidebarOpen ? 'open' : ''}`}>

        <h3>Políticas y Términos</h3>
        <ul>
          <li><a className='pyc' href="/politica-de-privacidad">Política de Privacidad</a></li>
          <li><a className='pyc' href="/terminos-y-condiciones">Términos y Condiciones</a></li>
          <li><a className='pyc' href="/politica-de-cookies">Política de Cookies</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;