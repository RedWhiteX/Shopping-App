import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { X, MapPin, Phone, User, Mail, CheckCircle, Clock } from "lucide-react";
import { toast } from 'react-hot-toast'; // Import toast for notifications

// Country codes data (remains unchanged)
const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+92", country: "PK", flag: "🇵🇰" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+971", country: "AE", flag: "🇦🇪" }
];

// Popular countries list with their major cities (remains unchanged)
const countriesWithCities = {
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "San Francisco", "Columbus", "Charlotte"],
  "United Kingdom": ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Bristol", "Sheffield", "Leeds", "Edinburgh", "Leicester", "Coventry", "Bradford", "Cardiff", "Belfast", "Nottingham"],
  "Canada": ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria", "Halifax", "Oshawa", "Windsor"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra", "Sunshine Coast", "Wollongong", "Hobart", "Geelong", "Townsville", "Cairns", "Darwin"],
  "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hanover", "Nuremberg", "Duisburg"],
  "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon"],
  "Japan": ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kawasaki", "Kyoto", "Saitama", "Hiroshima", "Sendai", "Chiba", "Kitakyushu", "Sakai"],
  "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Tianjin", "Wuhan", "Dongguan", "Chengdu", "Nanjing", "Foshan", "Shenyang", "Qingdao", "Xi'an", "Hangzhou", "Zhengzhou"],
  "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"],
  "Pakistan": ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Peshawar", "Multan", "Hyderabad", "Islamabad", "Quetta", "Bahawalpur", "Sargodha", "Sialkot", "Sukkur", "Larkana"],
  "UAE": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain", "Khor Fakkan", "Dibba Al-Fujairah", "Jebel Ali", "Madinat Zayed", "Liwa Oasis", "Hatta", "Masafi"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Tabuk", "Buraidah", "Khamis Mushait", "Hail", "Hafar Al-Batin", "Jubail", "Dhahran", "Taif", "Najran"],
  "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Goiânia", "Belém", "Porto Alegre", "Guarulhos", "Campinas", "São Luís"],
  "Mexico": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez", "Torreón", "Querétaro", "San Luis Potosí", "Mérida", "Mexicali", "Aguascalientes", "Cuernavaca", "Saltillo"],
  "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania", "Venice", "Verona", "Messina", "Padua", "Trieste"],
  "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón"],
  "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen", "Enschede", "Haarlem", "Arnhem", "Zaanstad", "Haarlemmermeer"],
  "Sweden": ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköpon", "Helsingborg", "Jönköpon", "Norrköpon", "Lund", "Umeå", "Gävle", "Borås", "Södertälje"],
  "Norway": ["Oslo", "Bergen", "Stavanger", "Trondheim", "Drammen", "Fredrikstad", "Kristiansand", "Sandnes", "Tromsø", "Sarpsborg", "Skien", "Ålesund", "Sandefjord", "Haugesund", "Tønsberg"]
};

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const [orderedItems, setOrderedItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState('cart'); // 'cart', 'ordering', 'ordered'
  const [availableCities, setAvailableCities] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    zipCode: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'country') {
      setAvailableCities(countriesWithCities[value] || []);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        city: "" // Reset city when country changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for the field being typed into
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10,15}$/.test(formData.phone.replace(/\s/g, ""))) newErrors.phone = "Invalid phone number";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP/Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setOrderStatus('ordering');
      
      const orderData = {
        items: cart.map(item => ({
          ...item,
          orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          orderDate: new Date().toISOString(),
          status: 'processing'
        })),
        customerInfo: {
          ...formData,
          phone: `${selectedCountryCode} ${formData.phone}`
        },
        total: cartTotal,
        orderDate: new Date().toISOString()
      };

      setTimeout(() => {
        setOrderedItems(orderData.items); // Replace previous orders with new one
        setOrderStatus('ordered');
        
        if (clearCart) {
          clearCart(); // Clear the cart after successful order
        }
        
        // Using react-hot-toast instead of alert()
        toast.success(`🎉 Order placed successfully! Check confirmation below.`);
        
        setShowOrderForm(false);
        // Clear form data after submission
        setFormData({
          firstName: "", lastName: "", email: "", phone: "",
          country: "", city: "", address: "", zipCode: ""
        });
      }, 1500); // Simulate API call delay
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  return (
    // Main container uses background and foreground colors
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      {/* Main content card uses card background and foreground text */}
      <div className="max-w-4xl mx-auto bg-card text-card-foreground p-8 rounded-2xl shadow-lg border border-border">
        {/* H1 remains explicit purple */}
        <h1 className="text-3xl font-extrabold text-purple-800 mb-8 text-center">
          {orderStatus === 'ordered' ? '🎉 Order Confirmed!' : '🧾 Checkout'}
        </h1>
        
        {orderStatus === 'ordered' ? (
          // Order Confirmed State
          <div className="space-y-6">
            {/* Ordered Items List */}
            {orderedItems.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="mr-2 text-green-500" />
                  Your Ordered Items
                </h2>
                {/* List background uses muted color, items divide with border */}
                <ul className="divide-y divide-border bg-muted rounded-lg p-4">
                  {orderedItems.map((item) => (
                    <li key={`${item.id}-${item.orderId}`} className="py-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <div>
                          <span className="font-medium text-foreground">{item.name}</span>{" "}
                          <span className="text-sm text-muted-foreground">× {item.quantity}</span>
                          <div className="text-xs text-green-600 font-medium flex items-center mt-1">
                            ✅ Ordered • {item.status} • {new Date(item.orderDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Order ID: {item.orderId}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-green-600 font-medium">✓ ORDERED</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Order Summary (confirmed state) uses blue accent background and text */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-blue-800 dark:text-blue-200">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between text-sm mb-1 text-foreground">
                <span>Items ({orderedItems.length})</span>
                <span>${orderedItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1 text-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>${orderedItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link to="/">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
                  Back to Shop
                </button>
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          // Empty cart state (initial) uses card background and foreground text
          <div className="text-center py-12 bg-card text-card-foreground rounded-xl shadow-md border border-border">
            <p className="text-muted-foreground mb-4 text-lg">Your cart is empty.</p>
            <Link to="/">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
                Back to Shop
              </button>
            </Link>
          </div>
        ) : (
          // Cart Items and Place Order Button (initial state)
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="mr-2 text-blue-500" />
                Items in Cart
              </h2>
              {/* Cart items list background uses muted color */}
              <ul className="divide-y divide-border bg-muted rounded-lg p-4">
                {cart.map((item) => (
                  <li key={item.id} className="py-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div> {/* Remains blue */}
                      <div>
                        <span className="font-medium text-foreground">{item.name}</span>{" "}
                        <span className="text-sm text-muted-foreground">× {item.quantity}</span>
                        <div className="text-xs text-blue-600 font-medium">Ready to order</div> {/* Remains blue */}
                      </div>
                    </div>
                    <div className="text-right font-semibold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cart Total (initial state) uses card background and foreground text */}
            <div className="border-t border-border pt-6 text-lg font-bold flex justify-between bg-card p-4 rounded-lg text-foreground">
              <span>Cart Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            {/* Place Order Button remains gradient/white */}
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

      {/* Order Form Modal */}
      {showOrderForm && (
        // Modal overlay background (semi-transparent black) remains constant
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* Modal content background uses card semantic colors */}
          <div className="bg-card text-card-foreground rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-6">
              {/* Modal heading remains explicit purple */}
              <h2 className="text-2xl font-bold text-purple-800 flex items-center">
                <User className="mr-2" />
                Order Details
              </h2>
              {/* Close button icon color uses foreground, hover accent */}
              <button
                onClick={() => setShowOrderForm(false)}
                className="text-foreground hover:text-accent-foreground p-1"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Form fields: labels, inputs, selects, textarea use input/background/foreground/muted-foreground */}
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground ${
                      errors.firstName ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground ${
                      errors.lastName ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  <Mail className="inline w-4 h-4 mr-1 text-muted-foreground" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground ${
                    errors.email ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone with Country Code */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  <Phone className="inline w-4 h-4 mr-1 text-muted-foreground" />
                  Phone Number *
                </label>
                <div className="flex">
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="px-3 py-2 border border-r-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-ring bg-muted text-foreground"
                  >
                    {countryCodes.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground ${
                      errors.phone ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="1234567890"
                  />
                </div>
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Country and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground ${
                      errors.country ? 'border-destructive' : 'border-input'
                    }`}
                  >
                    <option value="">Select Country</option>
                    {Object.keys(countriesWithCities).map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && <p className="text-destructive text-xs mt-1">{errors.country}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    City *
                  </label>
                  {availableCities.length > 0 ? (
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground ${
                        errors.city ? 'border-destructive' : 'border-input'
                      }`}
                    >
                      <option value="">Select City</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground ${
                        errors.city ? 'border-destructive' : 'border-input'
                      }`}
                      placeholder={formData.country ? "Enter city name" : "Select country first"}
                      disabled={!formData.country}
                    />
                  )}
                  {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                  {formData.country && availableCities.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Popular cities not available for this country. Please type your city name.</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  <MapPin className="inline w-4 h-4 mr-1 text-muted-foreground" />
                  Complete Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground ${
                    errors.address ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="123 Main Street, Apartment 4B, Building Name"
                />
                {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
              </div>

              {/* ZIP Code */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  ZIP/Postal Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground ${
                    errors.zipCode ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="10001"
                />
                {errors.zipCode && <p className="text-destructive text-xs mt-1">{errors.zipCode}</p>}
              </div>

              {/* Order Summary (Modal) uses muted background and foreground text */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Order Summary</h3>
                <div className="flex justify-between text-sm text-foreground">
                  <span>Items ({cart.length})</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold text-foreground">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="flex-1 px-4 py-2 border border-input text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
                >
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
