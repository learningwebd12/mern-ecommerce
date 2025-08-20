/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check if token expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          return null;
        }

        return { token, ...(userData ? JSON.parse(userData) : {}) };
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        return null;
      }
    }
    return null;
  });

  // Login function
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

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => !!user;

  // Auto logout when token expires
  useEffect(() => {
    if (user?.token) {
      const decoded = jwtDecode(user.token);
      const expiryTime = decoded.exp * 1000 - Date.now();

      const timer = setTimeout(() => {
        logout();
        window.location.href = "/login"; // redirect to login page
      }, expiryTime);

      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
