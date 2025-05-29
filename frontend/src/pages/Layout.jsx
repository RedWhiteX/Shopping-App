import { Outlet } from "react-router-dom";
import Navbar from "../ui_components/NavBar"
import Footer from "../ui_components/Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet /> {/* This is where routed pages will render */}
      </main>
      <Footer />
    </div>
  );
}