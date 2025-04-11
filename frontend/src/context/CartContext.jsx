import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item._id === product._id
      );
      if (existingProductIndex >= 0) {
        // If product already exists in cart, increase the quantity, but respect stock limit
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity = Math.min(
          updatedCart[existingProductIndex].quantity + quantity,
          product.countInStock // Ensure it doesn't exceed stock
        );
        return updatedCart;
      } else {
        // If product doesn't exist in cart, add it with the given quantity
        return [
          ...prevCart,
          { ...product, quantity: Math.min(quantity, product.countInStock) },
        ];
      }
    });
  };

  // Function to remove item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // Function to increase quantity of a product in the cart
  const increaseQty = (productId, countInStock) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, countInStock), // Ensure it doesn't exceed stock
            }
          : item
      )
    );
  };

  // Function to decrease quantity of a product in the cart
  const decreaseQty = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  // Check if user is authenticated (this can be a part of your auth context)
  const isAuthenticated = () => {
    // Example logic: If there's an auth token, consider the user authenticated
    return localStorage.getItem("authToken") !== null;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        isAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
