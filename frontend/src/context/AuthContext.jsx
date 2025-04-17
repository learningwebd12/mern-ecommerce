import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    return token ? { token, ...(userData ? JSON.parse(userData) : {}) } : null;
  });

  const login = (userData) => {
    localStorage.setItem("authToken", userData.token);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        name: userData.name,
        _id: userData._id,
      })
    );
    setUser({ ...userData });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Add and export this hook
import { useContext } from "react";
export const useAuth = () => useContext(AuthContext);
