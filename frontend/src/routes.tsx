import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MainPage from "./components/home";
import Transactions from "./components/Transactions/transactions";
import RegisterPage from "./components/Login_Register/Register";
import LogInPage from "./components/Login_Register/Login";
import ProtectedRoute from "./Utils/protectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "Transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      }
    ],
  },
  {
    path: "Register",
    element: <RegisterPage />,
  },
  {
    path: "Login",
    element: <LogInPage />,
  },
]);