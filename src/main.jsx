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
import { Details } from "@mui/icons-material";

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
  { path: "/course/:id", element: <Details /> },
  { path: "/fullform", element: <Form /> },
]);

createRoot(document.getElementById("root")).render(
  // <ThemeProvider>
  <RouterProvider router={route} />
  // </ThemeProvider>
);
