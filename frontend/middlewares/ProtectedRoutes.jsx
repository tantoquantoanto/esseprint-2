
import { Outlet } from "react-router-dom";
import Login from "../src/pages/Login";

export const isAuthorized = () => {
  return (localStorage.getItem("Authorization"))
};

export const ProtectedRoutes = () => {

    const isAuth = isAuthorized()
  return isAuth ? <Outlet /> : <Login />;
};