import React from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import { AdminProvider } from "./utils/adminContext";

import Home from './user/Home'
import Header from './Header'
import Footer from "./Footer";
import UploadExcel from "./user/excelUpload/UploadExcel";
import AdminLogin from "./admin/AdminLogin";

// Layout Component
const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

// Router Setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path:'/',
        element:<Home />
      },
      {
        path:'/excel',
        element: <UploadExcel />
      },
      {
        path:'/login-admin',
        element: <AdminLogin />
      }
    ],
  },
]);

// App Component
const App = () => {
  return(
    <AdminProvider>
      <RouterProvider router={router} />
    </AdminProvider>
  )
};

export default App;
