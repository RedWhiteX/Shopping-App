
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
      const response = await api.get('admin/orders/')
      // THIS IS THE CRITICAL LINE: It specifically looks for `response.data.orders`
      setOrders(response.data.orders || response.data || []);
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
      await api.patch(`admin/orders/${orderId}/update-status/`, { status: newStatus });
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
        await api.delete(`admin/orders/${orderId}/delete/`);
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
                <tr key={order.id} onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer bg-white dark:bg-black">
                 <td className="px-6 py-4 font-medium text-blue-600 ...">#{order.id}</td>    
                 <td className="px-6 py-4 text-gray-900 dark:text-gray-200"> {order.shipping_address?.firstName} {order.shipping_address?.lastName}</td>
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