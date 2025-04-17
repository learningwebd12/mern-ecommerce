/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// Define the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    return token ? { token, ...(userData ? JSON.parse(userData) : {}) } : null;
  });

  // Login function to set user data and token
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

  // Logout function to remove user data and token
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
