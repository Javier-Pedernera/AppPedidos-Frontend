
import { Dispatch } from "@reduxjs/toolkit";
import UserLogin from "../../Models/UserLogin";
import { logOut, loginUser } from "./UserSlice";
import axios from "axios";
import User from "../../Models/User";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

interface CustomJwtPayload extends JwtPayload {
	public_id: string;
	username: string;
	exp: number;
}

//Post para login de user
const userLogIn = (user: UserLogin | null, token: string) => {
	return async (dispatch: Dispatch) => {
		if (!user && token.length) {
			const decodedToken: CustomJwtPayload = await jwtDecode(token);
			const userData: User = {
				id: decodedToken.public_id,
				email: decodedToken.username,
				exp: decodedToken.exp,
				token: token
			};
			const res = dispatch(loginUser(userData));
			return res
		} else if (user && !token.length) {
			try {
				const URL = import.meta.env.VITE_API_URL
				const username = user?.email;
				const password = user?.password;
				const token = btoa(`${username}:${password}`);
				const headers = {
					'Authorization': `Basic ${token}`
				};
				const response = await axios.post(`${URL}/login`, {}, { headers });
				// console.log(response.data);
				const decodedToken: CustomJwtPayload = await jwtDecode(response.data.token);
				// console.log(decodedToken);
				const userData: User = {
					id: decodedToken.public_id,
					email: decodedToken.username,
					exp: decodedToken.exp,
					token: response.data.token
				};
				const res = dispatch(loginUser(userData));
				return res
			} catch (error) {
				console.error("Error al iniciar sesión:", error);
			}
		}

	};
};

const logOutUser = () => {
	return async (dispatch: Dispatch) => {
		try {
			if (Cookies.get('data')) {
				Cookies.remove('data', { path: '/auth' });
				Cookies.remove('data', { path: '/' });
				window.location.reload();
			} else {
				console.log("La cookie 'userData' no existe.");
			}
			dispatch(logOut({}));
		} catch (error) {
			console.error(error);
		}
	};
};


export {
	userLogIn, logOutUser
}