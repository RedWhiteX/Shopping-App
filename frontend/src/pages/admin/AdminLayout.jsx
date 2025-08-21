// import React, { useState } from 'react';
// import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { LayoutDashboard, ShoppingCart, Users, LogOut, Menu, X } from 'lucide-react';

// const AdminLayout = () => {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   const navLinks = [
//     { to: "/admin", icon: LayoutDashboard, text: "Dashboard" },
//     { to: "/admin/orders", icon: ShoppingCart, text: "Orders" },
//     { to: "/admin/users", icon: Users, text: "Users" },
//   ];

//   const SidebarContent = () => (
//     <>
//       <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-black">Admin Panel</h1>
//         <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1">
//             <X size={24} className="text-gray-600"/>
//         </button>
//       </div>
//       <nav className="flex-1 p-4 space-y-2">
//         {navLinks.map((link) => (
//           <NavLink
//             key={link.to}
//             to={link.to}
//             end={link.to === "/admin"}
//             onClick={() => setIsSidebarOpen(false)}
//             className={({ isActive }) =>
//               `flex items-center p-3 rounded-lg transition-colors text-base font-medium ${
//                 isActive
//                   ? 'bg-black text-white'
//                   : 'text-gray-700 hover:bg-gray-100'
//               }`
//             }
//           >
//             <link.icon className="mr-3 h-5 w-5" />
//             {link.text}
//           </NavLink>
//         ))}
//       </nav>
//       <div className="p-4 border-t border-gray-200">
//         <button onClick={handleLogout} className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
//           <LogOut className="mr-3 h-5 w-5" /> Logout
//         </button>
//       </div>
//     </>
//   );

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Mobile Sidebar */}
//       <div className={`fixed inset-0 z-40 flex md:hidden transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//           <aside className="w-64 bg-white text-black flex flex-col shadow-lg">
//               <SidebarContent />
//           </aside>
//           <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
//       </div>

//       {/* Desktop Sidebar */}
//       <aside className="w-64 bg-white text-black flex-col border-r border-gray-200 hidden md:flex">
//         <SidebarContent />
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col">
//         {/* Top bar for mobile */}
//         <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
//             <button onClick={() => setIsSidebarOpen(true)}>
//                 <Menu size={24} className="text-black"/>
//             </button>
//             <h1 className="text-lg font-bold">Admin</h1>
//         </div>
//         <div className="p-4 md:p-8 overflow-y-auto">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;


import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, LogOut, Menu, X } from 'lucide-react';
import { ModeToggle } from '../../ui_components/mood_toggle';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinks = [
    { to: "/admin", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/admin/orders", icon: ShoppingCart, text: "Orders" },
    { to: "/admin/users", icon: Users, text: "Users" },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-black flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black dark:text-white">Admin Panel</h1>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1">
            <X size={24} className="text-gray-600 dark:text-gray-300"/>
        </button>
        <div className="hidden md:block">
            <ModeToggle />
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin"}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors text-base font-medium ${
                isActive
                  ? 'bg-black text-white dark:bg-gray-600'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <link.icon className="mr-3 h-5 w-5" />
            {link.text}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button onClick={handleLogout} className="flex items-center w-full p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <LogOut className="mr-3 h-5 w-5" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <aside className="w-64 bg-white text-black dark:bg-black dark:text-white flex flex-col shadow-lg">
              <SidebarContent />
          </aside>
          <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white text-black dark:bg-black dark:text-white flex-col border-r border-gray-200 dark:border-gray-700 hidden md:flex">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
            <button onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} className="text-black dark:text-white"/>
            </button>
            <h1 className="text-lg font-bold text-black dark:text-white">Admin</h1>
            <ModeToggle />
        </div>
        <div className="p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;