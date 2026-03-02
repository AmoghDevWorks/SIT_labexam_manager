import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminUid, setAdminUid] = useState(() => {
    return localStorage.getItem('adminUid') || null;
  });
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('adminToken') || null;
  });

  // Persist admin data to localStorage
  useEffect(() => {
    if (adminUid && adminToken) {
      localStorage.setItem('adminUid', adminUid);
      localStorage.setItem('adminToken', adminToken);
    } else {
      localStorage.removeItem('adminUid');
      localStorage.removeItem('adminToken');
    }
  }, [adminUid, adminToken]);

  const logout = () => {
    setAdminUid(null);
    setAdminToken(null);
    localStorage.removeItem('adminUid');
    localStorage.removeItem('adminToken');
  };

  const value = {
    adminUid,
    setAdminUid,
    adminToken,
    setAdminToken,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return useContext(AdminContext);
};
