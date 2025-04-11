import React, { createContext, useState, useEffect, useContext } from "react";

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    if (storedToken) {
      setUser({ token: storedToken });
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("authToken", userData.token);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("authToken");
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

export { AuthContext };
