import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MainPage from "./components/home";
import Transactions from "./components/Transactions/transactions";
import RegisterPage from "./components/Login_Register/Register";
import LogInPage from "./components/Login_Register/Login";
import ProtectedRoute from "./Utils/protectedRoute";
import CategoriesPage from "./components/Categories/Categories";
import ReportPage from "./components/Reports/ReportPage";
import SettingsPage from "./components/Settings/Settings";

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
      },
      {
        path: "Categories",
        element: (
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "Reports",
        element: (
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "Settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
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