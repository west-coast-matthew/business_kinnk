'use client';

import { useState, useCallback, useEffect } from 'react';
import { CartItem, Cart } from '@/types';

const CART_STORAGE_KEY = 'kinnk-cart';

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  // Calculate totals
  const calculateTotals = useCallback((items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08; // 8% tax rate
    const shipping = items.length > 0 ? 9.99 : 0;
    const total = subtotal + tax + shipping;

    return {
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  }, []);

  // Add item to cart
  const addItem = useCallback(
    (item: CartItem) => {
      setCart((prevCart) => {
        const existingItem = prevCart.items.find(
          (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.color === item.color
        );

        let newItems: CartItem[];
        if (existingItem) {
          // Update quantity if item already exists
          newItems = prevCart.items.map((i) =>
            i.productId === item.productId && i.size === item.size && i.color === item.color
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          // Add new item
          newItems = [...prevCart.items, item];
        }

        return calculateTotals(newItems);
      });
    },
    [calculateTotals]
  );

  // Remove item from cart
  const removeItem = useCallback(
    (productId: string, size?: string, color?: string) => {
      setCart((prevCart) => {
        const newItems = prevCart.items.filter(
          (item) =>
            !(item.productId === productId && item.size === size && item.color === color)
        );
        return calculateTotals(newItems);
      });
    },
    [calculateTotals]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string, color?: string) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }

      setCart((prevCart) => {
        const newItems = prevCart.items.map((item) =>
          item.productId === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        );
        return calculateTotals(newItems);
      });
    },
    [removeItem, calculateTotals]
  );

  // Clear cart
  const clearCart = useCallback(() => {
    setCart({
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
    });
  }, []);

  // Get item count
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    itemCount,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
