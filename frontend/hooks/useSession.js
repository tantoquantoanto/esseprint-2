import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthorized } from "../middlewares/ProtectedRoutes.jsx";
import { isTokenExpired } from "../utilities/checkTokenExpiration.js";

const useSession = () => {
    const session = isAuthorized();  
    const decodedSession = session ? jwtDecode(session) : null;
    const navigate = useNavigate();

    const handleSessionExpired = () => {
        localStorage.removeItem("Authorization");
        navigate('/login');
    };

    useEffect(() => {
        if (session && decodedSession && isTokenExpired(decodedSession.exp)) {
            handleSessionExpired();
        }
    }, [navigate, session, decodedSession]);

    return decodedSession;  
};

export default useSession;