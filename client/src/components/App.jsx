import React from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import { AdminProvider } from "./utils/adminContext";
import ProtectedRoute from "./utils/ProtectedRoute";


import UserDashboard from './user/UserDashboard'
import Header from './Header'
import Footer from "./Footer";
import UploadExcel from "./user/excelUpload/UploadExcel";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageSubject from "./admin/ManageSubject";
import ManageInternalExaminer from "./admin/ManageInternalExaminer";
import Home from "./Home";
import UserLogin from "./user/UserLogin";

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
        path: '/',
        element: <Home />
      },
      {
        path: '/user/login',
        element: <UserLogin />
      },
      {
        path:'/user/dashboard',
        element:<UserDashboard />
      },
      {
        path:'/excel',
        element: <UploadExcel />
      },
      {
        path:'/loginAdmin',
        element: <AdminLogin />
      },
      {
        path:'/admin/dashboard',
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/manageSubjects',
        element: (
          <ProtectedRoute>
            <ManageSubject />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/manageInternalExaminers',
        element: (
          <ProtectedRoute>
            <ManageInternalExaminer />
          </ProtectedRoute>
        )
      },
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
