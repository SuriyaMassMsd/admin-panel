import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "global";
import SignIn from "./pages/SignIn.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Form from "./pages/Form.jsx";

const token = localStorage.getItem("token");
const route = createBrowserRouter([
  {
    path: "/",
    element: token ? <App /> : <Navigate to="/sign-in" replace />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  { path: "/fullform", element: <Form /> },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={route}>
    <App />
  </RouterProvider>
);
