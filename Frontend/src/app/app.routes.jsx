import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import Home from "../features/products/pages/Home";

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
]);

export default router;