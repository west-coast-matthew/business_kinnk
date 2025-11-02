'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { apiClient } from '@/lib/api/client';
import { analytics } from '@/lib/analytics/tracker';
import { Category, Product } from '@/types';
import '@/styles/pages/category.scss';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const categoryRes = await apiClient.getCategoryBySlug(slug);
        if (categoryRes.success && categoryRes.data) {
          setCategory(categoryRes.data);

          // Load products for this category
          const productsRes = await apiClient.getProducts({
            category: categoryRes.data.slug,
          });

          if (productsRes.success && productsRes.data) {
            setProducts(productsRes.data);
          }
        }
      } catch (error) {
        console.error('Failed to load category:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();

    analytics.pageView({
      path: `/collections/${slug}`,
      title: `Category: ${slug}`,
    });
  }, [slug]);

  if (isLoading) {
    return <div className="category-page loading">Loading...</div>;
  }

  if (!category) {
    return (
      <div className="category-page error">
        <div className="container">
          <h1>Category not found</h1>
          <p>Sorry, we couldn't find the category you're looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="container">
          <h1>{category.name}</h1>
          <p>{category.description}</p>
          <span className="product-count">{products.length} products</span>
        </div>
      </div>

      {/* Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <section className="subcategories-section">
          <div className="container">
            <h2>Shop by Type</h2>
            <div className="subcategories-grid">
              {category.subcategories.map((subcat) => (
                <div key={subcat.id} className="subcat-item">
                  <button className="subcat-link">
                    {subcat.name}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="products-section">
        <div className="container">
          {products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No products in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
