'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { analytics } from '@/lib/analytics/tracker';
import { apiClient } from '@/lib/api/client';
import { Address } from '@/types';
import '@/styles/pages/checkout.scss';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (cart.items.length === 0 && !orderPlaced) {
      router.push('/cart');
    }

    analytics.trackCheckout({
      cartValue: cart.total,
      itemCount: cart.items.length,
      step: step === 'shipping' ? 'cart' : step,
    });
  }, [step, cart.items.length, cart.total, router, orderPlaced]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const response = await apiClient.createOrder(cart.items, shippingAddress, paymentInfo);

      if (response.success && response.data) {
        analytics.purchase({
          orderId: response.data.id,
          value: response.data.total,
          currency: 'USD',
          items: response.data.items,
        });

        clearCart();
        setOrderPlaced(true);
        setStep('confirmation');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="confirmation-message">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. We'll send you a confirmation email shortly.</p>
            <div className="confirmation-actions">
              <Link href="/" className="btn btn-primary">
                Return to Home
              </Link>
              <Link href="/account/orders" className="btn btn-secondary">
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-grid">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Steps */}
            <div className="checkout-steps">
              <div className={`step ${step === 'shipping' ? 'active' : 'completed'}`}>
                <span className="step-number">1</span>
                <span className="step-label">Shipping</span>
              </div>
              <div className={`step ${step === 'payment' ? 'active' : step === 'confirmation' ? 'completed' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">Payment</span>
              </div>
              <div className={`step ${step === 'confirmation' ? 'active' : ''}`}>
                <span className="step-number">3</span>
                <span className="step-label">Confirmation</span>
              </div>
            </div>

            {/* Shipping Step */}
            {step === 'shipping' && (
              <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); setStep('payment'); }}>
                <h2>Shipping Address</h2>

                <div className="form-row">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={shippingAddress.firstName}
                    onChange={handleAddressChange}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={shippingAddress.lastName}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={shippingAddress.email}
                  onChange={handleAddressChange}
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  required
                />

                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
                  required
                />

                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, Suite, etc. (optional)"
                  value={shippingAddress.apartment}
                  onChange={handleAddressChange}
                />

                <div className="form-row">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={shippingAddress.zipCode}
                    onChange={handleAddressChange}
                    required
                  />
                  <select
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="MX">Mexico</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  Continue to Payment
                </button>
              </form>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
                <h2>Payment Information</h2>

                <input
                  type="text"
                  name="cardholderName"
                  placeholder="Cardholder Name"
                  value={paymentInfo.cardholderName}
                  onChange={handlePaymentChange}
                  required
                />

                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                  required
                />

                <div className="form-row">
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentInfo.expiryDate}
                    onChange={handlePaymentChange}
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setStep('shipping')} className="btn btn-secondary">
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <aside className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cart.items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="summary-item">
                  <div className="item-name">
                    <span>{item.name}</span>
                    <span className="item-qty">× {item.quantity}</span>
                  </div>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
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
          </aside>
        </div>
      </div>
    </div>
  );
}
