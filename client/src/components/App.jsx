import React from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Home from '../components/user/manualUpload/Home'
import Header from './Header'
import Footer from "./Footer";
import UploadExcel from "./user/excelUpload/UploadExcel";

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
      }
    ],
  },
]);

// App Component
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
