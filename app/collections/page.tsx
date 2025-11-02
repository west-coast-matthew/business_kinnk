'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api/client';
import { analytics } from '@/lib/analytics/tracker';
import { Category } from '@/types';
import '@/styles/pages/collections.scss';

export default function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await apiClient.getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    analytics.pageView({
      path: '/collections',
      title: 'Collections',
    });
  }, []);

  return (
    <div className="collections-page">
      <div className="page-header">
        <div className="container">
          <h1>Collections</h1>
          <p>Browse our curated collections designed for every mood and moment</p>
        </div>
      </div>

      <section className="collections-section">
        <div className="container">
          {isLoading ? (
            <div className="loading-grid">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : (
            <div className="collections-grid">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/collections/${category.slug}`}
                  className="collection-card"
                >
                  <div className="collection-image-wrapper">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="collection-image"
                    />
                    <div className="collection-overlay"></div>
                  </div>

                  <div className="collection-content">
                    <h2>{category.name}</h2>
                    <p>{category.description}</p>
                    <span className="collection-link">
                      Explore
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
