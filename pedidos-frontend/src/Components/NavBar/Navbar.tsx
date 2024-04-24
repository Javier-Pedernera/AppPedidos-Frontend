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
// import salida from "../../assets/gif/salida.gif"

const Navbar: React.FC = () => {
    const userActive: UserState = useAppSelector((state: any) => state.user);
    // console.log(userActive.accessToken);

    const dispatch = useAppDispatch()
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
            {
                path: "/faq",
                name: "Home",
                style: "route"
            },
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