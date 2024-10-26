import { Route, Routes } from "react-router-dom";
import Login from "../../pages/Public_pages/Login"; // Ensure the path is correct
import Signup from "../../pages/Public_pages/Signup"; // Ensure the path is correct
import PublicRoute from "./Publicroute";
import Errorpage from "../../Components/Errorpage";

const PublicRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/*" element={<Errorpage />} />
            </Route>
        </Routes>
    );
};

export default PublicRoutes;
