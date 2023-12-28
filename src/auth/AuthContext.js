// AuthContext.js
import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by retrieving the access token from local storage
    const accessToken = localStorage.getItem("USER_DATA");
    setIsLoggedIn(accessToken !== null);
  }, []);

  const logout = () => {
    // Perform logout operations here, e.g., remove access token from local storage
    localStorage.removeItem("USER_DATA");
    setIsLoggedIn(false); // Update isLoggedIn state to false after logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
