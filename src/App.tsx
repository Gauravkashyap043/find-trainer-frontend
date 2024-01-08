// App.tsx
import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Map from "./pages/map/Map";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const userData = localStorage.getItem("USER_DATA");
    setIsUserLoggedIn(!!userData); 
  }, []);

  return (
    <div className="container m-auto">
      <Routes>
        {isUserLoggedIn ? (
          <Route path="/" element={<Navigate to="/find-trainer" />} />
        ) : (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        <Route path="/find-trainer" element={<Map />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
