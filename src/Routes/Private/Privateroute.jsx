import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const isLoggedIn = useSelector((state)=>state.user?.AuthToken?.token)
    return isLoggedIn ? <Outlet /> : <Navigate to="/signup" />;
};

export default PrivateRoute;
