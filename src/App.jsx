// App.jsx
import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Map from "./pages/map/Map";

function App() {
  
  return (
    <div className="container m-auto">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/find-trainer" element={<Map/>}/>
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App;
