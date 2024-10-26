import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const isLoggedIn = useSelector((state) => state.user?.AuthToken?.token) 
    return isLoggedIn ? <Navigate to="/user" /> : <Outlet />;
};

export default PublicRoute;
