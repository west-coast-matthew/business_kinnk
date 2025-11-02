'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Carousel } from '@/components/Carousel';
import { ProductCard } from '@/components/ProductCard';
import { apiClient } from '@/lib/api/client';
import { analytics } from '@/lib/analytics/tracker';
import { Collection, Product } from '@/types';
import '@/styles/pages/home.scss';

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [collectionsRes, productsRes] = await Promise.all([
          apiClient.getFeaturedCollections(),
          apiClient.getFeaturedProducts(),
        ]);

        if (collectionsRes.success && collectionsRes.data) {
          setCollections(collectionsRes.data);
        }

        if (productsRes.success && productsRes.data) {
          setFeaturedProducts(productsRes.data);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Track page view
    analytics.pageView({
      path: '/',
      title: 'Home',
    });
  }, []);

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <Carousel items={collections} autoPlay={true} interval={6000} />

      {/* Featured Section */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <h2>Featured Collections</h2>
            <p>Discover our most coveted items</p>
            <Link href="/collections" className="btn btn-secondary">
              Explore Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">New Arrivals</h2>

          {isLoading ? (
            <div className="loading-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          <div className="content-grid">
            <article className="content-card">
              <div className="content-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                </svg>
              </div>
              <h3>Authentic & Thoughtful</h3>
              <p>Each design is crafted with intention, celebrating confidence and personal expression.</p>
            </article>

            <article className="content-card">
              <div className="content-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>Mystery & Elegance</h3>
              <p>Inspired by the timeless allure of mystery, our designs invite curiosity and conversation.</p>
            </article>

            <article className="content-card">
              <div className="content-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                </svg>
              </div>
              <h3>Free Shipping</h3>
              <p>Orders over $75 ship free. Fast, discreet packaging for your peace of mind.</p>
            </article>

            <article className="content-card">
              <div className="content-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <h3>30-Day Returns</h3>
              <p>Shop with confidence. Easy returns within 30 days if you're not completely satisfied.</p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Community</h2>
            <p>Get exclusive access to new collections, insider stories, and special offers.</p>
            <Link href="#newsletter" className="btn btn-primary">
              Subscribe Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
