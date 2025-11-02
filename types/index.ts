// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  collection: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  featured: boolean;
  rating?: number;
  reviews?: number;
  tags: string[];
}

// Category Types
export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  productType: string; // 't-shirt', 'hoodie', 'long-sleeve', etc.
}

// Collection Types (for homepage carousel and featured items)
export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  link: string;
  featured: boolean;
}

// Cart Types
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  shippingAddress: Address;
  estimatedDelivery?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  newsletter: boolean;
  marketing: boolean;
  notifications: boolean;
}

// Article Types
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  publishedAt: string;
  tags: string[];
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Newsletter Types
export interface NewsletterSubscription {
  email: string;
  preferences?: {
    categories: string[];
    frequency: 'weekly' | 'monthly';
  };
}
