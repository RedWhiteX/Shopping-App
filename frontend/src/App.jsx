import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
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
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";

function App() {
  function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
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
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
          {/* You can add more protected routes here, all under Layout */}
         </Route>

        {/* Public Routes (no layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
