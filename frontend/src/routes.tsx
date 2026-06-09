import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MainPage from "./components/home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
       {
            index: true,
            element: <MainPage />,
       },
    //   {
    //     path: "users",
    //     element: <Users />,
    //   },
    ],
  },
]);