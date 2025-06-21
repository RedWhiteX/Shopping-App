import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming Button is a shadcn/ui component
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

// Import the ModeToggle component
import { ModeToggle } from "./mood_toggle"; // Adjusted path to be relative to Navbar.jsx

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
    // Navbar background, text, and border adjusted for dark mode
    <nav className="flex items-center justify-between font-semibold border-b border-border bg-background text-foreground shadow-sm px-4 py-3">
      <div className="flex items-center space-x-4">
        {/* Mobile menu icon uses foreground color */}
        <Menu className="md:hidden text-foreground" />
        {/* App logo/title remains explicit blue */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          ShopEase
        </Link>
        {/* Desktop navigation links use foreground color */}
        <div className="hidden md:flex space-x-6 ml-6 text-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
          <Link to="/help-center" className="hover:text-primary">Help Center 🔧</Link>
          <Link to="/blog" className="hover:text-primary">Blog</Link>

        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Theme Toggler */}
        <ModeToggle className="dark:border-white"/>

        {/* Shopping Cart Icon and Count */}
        <Link to="/cart" className="relative text-foreground hover:text-primary"> {/* Cart icon color adjusts */}
          <ShoppingCart />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </Link>

        {/* Authentication Buttons (remain explicit colored) */}
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
