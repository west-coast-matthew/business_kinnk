'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import '@/styles/components/header.scss';

export function Header() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <p className="header-tagline">Ropes not roses</p>
        </div>
      </div>

      <nav className="header-nav">
        <div className="container">
          <div className="nav-content">
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <Link href="/" className="logo">
              <span className="logo-text">knnk</span>
            </Link>

            <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
              <li>
                <Link href="/collections">Collections</Link>
              </li>
              <li>
                <Link href="/products">Shop All</Link>
              </li>
              <li>
                <Link href="/articles">Stories</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>

            <div className="nav-actions">
              <Link href="/account" className="nav-link" title="Account">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>

              <Link href="/cart" className="nav-link cart-link" title="Cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
