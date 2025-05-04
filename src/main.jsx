import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "global";
import SignIn from "./pages/SignIn.jsx";
import Form from "./pages/Form.jsx";
import { Details } from "@mui/icons-material";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/sign-in" replace />;
};

const route = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  { path: "/course/:id", element: <Details /> },
  { path: "/fullform", element: <Form /> },
]);

createRoot(document.getElementById("root")).render(
  <>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
    <RouterProvider router={route} />
  </>
);
