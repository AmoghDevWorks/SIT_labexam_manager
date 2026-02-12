import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userUid, setUserUid] = useState(null);
  const [userName, setUserName] = useState(null);

  const value = {
    userUid,
    setUserUid,
    userName,
    setUserName,
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
