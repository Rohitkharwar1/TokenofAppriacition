import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Toa from "./components/Toa";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const navigation = useNavigate();

  // const getLocalStore = (key) => {
  //   return localStorage.getItem(key)
  //     ? JSON.parse(localStorage.getItem(key))
  //     : null;
  // };

  // useEffect(() => {
  //   const user = getLocalStore("user");
  //   console.log(user);

  //   if (user !== null || user !== undefined) {
  //     setIsLoggedIn(true);
  //     navigation("/dashboard");
  //   }
  // }, []);

  // Function to handle login
  const handleLogin = () => {
    // Perform your login logic here
    // For demonstration purposes, let's just set isLoggedIn to true
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Perform your logout logic here
    // For demonstration purposes, let's just set isLoggedIn to false
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login
                onLogin={handleLogin}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/toa" element={<Toa />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
