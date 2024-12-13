import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./pages/Login";
import SuccessLoginPage from "./Pages/SuccessLoginPage";
import { ProtectedRoutes } from "../middlewares/ProtectedRoutes";
import ProductDetails from "./Components/Products/ProductDetails";




function App() {
  return (
    <>
      
        <BrowserRouter>
          <Routes>
            
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/success/:token" element = {<SuccessLoginPage/>} />
            <Route path="/products/:productId" element = {<ProductDetails/>}/>
            <Route element={<ProtectedRoutes />}>
            </Route>
          </Routes>
        </BrowserRouter>
      
    </>
  );
}

export default App;