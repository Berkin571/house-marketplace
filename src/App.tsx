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
  Category,
  CreateListing,
  SingleListing,
  Contact,
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
          <Route path="/Erkunden/:categoryName" element={<Category />} />
          <Route path="/angebote" element={<Offers />} />
          <Route path="/mein-profil" element={<PrivateRoute />}>
            <Route path="/mein-profil" element={<Profile />} />
          </Route>
          <Route path="/anzeige-erstellen" element={<PrivateRoute />}>
            <Route path="/anzeige-erstellen" element={<CreateListing />} />
          </Route>
          <Route
            path="/Erkunden/:categoryName/:listingId"
            element={<SingleListing />}
          />
          <Route path="/kontakt/:userRefId" element={<Contact />} />
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
