import {
  Product,
  Category,
  Collection,
  Article,
  FAQ,
  Order,
  User,
  ApiResponse,
  NewsletterSubscription,
} from '@/types';
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_COLLECTIONS,
  MOCK_ARTICLES,
  MOCK_FAQS,
} from './mock-data';

// API Base - Currently using mock data, can be replaced with real API calls
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Helper method for API requests (placeholder for real implementation)
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    // For now, this is a placeholder. When backend is ready:
    // const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    // return response.json();

    // Mock implementation for development
    return {
      success: true,
      data: undefined as T,
    };
  }

  // Product Methods
  async getProducts(filters?: {
    category?: string;
    collection?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Product[]>> {
    // Mock implementation
    let results = [...MOCK_PRODUCTS];

    if (filters?.category) {
      results = results.filter((p) => p.category === filters.category);
    }

    if (filters?.collection) {
      results = results.filter((p) => p.collection === filters.collection);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      );
    }

    const limit = filters?.limit || 20;
    const offset = filters?.offset || 0;
    results = results.slice(offset, offset + limit);

    return {
      success: true,
      data: results,
    };
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    return {
      success: !!product,
      data: product,
      error: product ? undefined : 'Product not found',
    };
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
    return {
      success: !!product,
      data: product,
      error: product ? undefined : 'Product not found',
    };
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return {
      success: true,
      data: MOCK_PRODUCTS.filter((p) => p.featured),
    };
  }

  // Category Methods
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return {
      success: true,
      data: MOCK_CATEGORIES,
    };
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
    return {
      success: !!category,
      data: category,
      error: category ? undefined : 'Category not found',
    };
  }

  // Collection Methods
  async getCollections(): Promise<ApiResponse<Collection[]>> {
    return {
      success: true,
      data: MOCK_COLLECTIONS,
    };
  }

  async getFeaturedCollections(): Promise<ApiResponse<Collection[]>> {
    return {
      success: true,
      data: MOCK_COLLECTIONS.filter((c) => c.featured),
    };
  }

  // Article Methods
  async getArticles(limit?: number): Promise<ApiResponse<Article[]>> {
    return {
      success: true,
      data: MOCK_ARTICLES.slice(0, limit || MOCK_ARTICLES.length),
    };
  }

  async getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
    const article = MOCK_ARTICLES.find((a) => a.slug === slug);
    return {
      success: !!article,
      data: article,
      error: article ? undefined : 'Article not found',
    };
  }

  // FAQ Methods
  async getFAQs(category?: string): Promise<ApiResponse<FAQ[]>> {
    let faqs = [...MOCK_FAQS];
    if (category) {
      faqs = faqs.filter((f) => f.category === category);
    }
    return {
      success: true,
      data: faqs,
    };
  }

  // Newsletter Methods
  async subscribeNewsletter(
    subscription: NewsletterSubscription
  ): Promise<ApiResponse<{ message: string }>> {
    // Validate email
    if (!subscription.email || !subscription.email.includes('@')) {
      return {
        success: false,
        error: 'Invalid email address',
      };
    }

    // Mock: would send to backend
    return {
      success: true,
      data: { message: 'Successfully subscribed to newsletter' },
    };
  }

  // Authentication Methods
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    // Mock implementation - would validate against backend
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      };
    }

    const mockUser: User = {
      id: 'user-1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date().toISOString(),
      preferences: {
        newsletter: false,
        marketing: false,
        notifications: true,
      },
    };

    return {
      success: true,
      data: mockUser,
    };
  }

  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<ApiResponse<User>> {
    if (!email || !password || !firstName || !lastName) {
      return {
        success: false,
        error: 'All fields are required',
      };
    }

    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
      preferences: {
        newsletter: false,
        marketing: false,
        notifications: true,
      },
    };

    return {
      success: true,
      data: mockUser,
    };
  }

  // Order Methods
  async createOrder(
    items: any[],
    shippingAddress: any,
    paymentInfo: any
  ): Promise<ApiResponse<Order>> {
    if (!items.length) {
      return {
        success: false,
        error: 'Order must contain at least one item',
      };
    }

    const mockOrder: Order = {
      id: `order-${Date.now()}`,
      userId: 'user-1',
      items,
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      tax: 0,
      shipping: 9.99,
      total: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress,
    };

    mockOrder.tax = mockOrder.subtotal * 0.08;
    mockOrder.total = mockOrder.subtotal + mockOrder.tax + mockOrder.shipping;

    return {
      success: true,
      data: mockOrder,
    };
  }

  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    // Mock implementation
    return {
      success: false,
      error: 'Order not found',
    };
  }

  async getOrders(userId: string): Promise<ApiResponse<Order[]>> {
    // Mock implementation
    return {
      success: true,
      data: [],
    };
  }
}

export const apiClient = new ApiClient();
