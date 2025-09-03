import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import api from '../../api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`admin/orders/${id}/`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.patch(`admin/orders/${id}/update-status/`, { status: newStatus });
      setOrder(prevOrder => ({ ...prevOrder, status: newStatus }));
    } catch (err) {
      console.error("Failed to update status", err);
      alert('Failed to update the order status.');
    }
  };

  const handleDeleteOrder = async () => {
    if (window.confirm('Are you sure you want to permanently delete this order?')) {
      try {
        await api.delete(`admin/orders/${id}/delete/`);
        alert('Order deleted successfully!');
        navigate('/dashboard/orders');
      } catch (err) {
        console.error("Failed to delete order", err);
        alert('Failed to delete the order.');
      }
    }
  };

  // This function correctly determines the CSS class for the status badge
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

  const { items } = order;

  return (
    <div className="p-6">
      <Link to="/dashboard/orders" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">&larr; Back to Orders</Link>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Order #{order.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-black p-6 rounded-lg shadow border dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-white dark:border-gray-700">Customer & Shipping Information</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-800 dark:text-gray-300">
         <div><strong>Name:</strong> {order.shipping_address?.firstName} {order.shipping_address?.lastName}</div>
         <div><strong>Email:</strong> {order.shipping_address?.email}</div>
         <div><strong>Phone:</strong> {order.shipping_address?.phone}</div>
         <div><strong>Country:</strong> {order.shipping_address?.country}</div>
         <div><strong>City:</strong> {order.shipping_address?.city}</div>
         <div><strong>ZIP Code:</strong> {order.shipping_address?.zipCode}</div>
         <div className="col-span-2"><strong>Address:</strong> {order.shipping_address?.address}</div>
        </div>
        </div>

        <div className="bg-white dark:bg-black p-6 rounded-lg shadow border dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-white dark:border-gray-700">Order Summary</h2>
          <div className="space-y-3 text-gray-800 dark:text-gray-300">
            
            {/* ✅ THIS IS THE FIX 👇 */}
            <div><strong>Status:</strong> <span className={`font-semibold px-2 py-1 text-xs rounded-full ${getStatusClass(order.status)}`}>{order.status}</span></div>
            
            <div><strong>Total:</strong> <span className="font-bold text-xl dark:text-white">${order.total_price}</span></div>
            <div><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</div>
          </div>
          <div className="mt-6 pt-4 border-t dark:border-gray-700">
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
              <button onClick={handleDeleteOrder} className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-500" title="Delete Order">
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