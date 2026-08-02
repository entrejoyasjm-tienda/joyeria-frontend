import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Leemos del localStorage para que no se pierdan los productos al recargar la página
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('entreJoyasCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('entreJoyasCart', JSON.stringify(cart));
  }, [cart]);

  // Agregar un producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  // Eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // Vaciar el carrito una vez finalizada la compra
  const clearCart = () => {
    setCart([]);
  };

  // Calcular el precio total de todos los artículos acumulados
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para utilizar el carrito en cualquier componente de manera sencilla
export function useCart() {
  return useContext(CartContext);
}