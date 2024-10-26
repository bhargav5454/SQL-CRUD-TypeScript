import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./routes/Public/Publicroutes";
import PrivateRoutes from "./routes/Private/Priveteroutes";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Cookies from 'js-cookie'

export const App = () => {
  const userData = useSelector((state : any) => state.user); // Adjust based on your store structure

  useEffect(() => {
    if (userData) {
      // Set the token and user ID in cookies
      Cookies.set('token', userData?.AuthToken?.token, { expires: 1, path: '/' });
      Cookies.set('xCustomAccessId', userData?.AuthToken?.userId, { expires: 1, path: '/' });
    }
  }, [userData]);
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/*" element={<PublicRoutes />} />
      {/* Private Routes */}
      <Route path="/user/*" element={<PrivateRoutes />} />
    </Routes>
  );
};
