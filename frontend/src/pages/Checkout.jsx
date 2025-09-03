
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { X, MapPin, Phone, User, Mail, CheckCircle, Clock } from "lucide-react";
import { toast } from 'react-hot-toast';

// --- THIS IS THE FIX (PART 1) ---
import axios from 'axios';
import { BASE_URL } from '../api'; // Make sure this path is correct

// Country codes data (remains unchanged)
const countryCodes = [
    { code: "+1", country: "US", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+92", country: "PK", flag: "🇵🇰" },
    { code: "+86", country: "CN", flag: "🇨🇳" },
    // ... add other countries as needed
];

// Popular countries list (remains unchanged)
const countriesWithCities = {
    "United States": ["New York", "Los Angeles", "Chicago"],
    "United Kingdom": ["London", "Birmingham", "Manchester"],
    "Pakistan": ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Islamabad"],
    // ... add other countries and cities
};

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderStatus, setOrderStatus] = useState('cart');
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "",
        country: "", city: "", address: "", zipCode: ""
    });
    const [availableCities, setAvailableCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedCountryCode, setSelectedCountryCode] = useState("+92");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'country') {
            setAvailableCities(countriesWithCities[value] || []);
            setFormData(prev => ({ ...prev, [name]: value, city: "" }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP/Postal code is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setOrderStatus('ordering');
            const orderData = {
                items: cart,
                total_price: cartTotal,
                // Spread the form data here to send individual fields
                ...formData, 
                // Overwrite the phone number with the full version including country code
                phone: `${selectedCountryCode}${formData.phone}` 
            };

            try {
                // --- THIS IS THE FIX (PART 2) ---
                // Use a direct `axios.post` call, NOT `api.post`
                // This makes a public request without an admin token.
                const response = await axios.post(`${BASE_URL}orders/create/`, orderData);

                setOrderStatus('ordered');
                if (clearCart) {
                    clearCart();
                }
                toast.success(`🎉 Order placed successfully! Order ID: ${response.data.order_id}`);
                setShowOrderForm(false);
                setFormData({
                    firstName: "", lastName: "", email: "", phone: "",
                    country: "", city: "", address: "", zipCode: ""
                });

            } catch (err) {
                console.error("Failed to place order:", err);
                toast.error("There was an error placing your order. Please try again.");
                setOrderStatus('cart');
            }
        } else {
            toast.error("Please fill in all required fields correctly.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-200 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mb-8 text-center">
                    {orderStatus === 'ordered' ? '🎉 Order Confirmed!' : '🧾 Checkout'}
                </h1>
                
                {orderStatus === 'ordered' ? (
                    <div className="text-center">
                        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                        <h2 className="mt-4 text-2xl font-semibold">Thank you for your order!</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Your order has been placed and is being processed.</p>
                        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
                            Back to Shop
                        </Link>
                    </div>
                ) : cart.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">Your cart is empty.</p>
                        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
                            Back to Shop
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Clock className="mr-2 text-blue-500" /> Items in Cart
                            </h2>
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                {cart.map((item) => (
                                    <li key={item.id} className="py-4 flex justify-between items-center">
                                        <div>
                                            <span className="font-medium">{item.name}</span>{" "}
                                            <span className="text-sm text-gray-500 dark:text-gray-400">× {item.quantity}</span>
                                        </div>
                                        <div className="text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-lg font-bold flex justify-between">
                            <span>Cart Total:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        
                        <button
                            className={`w-full text-white py-3 rounded-full text-lg font-semibold transition ${
                                orderStatus === 'ordering' 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90'
                            }`}
                            onClick={() => setShowOrderForm(true)}
                            disabled={orderStatus === 'ordering'}
                        >
                            {orderStatus === 'ordering' ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                )}
            </div>

            {showOrderForm && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 flex items-center">
                                <User className="mr-2" /> Shipping Details
                            </h2>
                            <button onClick={() => setShowOrderForm(false)} className="p-1">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitOrder} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">First Name *</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-800 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'}`}
                                        placeholder="John" />
                                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Name *</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-800 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'}`}
                                        placeholder="Doe" />
                                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1"><Mail className="inline w-4 h-4 mr-1"/> Email Address *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-800 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'}`}
                                    placeholder="john.doe@example.com" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1"><Phone className="inline w-4 h-4 mr-1"/> Phone Number *</label>
                                <div className="flex">
                                    <select value={selectedCountryCode} onChange={(e) => setSelectedCountryCode(e.target.value)}
                                        className="px-3 py-2 border border-r-0 rounded-l-lg focus:outline-none bg-gray-100 dark:bg-gray-700">
                                        {countryCodes.map((item) => (<option key={item.code} value={item.code}>{item.flag} {item.code}</option>))}
                                    </select>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                        className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-800 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'}`}
                                        placeholder="3001234567" />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Country *</label>
                                    <select name="country" value={formData.country} onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-800 ${errors.country ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'}`}>
                                        <option value="">Select Country</option>
                                        {Object.keys(countriesWithCities).map((country) => (<option key={country} value={country}>{country}</option>))}
                                    </select>
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">City *</label>
                                    <select name="city" value={formData.city} onChange={handleInputChange}
                                        disabled={!formData.country || availableCities.length === 0}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-800 disabled:bg-gray-200 dark:disabled:bg-gray-700 ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'}`}>
                                        <option value="">Select City</option>
                                        {availableCities.map((city) => (<option key={city} value={city}>{city}</option>))}
                                    </select>
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1"><MapPin className="inline w-4 h-4 mr-1"/> Complete Address *</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-800 ${errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'}`}
                                    placeholder="House #123, Street 4, Sector G-10/2" />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">ZIP/Postal Code *</label>
                                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-800 ${errors.zipCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'}`}
                                    placeholder="44000" />
                                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowOrderForm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition">
                                    Confirm Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
