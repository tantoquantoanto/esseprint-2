import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SuccessLoginPage from "./Pages/SuccessLoginPage";
import { ProtectedRoutes } from "../middlewares/ProtectedRoutes";
import ProductDetails from "./Components/Products/ProductDetails";
import UserDetails from "./Components/Users/UserDetails"
import NewProductForm from "./Components/Products/NewProductForm";
import ChiSiamo from "./Pages/ChiSiamo";
import Contatti from "./Pages/Contatti";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import NewUsersForm from "./Components/Users/NewUsersForm"





function App() {
  return (
    <>
      
        <BrowserRouter>
          <Routes>
            
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/success/:token" element = {<SuccessLoginPage/>} />
            <Route path="/products/:productId" element = {<ProductDetails/>}/>
            <Route path="/users/:userId" element = {<UserDetails/>} />
            <Route path="/create-new-product" element = {<NewProductForm/>} />
            <Route path="/chi-siamo" element = {<ChiSiamo/>}/>
            <Route path="/contatti" element = {<Contatti/>}/>
            <Route path="/privacy" element = {<PrivacyPolicy/>}/>
            <Route path="create-new-users" element = {<NewUsersForm/>}/>
            
            <Route element={<ProtectedRoutes />}>
            
            </Route>
          </Routes>
        </BrowserRouter>
      
    </>
  );
}

export default App;