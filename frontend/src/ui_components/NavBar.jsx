import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";


export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth on load
  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between font-semibold border-gray-900 bg-white shadow-sm px-4 py-3">
      <div className="flex items-center space-x-4">
        <Menu className="md:hidden" />
        <Link to="/" className="text-xl font-bold text-blue-600">
          ShopEase
        </Link>
        <div className="hidden md:flex space-x-6 ml-6 text-gray-700">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/help-center" >Help Center 🔧  </Link>

        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/cart" className="relative">
          <ShoppingCart />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </Link>

        {isLoggedIn ? (
          <>
            <Button className="bg-yellow-500 hover:bg-yellow-400">
              <Link to="/profile" className="text-sm font-semibold text-white hover:underline">
                Profile
              </Link>
            </Button>
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-400">
              <span className="text-sm font-semibold text-white">Logout</span>
            </Button>
          </>
        ) : (
          <>
            <Button className="bg-blue-500 hover:bg-blue-400">
              <Link to="/login" className="text-sm font-semibold text-white hover:underline">
                Login
              </Link>
            </Button>
            <Button className="bg-green-500 hover:bg-green-400">
              <Link to="/register" className="text-sm font-semibold text-white hover:underline">
                Register
              </Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
