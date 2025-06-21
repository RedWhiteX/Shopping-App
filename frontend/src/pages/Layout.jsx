import { Outlet } from "react-router-dom";
import Navbar from "../ui_components/NavBar"; // Assuming this path is correct
import Footer from "../ui_components/Footer"; // Assuming this path is correct

export default function Layout() {
  return (
    // The main layout wrapper now uses bg-background and text-foreground
    // These classes will automatically swap between light and dark mode colors
    // based on the CSS variables defined in your index.css
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet /> {/* This is where routed pages will render */}
      </main>
      <Footer />
    </div>
  );
}