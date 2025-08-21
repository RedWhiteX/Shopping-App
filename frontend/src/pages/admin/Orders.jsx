// import React, { useState, useEffect } from 'react';
// import api from '../../api'
// '; // Make sure your api.js is set up to send the token'

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchOrders = async () => {
//       // We keep loading true at the start
//       setLoading(true);
//       setError(''); // Reset error state on new fetch

//       try {
//         const response = await api.get('/admin/orders/');
//         setOrders(response.data.results || response.data);
//       } catch (err) {
//         // --- ADD THIS ---
//         // If it fails, set a user-friendly error message
//         console.error("Failed to fetch orders:", err);
//         setError('Failed to load orders. Please make sure you are logged in as an admin.');
//       } finally {
//         // --- ADD THIS ---
//         // This will run after the try or catch block is finished
//         setLoading(false); 
//       }
//     };
    
//     fetchOrders();
//   }, []); // The empty array [] means it only runs once
// ; // The empty array [] means it only runs once

//   if (loading) return <div className="text-center text-gray-500">Loading orders...</div>;
//   if (error) return <div className="text-center text-red-500 p-4 bg-red-50 rounded-md">{error}</div>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-black">Manage Orders</h1>

//       {/* This container makes the table scrollable on small screens */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
//         <table className="w-full text-sm text-left">
//           <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
//             <tr>
//               <th className="px-6 py-3">Order ID</th>
//               <th className="px-6 py-3">Customer</th>
//               <th className="px-6 py-3">Date</th>
//               <th className="px-6 py-3">Total</th>
//               <th className="px-6 py-3">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.length === 0 ? (
//                 <tr>
//                     <td colSpan="5" className="text-center py-10 text-gray-500">No orders found.</td>
//                 </tr>
//             ) : (
//                 orders.map((order) => (
//                 <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
//                     <td className="px-6 py-4 font-medium text-black">#{order.id}</td>
//                     <td className="px-6 py-4">{order.customer_name}</td>
//                     <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
//                     <td className="px-6 py-4">${order.total_price}</td>
//                     <td className="px-6 py-4">
//                     <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
//                         {order.status}
//                     </span>
//                     </td>
//                 </tr>
//                 ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Orders;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // For navigating to the detail page
// import api from '../../api'; // Your configured Axios instance

// const Orders = () => {
//   // State for orders, loading indicator, and errors
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Hook to programmatically navigate
//   const navigate = useNavigate();

//   // Fetch orders when the component mounts
//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const response = await api.get('/admin/orders/');
//         setOrders(response.data.results || response.data);
//       } catch (err) {
//         console.error("Failed to fetch orders:", err);
//         setError('Failed to load orders. Please make sure you are logged in as an admin.');
//       } finally {
//         setLoading(false); 
//       }
//     };
    
//     fetchOrders();
//   }, []); // Empty array ensures this runs only once on mount

//   // --- Helper Functions ---

//   // This function calls the backend to update an order's status
//   // NOTE: You will need to create a corresponding API endpoint in Django for this to work.
//   const handleUpdateStatus = async (orderId, newStatus) => {
//     try {
//       // Example API call: a PATCH request to an update-status endpoint
//       await api.patch(`/admin/orders/${orderId}/update-status/`, { status: newStatus });
      
//       // Update the status in the local state to see the change immediately
//       setOrders(currentOrders => 
//         currentOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
//       );
//       alert('Order status updated successfully!');
//     } catch (err) {
//       console.error("Failed to update status", err);
//       alert('Failed to update the order status.');
//     }
//   };

//   // This helper returns a CSS class for color-coding the status badge
//   const getStatusClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'processing':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'shipped':
//         return 'bg-blue-100 text-blue-800';
//       case 'delivered':
//         return 'bg-green-100 text-green-800';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };


//   // --- Render Logic ---

//   if (loading) return <div className="text-center text-gray-500 p-8">Loading orders...</div>;
//   if (error) return <div className="text-center text-red-500 p-4 bg-red-50 rounded-md">{error}</div>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-black">Manage Orders</h1>

//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
//         <table className="w-full text-sm text-left">
//           <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
//             <tr>
//               <th className="px-6 py-3">Order ID</th>
//               <th className="px-6 py-3">Customer</th>
//               <th className="px-6 py-3">Date</th>
//               <th className="px-6 py-3">Total</th>
//               <th className="px-6 py-3">Status</th>
//               <th className="px-6 py-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.length === 0 ? (
//                 <tr>
//                     <td colSpan="6" className="text-center py-10 text-gray-500">No orders found.</td>
//                 </tr>
//             ) : (
//                 orders.map((order) => (
//                 <tr 
//                   key={order.id} 
//                   className="bg-white border-b hover:bg-gray-50 cursor-pointer"
//                   // Navigate to the detail page on row click
//                   onClick={() => navigate(`/admin/orders/${order.id}`)}
//                 >
//                     <td className="px-6 py-4 font-medium text-blue-600 hover:underline">#{order.id}</td>
//                     <td className="px-6 py-4">{order.shipping_address?.firstName} {order.shipping_address?.lastName}</td>
//                     <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
//                     <td className="px-6 py-4">${order.total_price}</td>
//                     <td className="px-6 py-4">
//                         <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>
//                             {order.status}
//                         </span>
//                     </td>
//                     <td className="px-6 py-4">
//                         {/* Dropdown to change the status */}
//                         <select
//                             value={order.status}
//                             onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
//                             className="text-xs border border-gray-300 rounded p-1"
//                             // Prevents the row's onClick from firing when changing the dropdown
//                             onClick={(e) => e.stopPropagation()} 
//                         >
//                             <option value="Processing">Processing</option>
//                             <option value="Shipped">Shipped</option>
//                             <option value="Delivered">Delivered</option>
//                             <option value="Cancelled">Cancelled</option>
//                         </select>
//                     </td>
//                 </tr>
//                 ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Orders;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Trash2, CheckCircle } from 'lucide-react';
// import api from '../../api';

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const response = await api.get('/admin/orders/');
//         // Ensure that the response data is always an array
//         setOrders(response.data.results || response.data || []);
//       } catch (err) {
//         console.error("Failed to fetch orders:", err);
//         setError('Failed to load orders. Please make sure you are logged in as an admin.');
//       } finally {
//         setLoading(false); 
//       }
//     };
    
//     fetchOrders();
//   }, []);

//   const handleUpdateStatus = async (orderId, newStatus, e) => {
//     // Stop the click from propagating to the table row's onClick handler
//     e.stopPropagation();
//     try {
//       // Make the API call to update the status on the backend
//       await api.patch(`/admin/orders/${orderId}/update-status/`, { status: newStatus });
//       // Update the component's state to reflect the change immediately
//       setOrders(currentOrders => 
//         currentOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
//       );
//     } catch (err) {
//       console.error("Failed to update status", err);
//       // Let the user know if the update failed
//       alert('Failed to update the order status.');
//     }
//   };

//   const handleDeleteOrder = async (orderId, e) => {
//     // Stop the click from propagating to the table row's onClick handler
//     e.stopPropagation();
//     // Confirm with the user before permanently deleting the order
//     if (window.confirm('Are you sure you want to permanently delete this order?')) {
//       try {
//         // Make the API call to delete the order from the backend
//         await api.delete(`/admin/orders/${orderId}/delete/`);
//         // Remove the deleted order from the component's state
//         setOrders(currentOrders => currentOrders.filter(o => o.id !== orderId));
//         alert('Order deleted successfully!');
//       } catch (err) {
//         console.error("Failed to delete order", err);
//         alert('Failed to delete the order.');
//       }
//     }
//   };

//   // Helper function to determine the CSS class based on order status
//   const getStatusClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'processing': return 'bg-yellow-100 text-yellow-800';
//       case 'shipped': return 'bg-blue-100 text-blue-800';
//       case 'delivered': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Display a loading message while fetching data
//   if (loading) return <div className="text-center text-gray-500 p-8 dark:text-gray-400">Loading orders...</div>;
//   // Display an error message if the data fetch fails
//   if (error) return <div className="text-center text-red-500 p-4 bg-red-50 rounded-md">{error}</div>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Orders</h1>

//       <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-x-auto">
//         <table className="w-full text-sm text-left">
//           <thead className="bg-gray-50 dark:bg-black border border-gray-200 text-xs text-gray-700 dark:text-gray-300 uppercase">
//             <tr>
//               <th className="px-6 py-3">Order ID</th>
//               <th className="px-6 py-3">Customer</th>
//               <th className="px-6 py-3">Date</th>
//               <th className="px-6 py-3">Total</th>
//               <th className="px-6 py-3">Status</th>
//               <th className="px-6 py-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-10 text-gray-500 dark:text-gray-400">No orders found.</td>
//               </tr>
//             ) : (
//               orders.map((order) => (
//                 <tr 
//                   key={order.id} 
//                   className="bg-white dark:bg-black border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
//                   onClick={() => navigate(`/admin/orders/${order.id}`)}
//                 >
//                   <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 hover:underline">#{order.id}</td>
//                   <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{order.shipping_address?.firstName} {order.shipping_address?.lastName}</td>
//                   <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{new Date(order.created_at).toLocaleDateString()}</td>
//                   <td className="px-6 py-4 text-gray-900 dark:text-gray-200 font-medium">${order.total_price}</td>
//                   <td className="px-6 py-4">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 flex items-center gap-2">
//                     <select
//                       // Use `value` instead of `defaultValue` to make this a controlled component
//                       value={order.status}
//                       onChange={(e) => handleUpdateStatus(order.id, e.target.value, e)}
//                       className="text-black dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-1"
//                       // Stop propagation to prevent navigating when clicking the select
//                       onClick={(e) => e.stopPropagation()} 
//                     >
//                       <option value="Processing">Processing</option>
//                       <option value="Shipped">Shipped</option>
//                       <option value="Delivered">Delivered</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
                    
//                     {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
//                       <button 
//                         onClick={(e) => handleUpdateStatus(order.id, 'Delivered', e)}
//                         className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
//                         title="Mark as Delivered"
//                       >
//                         <CheckCircle size={16} />
//                       </button>
//                     )}

//                     <button 
//                       onClick={(e) => handleDeleteOrder(order.id, e)}
//                       className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-500"
//                       title="Delete Order"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Orders;









// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Trash2, CheckCircle } from 'lucide-react';
// import api from '../../api';

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // Create a single, reusable function to fetch the latest orders from the backend.
//   // useCallback ensures this function isn't recreated on every render.
//   const fetchOrders = useCallback(async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await api.get('/admin/orders/');
//       // This is the correct way to get the list of orders from your backend.
//       // The previous code was looking for 'results' which might not always exist.
//       setOrders(response.data.orders || []);
//     } catch (err) {
//       console.error("Failed to fetch orders:", err);
//       setError('Failed to load orders. Please make sure you are logged in as an admin.');
//     } finally {
//       setLoading(false);
//     }
//   }, []); // Empty dependency array means this function is created only once.

//   // Fetch orders when the component first loads.
//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   const handleUpdateStatus = async (orderId, newStatus, e) => {
//     e.stopPropagation();
//     try {
//       await api.patch(`/admin/orders/${orderId}/update-status/`, { status: newStatus });
//       // After a successful update, refresh the list to show the permanent change.
//       fetchOrders();
//     } catch (err) {
//       console.error("Failed to update status", err);
//       alert('Failed to update the order status.');
//     }
//   };

//   const handleDeleteOrder = async (orderId, e) => {
//     e.stopPropagation();
//     if (window.confirm('Are you sure you want to permanently delete this order?')) {
//       try {
//         // Wait for the backend to confirm the deletion.
//         await api.delete(`/admin/orders/${orderId}/delete/`);
        
//         // THIS IS THE CRITICAL FIX:
//         // Instead of manually removing the order from the frontend state,
//         // we ask the backend for the new, updated list of orders.
//         // This guarantees the frontend and backend are perfectly in sync.
//         alert('Order deleted successfully!');
//         fetchOrders(); // Re-fetch the data to get the true, permanent state.

//       } catch (err) {
//         console.error("Failed to delete order", err);
//         alert('Failed to delete the order.');
//       }
//     }
//   };

//   const getStatusClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'processing': return 'bg-yellow-100 text-yellow-800';
//       case 'shipped': return 'bg-blue-100 text-blue-800';
//       case 'delivered': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) return <div className="text-center text-gray-500 p-8 dark:text-gray-400">Loading orders...</div>;
//   if (error) return <div className="text-center text-red-500 p-4 bg-red-50 rounded-md">{error}</div>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Orders</h1>
//       <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-x-auto">
//         <table className="w-full text-sm text-left">
//           <thead className="bg-gray-50 dark:bg-black border border-gray-200 text-xs text-gray-700 dark:text-gray-300 uppercase">
//             <tr>
//               <th className="px-6 py-3">Order ID</th>
//               <th className="px-6 py-3">Customer</th>
//               <th className="px-6 py-3">Date</th>
//               <th className="px-6 py-3">Total</th>
//               <th className="px-6 py-3">Status</th>
//               <th className="px-6 py-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-10 text-gray-500 dark:text-gray-400">No orders found.</td>
//               </tr>
//             ) : (
//               orders.map((order) => (
//                 <tr
//                   key={order.id}
//                   className="bg-white dark:bg-black border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
//                   onClick={() => navigate(`/admin/orders/${order.id}`)}
//                 >
//                   <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 hover:underline">#{order.id}</td>
//                   <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{order.shipping_address?.firstName} {order.shipping_address?.lastName}</td>
//                   <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{new Date(order.created_at).toLocaleDateString()}</td>
//                   <td className="px-6 py-4 text-gray-900 dark:text-gray-200 font-medium">${order.total_price}</td>
//                   <td className="px-6 py-4">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 flex items-center gap-2">
//                     <select
//                       value={order.status}
//                       onChange={(e) => handleUpdateStatus(order.id, e.target.value, e)}
//                       className="text-black dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-1"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <option value="Processing">Processing</option>
//                       <option value="Shipped">Shipped</option>
//                       <option value="Delivered">Delivered</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                     {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
//                       <button
//                         onClick={(e) => handleUpdateStatus(order.id, 'Delivered', e)}
//                         className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
//                         title="Mark as Delivered"
//                       >
//                         <CheckCircle size={16} />
//                       </button>
//                     )}
//                     <button
//                       onClick={(e) => handleDeleteOrder(order.id, e)}
//                       className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-500"
//                       title="Delete Order"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Orders;


// In Orders.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle } from 'lucide-react';
import api from '../../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/orders/');
      // THIS IS THE CRITICAL LINE: It specifically looks for `response.data.orders`
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError('Failed to load orders. Please verify you are logged in as a superuser.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  // ... (the rest of your handleDeleteOrder, handleUpdateStatus, etc. functions can remain the same)

  const handleUpdateStatus = async (orderId, newStatus, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/admin/orders/${orderId}/update-status/`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
      alert('Failed to update the order status.');
    }
  };

  const handleDeleteOrder = async (orderId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this order?')) {
      try {
        await api.delete(`/admin/orders/${orderId}/delete/`);
        alert('Order deleted successfully!');
        fetchOrders();
      } catch (err) {
        console.error("Failed to delete order", err);
        alert('Failed to delete the order.');
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center text-gray-500 p-8 dark:text-gray-400">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500 p-4 bg-red-50 rounded-md">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Orders</h1>
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          {/* Table Head */}
          <thead className="bg-gray-50 dark:bg-black border-b dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 uppercase">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500 dark:text-gray-400">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} onClick={() => navigate(`/admin/orders/${order.id}`)}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer bg-white dark:bg-black">
                  <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 hover:underline">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{order.shipping_address?.firstName} {order.shipping_address?.lastName}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">${order.total_price}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>{order.status}</span></td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <select value={order.status} onChange={(e) => handleUpdateStatus(order.id, e.target.value, e)} onClick={(e) => e.stopPropagation()}
                      className="text-black dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-1">
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button onClick={(e) => handleDeleteOrder(order.id, e)} className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-500" title="Delete Order">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;