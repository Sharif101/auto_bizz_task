import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../components/Home/Home";
import DashLayout from "../Layout/DashLayout ";
import Dashboard from "../components/Dashboard/Dashboard";
import Blog from "../components/Blog/Blog";
import Sales from "@/components/Sales/Sales";

let router = createBrowserRouter([
  {
    path: "/",
    // element: <Main></Main>,
    element: <DashLayout />,
    children: [
      // {
      //   path: "/",
      //   element: <Home />,
      // },
      {
        path: "/",
        element: <Sales />,
      },
      // {
      //   path: "/blog",
      //   element: <Blog />,
      // },

      // {
      //   path: "/dashboard",
      //   element: <DashLayout />,
      //   children: [{ path: "/dashboard", element: <Dashboard /> }],
      // },
    ],
  },
]);

export default router;
