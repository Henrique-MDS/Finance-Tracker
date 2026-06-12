import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MainPage from "./components/home";
import Transactions from "./components/Transactions/transactions";
import RegisterPage from "./components/Login_Register/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "Transactions",
        element: <Transactions />,
      },
      {
        path: "Register",
        element: <RegisterPage />,
      },
    ],
  },
]);