import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import Home from "../features/products/pages/Home";
import AddProduct from "../features/products/pages/AddProduct";
import SellerDashboard from "../features/products/pages/SellerDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/seller/add-product",
    element: <AddProduct />,
  },
  {
    path: "/seller/dashboard",
    element: <SellerDashboard />,
  },
]);

export default router;