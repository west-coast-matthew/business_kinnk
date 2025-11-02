// Analytics abstraction layer
// This provides a unified interface for analytics tracking
// Currently implemented as mock, but can be replaced with any provider
// (Google Analytics, Mixpanel, Segment, etc.)

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface PageViewEvent {
  path: string;
  title?: string;
  referrer?: string;
}

export interface ProductViewEvent {
  productId: string;
  productName: string;
  price?: number;
  category?: string;
}

export interface AddToCartEvent {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  cartValue?: number;
}

export interface CheckoutEvent {
  cartValue: number;
  itemCount: number;
  step: 'cart' | 'shipping' | 'payment' | 'confirmation';
}

export interface PurchaseEvent {
  orderId: string;
  value: number;
  currency?: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export interface SignupEvent {
  method: 'email' | 'social';
  source?: string;
}

export interface NewsletterSignupEvent {
  email: string;
  source: string;
}

class Analytics {
  private provider: string = 'mock';
  private userId?: string;
  private sessionId: string;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeProvider();
  }

  /**
   * Initialize the analytics provider
   * Can be extended to support different providers
   */
  private initializeProvider(): void {
    const analyticsProvider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'mock';
    this.provider = analyticsProvider;

    // TODO: Initialize real provider based on configuration
    // Example: if (analyticsProvider === 'google') { gtag initialization }
    if (typeof window !== 'undefined') {
      // Check for consent preferences
      this.isEnabled = this.checkConsentPreferences();
    }
  }

  /**
   * Check if analytics is enabled based on user consent
   */
  private checkConsentPreferences(): boolean {
    if (typeof window === 'undefined') return false;

    const consent = localStorage.getItem('analytics-consent');
    return consent !== 'rejected';
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set user information for tracking
   */
  setUser(user: User): void {
    if (!this.isEnabled) return;

    this.userId = user.id;

    if (this.provider === 'mock') {
      console.debug('[Analytics] User identified:', { ...user, sessionId: this.sessionId });
    }

    // TODO: Implement for real providers
    // if (this.provider === 'google') { gtag('set', { 'user_id': user.id }); }
  }

  /**
   * Clear user information
   */
  clearUser(): void {
    this.userId = undefined;

    if (this.provider === 'mock') {
      console.debug('[Analytics] User cleared');
    }
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled) return;

    const enrichedEvent = {
      ...event,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: event.timestamp || new Date(),
    };

    if (this.provider === 'mock') {
      console.debug('[Analytics] Event tracked:', enrichedEvent);
    }

    // TODO: Send to real provider
    // if (this.provider === 'google') { gtag('event', event.name, event.properties); }
  }

  /**
   * Track page view
   */
  pageView(event: PageViewEvent): void {
    if (!this.isEnabled) return;

    const pageViewEvent: AnalyticsEvent = {
      name: 'page_view',
      properties: {
        path: event.path,
        title: event.title,
        referrer: event.referrer,
        sessionId: this.sessionId,
      },
    };

    this.trackEvent(pageViewEvent);
  }

  /**
   * Track product view
   */
  productView(event: ProductViewEvent): void {
    if (!this.isEnabled) return;

    const productViewEvent: AnalyticsEvent = {
      name: 'view_item',
      properties: {
        itemId: event.productId,
        itemName: event.productName,
        price: event.price,
        itemCategory: event.category,
      },
    };

    this.trackEvent(productViewEvent);
  }

  /**
   * Track add to cart
   */
  addToCart(event: AddToCartEvent): void {
    if (!this.isEnabled) return;

    const addToCartEvent: AnalyticsEvent = {
      name: 'add_to_cart',
      properties: {
        itemId: event.productId,
        itemName: event.productName,
        quantity: event.quantity,
        price: event.price,
        value: event.cartValue,
      },
    };

    this.trackEvent(addToCartEvent);
  }

  /**
   * Track remove from cart
   */
  removeFromCart(productId: string, productName: string): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: 'remove_from_cart',
      properties: {
        itemId: productId,
        itemName: productName,
      },
    };

    this.trackEvent(event);
  }

  /**
   * Track checkout progress
   */
  trackCheckout(event: CheckoutEvent): void {
    if (!this.isEnabled) return;

    const checkoutEvent: AnalyticsEvent = {
      name: 'begin_checkout',
      properties: {
        value: event.cartValue,
        itemCount: event.itemCount,
        checkoutStep: event.step,
      },
    };

    this.trackEvent(checkoutEvent);
  }

  /**
   * Track purchase/order
   */
  purchase(event: PurchaseEvent): void {
    if (!this.isEnabled) return;

    const purchaseEvent: AnalyticsEvent = {
      name: 'purchase',
      properties: {
        transactionId: event.orderId,
        value: event.value,
        currency: event.currency || 'USD',
        items: event.items,
      },
    };

    this.trackEvent(purchaseEvent);
  }

  /**
   * Track user signup
   */
  signup(event: SignupEvent): void {
    if (!this.isEnabled) return;

    const signupEvent: AnalyticsEvent = {
      name: 'sign_up',
      properties: {
        signUpMethod: event.method,
        source: event.source,
      },
    };

    this.trackEvent(signupEvent);
  }

  /**
   * Track newsletter signup
   */
  newsletterSignup(event: NewsletterSignupEvent): void {
    if (!this.isEnabled) return;

    const newsletterEvent: AnalyticsEvent = {
      name: 'newsletter_signup',
      properties: {
        email: event.email,
        source: event.source,
      },
    };

    this.trackEvent(newsletterEvent);
  }

  /**
   * Track search
   */
  search(query: string): void {
    if (!this.isEnabled) return;

    const searchEvent: AnalyticsEvent = {
      name: 'search',
      properties: {
        searchTerm: query,
      },
    };

    this.trackEvent(searchEvent);
  }

  /**
   * Set consent preferences
   */
  setConsentPreferences(accepted: boolean): void {
    localStorage.setItem('analytics-consent', accepted ? 'accepted' : 'rejected');
    this.isEnabled = accepted;
  }

  /**
   * Get consent status
   */
  getConsentStatus(): boolean {
    return this.isEnabled;
  }

  /**
   * Enable analytics
   */
  enable(): void {
    this.isEnabled = true;
  }

  /**
   * Disable analytics
   */
  disable(): void {
    this.isEnabled = false;
  }
}

export const analytics = new Analytics();
