# KNNK E-commerce Platform - Project Structure

A luxury apparel e-commerce platform built with Next.js 16, React 19, TypeScript, and SCSS. Designed for a fetish and bondage apparel brand with a dark, mysterious aesthetic inspired by Victoria's Secret.

## 🎨 Design System

### Color Palette
- **Primary**: Deep Red (#8B1538)
- **Secondary**: Black (#000000)
- **Background**: Black (#000000)
- **Text Primary**: Dark Grey (#333333)
- **Text Secondary**: Light Grey (#666666)
- **Off-white**: #f5f5f5

### Design Features
- Victorian lace pattern background with subtle red gradient overlay
- Dark, mysterious aesthetic with high contrast
- Mobile-first responsive design
- Smooth animations and transitions
- Accessible focus states and form interactions

## 📁 Directory Structure

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Home page with carousel
│   ├── globals.css              # Global styles (imports SCSS)
│   ├── collections/
│   │   ├── page.tsx            # Collections listing
│   │   └── [slug]/
│   │       └── page.tsx        # Category-specific products
│   ├── products/
│   │   ├── page.tsx            # Product listing with filters
│   │   └── [slug]/
│   │       └── page.tsx        # Product detail page
│   ├── cart/
│   │   └── page.tsx            # Shopping cart
│   ├── checkout/
│   │   └── page.tsx            # Checkout flow
│   ├── faq/
│   │   └── page.tsx            # FAQ page
│   ├── articles/
│   │   └── page.tsx            # Articles/Stories listing
│   └── account/
│       └── page.tsx            # Login/Signup/Account
│
├── components/                   # React Components
│   ├── Header.tsx               # Main navigation header
│   ├── Footer.tsx               # Footer with newsletter signup
│   ├── Carousel.tsx             # Homepage carousel
│   └── ProductCard.tsx          # Product card component
│
├── styles/                       # SCSS Styles
│   ├── variables.scss           # Colors, spacing, fonts
│   ├── globals.scss             # Global styles & animations
│   ├── components.scss          # Utility classes & reusable components
│   ├── components/
│   │   ├── header.scss
│   │   ├── footer.scss
│   │   ├── carousel.scss
│   │   └── product-card.scss
│   └── pages/
│       ├── home.scss
│       ├── collections.scss
│       ├── products.scss
│       ├── product-detail.scss
│       ├── category.scss
│       ├── cart.scss
│       ├── checkout.scss
│       ├── faq.scss
│       ├── articles.scss
│       └── account.scss
│
├── lib/
│   ├── api/
│   │   ├── client.ts            # API client with mock data
│   │   └── mock-data.ts         # Mock products, categories, articles
│   └── analytics/
│       └── tracker.ts           # Analytics abstraction layer
│
├── hooks/
│   ├── useCart.ts               # Cart state management
│   └── useAuth.ts               # Authentication state management
│
├── types/
│   └── index.ts                 # TypeScript type definitions
│
└── public/                       # Static assets
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    └── vercel.svg
```

## 🎯 Key Features

### Pages
- **Home**: Featured carousel, new arrivals grid, content sections
- **Collections**: Category listing with descriptions and images
- **Products**: Product grid with sorting and filtering
- **Product Detail**: Full product info with images, variants, related products
- **Cart**: Shopping cart with quantity adjustment
- **Checkout**: Multi-step checkout (shipping, payment, confirmation)
- **FAQ**: Categorized FAQ with accordion UI
- **Articles**: Blog/stories listing with tags and categories
- **Account**: Login, signup, and user profile management

### Components
- **Header**: Sticky navigation with cart badge and menu toggle
- **Footer**: Newsletter signup, links, social media
- **Carousel**: Auto-playing hero carousel with manual controls
- **ProductCard**: Grid and list view variants with add-to-cart

### State Management
- **useCart**: Client-side cart state with localStorage persistence
- **useAuth**: User authentication state with token storage
- **Analytics**: Global analytics tracking abstraction

### API Layer
- **Mock Data**: Ready-to-use product, category, and article data
- **API Client**: Unified interface for all backend calls
- **Extensible**: Can be easily replaced with real API calls

## 🔧 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: SCSS with CSS variables
- **Styling Library**: Tailwind CSS 4 (installed but using SCSS instead)
- **Package Manager**: Yarn 1.22.22
- **Node**: ES2017 compatibility

## 🎨 Styling System

### SCSS Variables
Located in `styles/variables.scss`:
- Color variables with semantic naming
- Spacing scale (xs, sm, md, lg, xl, 2xl)
- Typography scales and weights
- Breakpoints with mobile-first approach
- Useful mixins for common patterns

### Responsive Breakpoints
- **xs**: 480px
- **sm**: 640px (mobile-first default)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px
- **2xl**: 1536px

Use mixins:
```scss
@include mobile-first { /* Applied at 640px+ */ }
@include tablet { /* Applied at 768px+ */ }
@include desktop { /* Applied at 1024px+ */ }
```

## 📊 Type Definitions

All types are defined in `types/index.ts`:
- **Product**: Product item with pricing, images, variants
- **Category**: Product category with subcategories
- **Collection**: Featured collection (carousel items)
- **CartItem**: Item in shopping cart
- **Cart**: Shopping cart with totals
- **Order**: Completed order with tracking
- **User**: User profile information
- **Article**: Blog article
- **FAQ**: Frequently asked question
- **Address**: Shipping address
- **NewsletterSubscription**: Newsletter signup

## 🔌 API Integration

### Current Implementation
- **Mock Data**: Using in-memory mock data for development
- **Client File**: `lib/api/client.ts` provides unified API interface
- **Mock Data**: `lib/api/mock-data.ts` contains sample products, categories, articles

### Switching to Real Backend
1. Update `lib/api/client.ts` to make real HTTP calls
2. Replace mock data imports with actual API endpoints
3. All components will automatically work with the real API

### Available API Methods
```typescript
// Products
apiClient.getProducts(filters)
apiClient.getProductById(id)
apiClient.getProductBySlug(slug)
apiClient.getFeaturedProducts()

// Categories
apiClient.getCategories()
apiClient.getCategoryBySlug(slug)

// Collections
apiClient.getCollections()
apiClient.getFeaturedCollections()

// Articles
apiClient.getArticles(limit)
apiClient.getArticleBySlug(slug)

// FAQ
apiClient.getFAQs(category)

// Newsletter
apiClient.subscribeNewsletter(subscription)

// Authentication
apiClient.login(email, password)
apiClient.signup(email, password, firstName, lastName)

// Orders
apiClient.createOrder(items, shippingAddress, paymentInfo)
apiClient.getOrder(orderId)
apiClient.getOrders(userId)
```

## 📈 Analytics Integration

### Current Implementation
- **Mock Analytics**: Logs to console in development
- **Abstraction Layer**: `lib/analytics/tracker.ts` provides unified interface
- **No Third-Party Required**: Works without any external analytics service

### Switching to Real Analytics (Google Analytics, Mixpanel, etc.)
1. Update `lib/analytics/tracker.ts` initialization
2. Implement provider-specific tracking calls
3. All tracking calls throughout the app will automatically use the new provider

### Available Tracking Events
```typescript
analytics.pageView(event)           // Track page views
analytics.productView(event)        // Track product views
analytics.addToCart(event)          // Track add to cart
analytics.removeFromCart(id, name)  // Track remove from cart
analytics.trackCheckout(event)      // Track checkout steps
analytics.purchase(event)           // Track purchases
analytics.signup(event)             // Track signups
analytics.newsletterSignup(event)   // Track newsletter signups
analytics.search(query)             // Track searches
analytics.setConsentPreferences()   // Set consent preferences
```

## 🛒 Cart Management

### Features
- Add items with size/color variants
- Update quantities
- Remove items
- Automatic total calculation with tax and shipping
- Persistent storage with localStorage
- Cart badge in header showing item count

### Usage
```typescript
const { cart, itemCount, addItem, removeItem, updateQuantity, clearCart } = useCart();

addItem({
  productId: 'prod-1',
  name: 'Product Name',
  price: 29.99,
  quantity: 1,
  size: 'M',
  color: 'Black',
  image: 'image-url'
});
```

## 🔐 Authentication

### Features
- Email/password login and signup
- User profile management
- Persistent authentication with tokens
- localStorage-based session management

### Usage
```typescript
const { user, isAuthenticated, login, signup, logout } = useAuth();

await login(email, password);
await signup(email, password, firstName, lastName);
logout();
```

## 🎯 Next Steps for Backend Integration

1. **Database Setup**: Choose database (PostgreSQL recommended)
2. **Backend API**: Create endpoints for products, categories, orders, users
3. **Authentication**: Implement JWT or session-based auth
4. **Payment Processing**: Integrate Stripe or similar
5. **Email Service**: Set up transactional emails (SendGrid, etc.)
6. **Hosting**: Deploy to Vercel or other Next.js hosting

## 📝 Mock Data

The platform comes with mock data for:
- 6 products with images and variants
- 3 categories with subcategories
- 3 featured collections
- 3 articles
- 6 FAQs

This allows full feature testing without a backend. Replace with real API calls when ready.

## 🚀 Deployment

The project is ready for deployment to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Self-hosted servers**

Environment variables needed:
- `NEXT_PUBLIC_API_URL`: Backend API base URL
- `NEXT_PUBLIC_ANALYTICS_PROVIDER`: Analytics provider (if using real analytics)

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Minimum screen width: 320px (mobile)

## 🎓 Code Style

- TypeScript strict mode enabled
- ESLint configured
- Prettier formatting
- BEM-like CSS class naming
- Semantic HTML5
- Accessible form controls and navigation

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)

## 🤝 Contributing Guidelines

1. Follow existing code style and patterns
2. Use TypeScript for all new code
3. Add proper type definitions
4. Follow the component structure conventions
5. Test mobile responsiveness
6. Update documentation when adding features
