import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./Privateroute";
import Home from "../../Pages/Private_pages/Home"; // Ensure the path is correct
import Navbar from "../../Components/Navbar";
import Errorpage from "../../Components/Errorpage";
import Product from "../../Pages/Private_pages/Product";
import { useSelector } from "react-redux";
import SessionExpiredPopup from "../../Components/Sessionex";
import ProductForm from "../../Pages/Private_pages/ProductForm";

const PrivateRoutes = () => {

    const { error } = useSelector((state) => state.productData);

    if (error && error.includes('Unauthorized')) {
        return <SessionExpiredPopup />;
    }


    return (
        <>
            <Navbar />
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/product" element={<Product />} />
                    <Route path="/productform" element={<ProductForm />} />
                    <Route path="/*" element={<Errorpage />} />
                </Route>
            </Routes>
        </>
    );
};

export default PrivateRoutes;
