// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import api from '../../api';

// const OrderDetail = () => {
//   const { orderId } = useParams(); // Gets the ID from the URL
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await api.get(`/admin/orders/${orderId}/`);
//         setOrder(response.data);
//       } catch (err) {
//         setError('Failed to fetch order details.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrder();
//   }, [orderId]);

//   if (loading) return <div>Loading order details...</div>;
//   if (error) return <div>{error}</div>;
//   if (!order) return <div>Order not found.</div>;

//   const { shipping_address: customer, items } = order;

//   return (
//     <div className="p-6">
//       <Link to="/admin/orders" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Orders</Link>
//       <h1 className="text-3xl font-bold mb-6">Order #{order.id}</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Customer & Shipping Details */}
//         <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4 border-b pb-2">Customer & Shipping Information</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div><strong>Name:</strong> {customer?.firstName} {customer?.lastName}</div>
//             <div><strong>Email:</strong> {customer?.email}</div>
//             <div><strong>Phone:</strong> {customer?.phone}</div>
//             <div><strong>Country:</strong> {customer?.country}</div>
//             <div><strong>City:</strong> {customer?.city}</div>
//             <div><strong>ZIP Code:</strong> {customer?.zipCode}</div>
//             <div className="col-span-2"><strong>Address:</strong> {customer?.address}</div>
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
//           <div><strong>Status:</strong> <span className="font-semibold text-green-600">{order.status}</span></div>
//           <div><strong>Total:</strong> <span className="font-bold text-xl">${order.total_price}</span></div>
//           <div><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</div>
//         </div>
//       </div>

//       {/* Items in Order */}
//       <div className="mt-6 bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Items in this Order</h2>
//         <ul className="divide-y">
//           {items?.map(item => (
//             <li key={item.id} className="py-3 flex justify-between">
//               <div>
//                 <span className="font-semibold">{item.product.name}</span>
//                 <span className="text-gray-600"> (x{item.quantity})</span>
//               </div>
//               <span>${item.price}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default OrderDetail;



import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle } from 'lucide-react';
import api from '../../api';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/admin/orders/${orderId}/`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/update-status/`, { status: newStatus });
      setOrder(prevOrder => ({ ...prevOrder, status: newStatus }));
    } catch (err) {
      console.error("Failed to update status", err);
      alert('Failed to update the order status.');
    }
  };

  const handleDeleteOrder = async () => {
    if (window.confirm('Are you sure you want to permanently delete this order?')) {
      try {
        await api.delete(`/admin/orders/${orderId}/delete/`);
        alert('Order deleted successfully!');
        navigate('/admin/orders');
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

  if (loading) return <div className="dark:text-gray-300">Loading order details...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Order not found.</div>;

  const { shipping_address: customer, items } = order;

  return (
    <div className="p-6">
      <Link to="/admin/orders" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">&larr; Back to Orders</Link>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Order #{order.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-black p-6 rounded-lg shadow border dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-white dark:border-gray-700">Customer & Shipping Information</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-800 dark:text-gray-300">
            <div><strong>Name:</strong> {customer?.firstName} {customer?.lastName}</div>
            <div><strong>Email:</strong> {customer?.email}</div>
            <div><strong>Phone:</strong> {customer?.phone}</div>
            <div><strong>Country:</strong> {customer?.country}</div>
            <div><strong>City:</strong> {customer?.city}</div>
            <div><strong>ZIP Code:</strong> {customer?.zipCode}</div>
            <div className="col-span-2"><strong>Address:</strong> {customer?.address}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-black p-6 rounded-lg shadow border dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-white dark:border-gray-700">Order Summary</h2>
          <div className="space-y-3 text-gray-800 dark:text-gray-300">
            <div><strong>Status:</strong> <span className={`font-semibold px-2 py-1 text-xs rounded-full ${getStatusClass(order.status)}`}>{order.status}</span></div>
            <div><strong>Total:</strong> <span className="font-bold text-xl dark:text-white">${order.total_price}</span></div>
            <div><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</div>
          </div>
          
          <div className="mt-6 pt-4 border-t dark:border-black">
            <h3 className="font-semibold text-gray-700 dark:text-gray-400 mb-2">Actions</h3>
            <div className="flex items-center gap-2">
              <select
                value={order.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className="text-xs bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded p-1 flex-grow"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleDeleteOrder}
                className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-500"
                title="Delete Order"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-black p-6 rounded-lg shadow border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Items in this Order</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-gray-200">
          {items?.map(item => (
            <li key={item.id} className="py-3 flex justify-between">
              <div>
                <span className="font-semibold">{item.product?.name || 'Product Name Missing'}</span>
                <span className="text-gray-600 dark:text-gray-400"> (x{item.quantity})</span>
              </div>
              <span>${item.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetail;