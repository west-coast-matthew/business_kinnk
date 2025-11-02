'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { analytics } from '@/lib/analytics/tracker';
import '@/styles/pages/cart.scss';

export default function CartPage() {
  const { cart, removeItem, updateQuantity, isLoading } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    analytics.pageView({
      path: '/cart',
      title: 'Shopping Cart',
    });
  }, []);

  if (!mounted || isLoading) {
    return <div className="cart-page loading">Loading cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-page empty">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h1>Your cart is empty</h1>
            <p>Start shopping to add items to your cart</p>
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>{cart.items.length} items</p>
        </div>
      </div>

      <div className="container">
        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="items-header">
              <span>Product</span>
              <span className="price-header">Price</span>
              <span className="qty-header">Qty</span>
              <span className="total-header">Total</span>
              <span className="action-header"></span>
            </div>

            {cart.items.map((item, index) => (
              <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="cart-item">
                <div className="item-details">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="item-image"
                  />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    {item.size && <p className="variant-info">Size: {item.size}</p>}
                    {item.color && <p className="variant-info">Color: {item.color}</p>}
                  </div>
                </div>

                <span className="item-price">${item.price.toFixed(2)}</span>

                <div className="item-quantity">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1, item.size, item.color)
                    }
                    disabled={item.quantity === 1}
                  >
                    −
                  </button>
                  <input type="number" value={item.quantity} readOnly />
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1, item.size, item.color)
                    }
                  >
                    +
                  </button>
                </div>

                <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>

                <button
                  className="item-remove"
                  onClick={() => removeItem(item.productId, item.size, item.color)}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="order-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Tax (estimated)</span>
                <span>${cart.tax.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>${cart.shipping.toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="btn btn-primary btn-full">
                Proceed to Checkout
              </Link>

              <Link href="/products" className="btn btn-secondary btn-full">
                Continue Shopping
              </Link>

              {cart.subtotal > 0 && cart.subtotal < 75 && (
                <div className="shipping-notice">
                  <p>
                    Free shipping on orders over $75. Add ${(75 - cart.subtotal).toFixed(2)} more to
                    qualify!
                  </p>
                </div>
              )}

              {cart.subtotal >= 75 && (
                <div className="shipping-notice success">
                  <p>✓ You qualify for free shipping!</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
