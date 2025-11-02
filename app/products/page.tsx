'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { apiClient } from '@/lib/api/client';
import { analytics } from '@/lib/analytics/tracker';
import { Product } from '@/types';
import '@/styles/pages/products.scss';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  const category = searchParams.get('category');
  const search = searchParams.get('search');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getProducts({
          category: category || undefined,
          search: search || undefined,
        });

        if (response.success && response.data) {
          let sorted = [...response.data];

          switch (sortBy) {
            case 'price-low':
              sorted.sort((a, b) => a.price - b.price);
              break;
            case 'price-high':
              sorted.sort((a, b) => b.price - a.price);
              break;
            case 'newest':
              // Assuming newer products have higher IDs
              sorted.reverse();
              break;
            case 'featured':
            default:
              sorted.sort((a, b) => {
                if (a.featured !== b.featured) return b.featured ? 1 : -1;
                return 0;
              });
          }

          setProducts(sorted);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();

    analytics.pageView({
      path: `/products${category ? `?category=${category}` : ''}`,
      title: 'Products',
    });
  }, [category, search, sortBy]);

  const getPageTitle = () => {
    if (search) return `Search: ${search}`;
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)}`;
    return 'All Products';
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="container">
          <h1>{getPageTitle()}</h1>
          <p>{products.length} products</p>
        </div>
      </div>

      <section className="products-list-section">
        <div className="container">
          <div className="products-controls">
            <div className="control-group">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="product-count">
              Showing {products.length} results
            </div>
          </div>

          {isLoading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
