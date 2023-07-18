import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Explore,
  Offers,
  Profile,
  SignIn,
  SignUp,
  ForgotPassword,
} from "./pages";
import { Navbar, PrivateRoute } from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/angebote" element={<Offers />} />
          <Route path="/mein-profil" element={<PrivateRoute />}>
            <Route path="/mein-profil" element={<Profile />} />
          </Route>
          <Route path="/anmelden" element={<SignIn />} />
          <Route path="/registrieren" element={<SignUp />} />
          <Route path="/passwort-vergessen" element={<ForgotPassword />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
