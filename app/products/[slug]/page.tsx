'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { apiClient } from '@/lib/api/client';
import { analytics } from '@/lib/analytics/tracker';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';
import '@/styles/pages/product-detail.scss';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await apiClient.getProductBySlug(slug);
        if (response.success && response.data) {
          setProduct(response.data);

          // Set default values
          if (response.data.sizes && response.data.sizes.length > 0) {
            setSelectedSize(response.data.sizes[0]);
          }
          if (response.data.colors && response.data.colors.length > 0) {
            setSelectedColor(response.data.colors[0]);
          }

          // Track product view
          analytics.productView({
            productId: response.data.id,
            productName: response.data.name,
            price: response.data.price,
            category: response.data.category,
          });

          // Load related products
          const relatedRes = await apiClient.getProducts({
            category: response.data.category,
            limit: 4,
          });
          if (relatedRes.success && relatedRes.data) {
            setRelatedProducts(
              relatedRes.data.filter((p) => p.id !== response.data.id).slice(0, 4)
            );
          }
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      image: product.image,
    });

    analytics.addToCart({
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) {
    return <div className="product-detail-loading">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <div className="container">
          <h1>Product not found</h1>
          <p>Sorry, we couldn't find the product you're looking for.</p>
          <Link href="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="product-detail">
      <div className="container">
        <Link href="/products" className="breadcrumb">
          ← Back to Products
        </Link>

        <div className="product-grid">
          {/* Images */}
          <div className="product-images">
            <div className="main-image-wrapper">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                priority
                className="main-image"
              />
              {discount && <span className="discount-badge">{discount}% OFF</span>}
            </div>

            {product.images.length > 1 && (
              <div className="thumbnail-gallery">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image src={image} alt={`${product.name} view ${index + 1}`} fill />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
              {product.rating && (
                <div className="product-rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating-info">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="product-price-section">
              <div className="price-display">
                <span className="current-price">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              {product.stock === 0 && <span className="out-of-stock">Out of Stock</span>}
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Options */}
            <div className="product-options">
              {product.sizes && product.sizes.length > 0 && (
                <div className="option-group">
                  <label>Size</label>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="option-group">
                  <label>Color</label>
                  <div className="color-options">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                      >
                        <span className="color-swatch" style={{ 
                          backgroundColor: color.toLowerCase().includes('red') ? '#8B1538' :
                                          color.toLowerCase().includes('black') ? '#000000' :
                                          color.toLowerCase().includes('grey') ? '#666666' : '#333333'
                        }}></span>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="option-group">
                <label htmlFor="quantity">Quantity</label>
                <div className="quantity-selector">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity === 1}
                  >
                    −
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="product-actions">
              <button
                className={`btn btn-primary btn-full ${addedToCart ? 'success' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedToCart}
              >
                {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
              </button>

              <button className="btn btn-secondary btn-full">
                ♡ Add to Wishlist
              </button>
            </div>

            {/* Additional Info */}
            <div className="product-meta">
              <div className="meta-item">
                <span className="label">SKU:</span>
                <span className="value">{product.id}</span>
              </div>
              <div className="meta-item">
                <span className="label">Stock:</span>
                <span className="value">{product.stock} available</span>
              </div>
              <div className="meta-item">
                <span className="label">Tags:</span>
                <span className="value">{product.tags.join(', ')}</span>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="shipping-info">
              <p>✓ Free shipping on orders over $75</p>
              <p>✓ 30-day returns</p>
              <p>✓ Discreet, secure packaging</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="container">
            <h2>Related Products</h2>
            <div className="products-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
