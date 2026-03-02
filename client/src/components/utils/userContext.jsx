import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userUid, setUserUid] = useState(() => {
    return localStorage.getItem('userUid') || null;
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || null;
  });
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem('userToken') || null;
  });

  // Persist user data to localStorage
  useEffect(() => {
    if (userUid && userName && userToken) {
      localStorage.setItem('userUid', userUid);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userToken', userToken);
    } else {
      localStorage.removeItem('userUid');
      localStorage.removeItem('userName');
      localStorage.removeItem('userToken');
    }
  }, [userUid, userName, userToken]);

  const logout = () => {
    setUserUid(null);
    setUserName(null);
    setUserToken(null);
    localStorage.removeItem('userUid');
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');
  };

  const value = {
    userUid,
    setUserUid,
    userName,
    setUserName,
    userToken,
    setUserToken,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
