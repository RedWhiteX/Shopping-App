import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- Core Page Imports ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ProductDetail from "./pages/ProductDetail";
import BlogPage from "./pages/Blog";
import HelpCenter from "./pages/Help";
import CareersPage from "./pages/Careers";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shiping";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";

// --- Admin Page Imports ---
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import OrderDetail from "./pages/admin/OrderDetail"; // 👈 IMPORT THE NEW COMPONENT
//  // <-- IMPORT THE NEW COMPONENT

// --- Components & Providers ---
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute"; // Make sure you have created this file
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './ui_components/theme_provider';

function App() {
  function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return (
    <ThemeProvider defaultTheme="white" storageKey="vite-ui-theme">
      <BrowserRouter>
        <CartProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            {/* === PUBLIC ROUTES === */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />

            {/* === PROTECTED USER ROUTES === */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/productdetail/:id" element={<ProductDetail />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* === PROTECTED ADMIN ROUTES === */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:orderId" element={<OrderDetail />} />
                {/* Add future admin routes here, e.g., for users */}
                <Route path="users" element={<Users />} />
              </Route>
            </Route>
            
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
