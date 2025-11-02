'use client';

import Link from 'next/link';
import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { analytics } from '@/lib/analytics/tracker';
import '@/styles/components/footer.scss';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setSubscribeStatus('loading');

    try {
      const response = await apiClient.subscribeNewsletter({
        email,
        preferences: {
          categories: ['all'],
          frequency: 'weekly',
        },
      });

      if (response.success) {
        analytics.newsletterSignup({
          email,
          source: 'footer',
        });

        setSubscribeStatus('success');
        setSubscribeMessage('Thank you for subscribing!');
        setEmail('');

        // Reset message after 3 seconds
        setTimeout(() => {
          setSubscribeStatus('idle');
          setSubscribeMessage('');
        }, 3000);
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(response.error || 'Subscription failed');
      }
    } catch (error) {
      setSubscribeStatus('error');
      setSubscribeMessage('An error occurred. Please try again.');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Newsletter Section */}
            <div className="footer-section footer-newsletter">
              <h3>Join Our Community</h3>
              <p>Subscribe to our newsletter for exclusive offers and content.</p>

              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={subscribeStatus === 'loading'}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={subscribeStatus === 'loading'}
                  >
                    {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>

                {subscribeMessage && (
                  <p className={`message ${subscribeStatus}`}>
                    {subscribeMessage}
                  </p>
                )}
              </form>
            </div>

            {/* Shop Section */}
            <div className="footer-section">
              <h4>Shop</h4>
              <ul>
                <li>
                  <Link href="/collections">Collections</Link>
                </li>
                <li>
                  <Link href="/products">All Products</Link>
                </li>
                <li>
                  <Link href="/collections?filter=sale">Sale</Link>
                </li>
                <li>
                  <Link href="/new-arrivals">New Arrivals</Link>
                </li>
              </ul>
            </div>

            {/* Customer Service Section */}
            <div className="footer-section">
              <h4>Customer Service</h4>
              <ul>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/shipping">Shipping Info</Link>
                </li>
                <li>
                  <Link href="/returns">Returns & Exchanges</Link>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/blog">Blog & Articles</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="footer-bottom">
            <div className="footer-legal">
              <p>&copy; {new Date().getFullYear()} knnk. All rights reserved.</p>
              <p>Celebrating freedom of expression and personal style.</p>
            </div>

            <div className="footer-social">
              <p>Follow Us</p>
              <div className="social-links">
                <a href="#" aria-label="Instagram" title="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path
                      d="M16.5 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12 9a3 3 0 110 6 3 3 0 010-6z"
                      fill="white"
                    ></path>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" title="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7"></path>
                  </svg>
                </a>
                <a href="#" aria-label="TikTok" title="TikTok">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
