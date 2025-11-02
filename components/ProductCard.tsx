'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { analytics } from '@/lib/analytics/tracker';
import '@/styles/components/product-card.scss';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
}

export function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };

    addItem(item);

    analytics.addToCart({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      price: product.price,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  if (variant === 'list') {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="product-card product-card-list"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="product-image-wrapper">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="product-image"
          />
          {discount && <span className="discount-badge">{discount}% OFF</span>}
        </div>

        <div className="product-info">
          <div className="product-header">
            <h3>{product.name}</h3>
            {product.stock === 0 && <span className="out-of-stock">Out of Stock</span>}
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-footer">
            <div className="product-price">
              <span className="current-price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {product.rating && (
              <div className="product-rating">
                <span className="stars">★★★★★</span>
                <span className="rating-text">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            )}
          </div>

          <button
            className={`btn btn-primary btn-full ${addedToCart ? 'success' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addedToCart}
          >
            {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-wrapper">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="product-image"
        />

        {discount && <span className="discount-badge">{discount}% OFF</span>}

        {isHovered && product.stock > 0 && (
          <button
            className="btn btn-primary btn-add-to-cart"
            onClick={handleAddToCart}
          >
            {addedToCart ? '✓ Added' : 'Add to Cart'}
          </button>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        {product.rating && (
          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-count">({product.reviews})</span>
          </div>
        )}

        <div className="product-price">
          <span className="current-price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {product.stock === 0 && <span className="stock-status">Out of Stock</span>}
      </div>
    </Link>
  );
}
