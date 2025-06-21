import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    // Main container uses background and foreground colors
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* H1 remains explicit purple */}
        <h1 className="text-4xl font-extrabold text-purple-800 mb-10 text-center">
          🛒 Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          // Empty cart section uses card background and foreground text
          <div className="text-center py-16 bg-card text-card-foreground rounded-xl shadow-md border border-border">
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full hover:opacity-90 transition">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  // Cart item uses card background and foreground text, with border
                  className="flex items-start bg-card text-card-foreground p-6 rounded-2xl shadow hover:shadow-lg transition border border-border"
                >
                  <div className="w-24 h-24 bg-muted rounded-xl overflow-hidden">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 pl-6 space-y-2">
                    {/* Item name remains explicit purple */}
                    <h3 className="font-semibold text-xl text-purple-800">{item.name}</h3>
                    {/* Item price remains explicit pink */}
                    <p className="text-lg font-medium text-pink-600">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      {/* Quantity buttons use outline variant (semantic border/text) */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      {/* Quantity span text uses foreground */}
                      <span className="text-md font-medium text-foreground">{item.quantity}</span>
                      {/* Quantity buttons use outline variant */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>

                      {/* Trash icon remains explicit red */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto text-red-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              {/* Order summary uses card background and foreground text */}
              <div className="bg-card text-card-foreground rounded-2xl shadow-lg p-8 sticky top-20 border border-border">
                {/* Order summary title remains explicit purple */}
                <h2 className="text-2xl font-bold text-purple-800 mb-6">
                  Order Summary
                </h2>
                {/* Summary text uses foreground */}
                <div className="space-y-4 text-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    {/* Shipping remains explicit green */}
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  {/* Total line uses border and foreground */}
                  <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-full hover:opacity-90 transition text-lg font-semibold">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link to="/">
                  {/* Continue Shopping button uses outline variant */}
                  <Button
                    variant="outline"
                    className="w-full mt-3 border-border hover:bg-accent"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
