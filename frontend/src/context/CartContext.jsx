import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    if (!storedCart) return [];
    try {
      const parsed = JSON.parse(storedCart);
      return parsed.map(item => ({
        ...item,
        price: Number(item.price),
      }));
    } catch {
      return [];
    }
  });
  

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      const productWithNumericPrice = { ...product, price: Number(product.price) };
  
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...productWithNumericPrice, quantity: 1 }];
    });
  };
  
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // --- STEP 1: DEFINE THE clearCart FUNCTION ---
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };
  // ------------------------------------------

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        cartTotal,
        // --- STEP 2: ADD clearCart TO THE VALUE PROP ---
        clearCart 
        // ---------------------------------------------
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);