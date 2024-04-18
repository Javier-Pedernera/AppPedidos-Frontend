import { Navigate } from "react-router-dom";
import { useAppSelector } from "../Redux/Store/hooks";
// import { useEffect, useState } from "react";
// import User from "../components/Models/User";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {

const token = useAppSelector((state) => state.user.accessToken);
// const [isAuthenticated, setisAuthenticated] = useState(false);
// console.log("token en Authguard",token);
//   useEffect(() => {
//     if(token){
//     setisAuthenticated(true)
//     }
    
//   }, [token]);
  if (!token?.length) {
        return <Navigate to="/login" />
    }

    // const isAuthenticated = token?.length;
// console.log("children en Auth", children);

    

  return <>{children}</>;
};

export default AuthGuard;