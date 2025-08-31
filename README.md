# Open SSO - Next.js Frontend

A modern, comprehensive admin dashboard for managing your Open SSO system built with Next.js 15, TypeScript, and Tailwind CSS. Fully integrated with the latest backend API architecture.

## ✨ Latest Updates (August 2025)

### 🚀 Backend Integration

- **Updated API Integration**: Full compatibility with latest NestJS backend (`/api/v1` endpoints)
- **UUID Support**: Complete integration with UUID-based entity IDs
- **Enhanced Authentication**: JWT with refresh token support
- **Real-time Updates**: Live webhook monitoring and task status tracking

### 🎨 Modern UI/UX

- **Next.js 15**: Latest App Router with enhanced performance
- **Tailwind CSS**: Modern, responsive design system
- **Dark Mode**: Complete dark/light theme support
- **Accessibility**: WCAG compliant components

### 🔐 Enhanced Security

- **Token Management**: Automatic refresh token handling
- **Protected Routes**: Route-level authentication guards
- **Secure Storage**: Encrypted token storage
- **Session Management**: Advanced user session handling

## 🚀 Core Features

### 🔐 Authentication & Authorization

- **Multi-Provider Login**: Email/password, Google, GitHub, Facebook, Twitter, Microsoft
- **Nafath Integration**: Saudi national identity provider support
- **JWT Token Management**: Secure token handling with automatic refresh
- **Protected Routes**: Role-based access control and route protection
- **Session Persistence**: Secure user session management across browser sessions

### 🏢 SSO Application Management

- **Application CRUD**: Create, read, update, delete SSO applications
- **OAuth Configuration**: Configure client IDs, secrets, redirect URIs, and scopes
- **Application Monitoring**: Real-time status monitoring and health checks
- **Bulk Operations**: Manage multiple applications efficiently
- **Application Analytics**: Usage statistics and performance metrics

### 🔑 OAuth 2.0 & Token Management

- **OAuth Client Management**: Register and manage OAuth clients
- **Token Lifecycle**: Monitor token creation, usage, and expiration
- **Authorization Flow Tracking**: Visual authorization flow monitoring
- **Refresh Token Handling**: Automatic token refresh and revocation
- **Scope Management**: Fine-grained permission scoping

### 🎣 Advanced Webhook System

- **Webhook Configuration**: Set up and manage webhook endpoints
- **Delivery Monitoring**: Real-time webhook delivery status tracking
- **Automatic Retries**: Failed webhook retry management (every 5 minutes)
- **Webhook Logs**: Comprehensive logging with detailed execution history
- **Performance Analytics**: Webhook success rates and response times

### 👥 User Management

- **User Administration**: Complete user lifecycle management
- **Profile Management**: User profile editing and preferences
- **Role Assignment**: Role-based access control management
- **Activity Tracking**: User login history and activity monitoring
- **Bulk User Operations**: Import, export, and bulk user management

### 📊 Dashboard & Analytics

- **System Overview**: Key metrics and system health indicators
- **Real-time Monitoring**: Live activity feeds and status updates
- **Performance Insights**: Application performance and usage analytics
- **User Analytics**: User engagement and authentication statistics
- **Background Task Monitoring**: Task execution status and scheduling

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router and React 18
- **Language**: TypeScript 5+ with strict type checking
- **Styling**: Tailwind CSS 3+ with custom design system
- **State Management**:
  - React Query (TanStack Query) for server state
  - React Context for global app state
  - Zustand for complex client state
- **UI Components**:
  - Radix UI primitives for accessibility
  - Custom component library
  - Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors and retry logic
- **Charts & Visualization**: Recharts for analytics
- **Authentication**: Custom JWT implementation with refresh tokens
- **Development**: ESLint, Prettier, TypeScript compiler

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Open SSO NestJS Backend running on port 3001
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nextjs-open-sso
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update the variables in `.env.local`:

   ```env
   # Backend API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

   # Frontend Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Environment
   NODE_ENV=development

   # Authentication Providers (optional)
   NEXT_PUBLIC_AUTH_PROVIDERS=google,github,facebook,twitter,microsoft,nafath

   # Nafath Configuration (if enabled)
   NEXT_PUBLIC_NAFATH_ENABLED=true
   NEXT_PUBLIC_NAFATH_SERVICE_ID=development_service_id
   NEXT_PUBLIC_NAFATH_ENVIRONMENT=development

   # Feature Flags
   NEXT_PUBLIC_ENABLE_WEBHOOKS=true
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open the application**

   Navigate to `http://localhost:3000` in your browser.

### Default Login Credentials

After the backend is seeded, you can use these credentials:

- **Admin**: `admin@opensso.com` / `Admin123!@#`
- **Demo User**: `demo@opensso.com` / `User123!@#`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/         # Main dashboard pages
│   │   ├── analytics/     # Analytics and reports
│   │   ├── applications/  # SSO application management
│   │   ├── users/         # User management
│   │   ├── webhooks/      # Webhook management
│   │   └── settings/      # System settings
│   ├── oauth/             # OAuth flow pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing/home page
│   ├── loading.tsx        # Global loading component
│   ├── error.tsx          # Global error boundary
│   └── globals.css        # Global styles and CSS variables
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (buttons, inputs, etc.)
│   ├── auth/             # Authentication-related components
│   ├── dashboard/        # Dashboard-specific components
│   ├── forms/            # Form components with validation
│   ├── layout/           # Layout components (nav, sidebar, etc.)
│   └── providers/        # Context providers and wrappers
├── lib/                  # Utility functions and configurations
│   ├── api/              # API client and endpoint definitions
│   ├── auth/             # Authentication utilities
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # State management stores
│   ├── utils/            # General utility functions
│   └── constants.ts      # Application constants
├── types/                # TypeScript type definitions
│   ├── api.ts            # API response types
│   ├── auth.ts           # Authentication types
│   └── index.ts          # General type exports
└── styles/               # Additional styling files
    └── components.css    # Component-specific styles
```

## 🔧 Key Components & Architecture

### Authentication System

**Context-based Authentication**:

- JWT token management with automatic refresh
- Secure token storage with encryption
- Protected route guards and middleware
- Multi-provider authentication support
- Session persistence across browser sessions

**Authentication Flow**:

- Login/logout with proper token cleanup
- Automatic token refresh on expiration
- Social provider integration (Google, GitHub, etc.)
- Nafath digital identity support

### API Client Architecture

**Advanced HTTP Client**:

- Axios-based client with request/response interceptors
- Automatic token injection and refresh
- Retry logic for failed requests
- Request caching and deduplication
- Error handling with user-friendly messages

**Type-Safe API Integration**:

- Full TypeScript integration with backend APIs
- Generated types for API responses
- Proper error handling and loading states
- Real-time data synchronization

### UI Component System

**Design System**:

- Radix UI primitives for accessibility
- Custom component library with consistent styling
- Dark/light theme support with system preference detection
- Responsive design with mobile-first approach
- WCAG 2.1 AA compliance

**Advanced Components**:

- Data tables with sorting, filtering, and pagination
- Form components with validation and error handling
- Charts and visualization components
- Real-time notification system
- Loading states and skeleton components

### State Management

**Multi-layer State Architecture**:

- **Server State**: React Query for API data caching and synchronization
- **Global State**: React Context for authentication and app-wide settings
- **Local State**: Component-level state for UI interactions
- **Form State**: React Hook Form for complex form handling

### Real-time Features

**Live Updates**:

- Webhook delivery status monitoring
- Background task progress tracking
- User activity feeds
- System health monitoring
- Real-time analytics updates

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run dev:turbo    # Start with Turbo for faster builds
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint for code linting
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report
npm run e2e          # Run end-to-end tests (if configured)

# Maintenance
npm run clean        # Clean build artifacts
npm run analyze      # Analyze bundle size
npm run update-deps  # Update dependencies
```

## 🔌 API Integration

The frontend integrates seamlessly with the NestJS backend through comprehensive RESTful APIs:

### Authentication Endpoints

```typescript
// Email/Password Authentication
POST /api/v1/auth/login          // User login
POST /api/v1/auth/register       // User registration
POST /api/v1/auth/logout         // User logout
POST /api/v1/auth/refresh        // Refresh access token
GET  /api/v1/auth/profile        // Get current user profile

// Social Authentication
GET  /api/v1/auth/:provider      // OAuth login (google, github, facebook, twitter, microsoft)
GET  /api/v1/auth/:provider/callback // OAuth callback handler

// Nafath Authentication
POST /api/v1/auth/nafath/initiate     // Start Nafath authentication
GET  /api/v1/auth/nafath/status/:id   // Check Nafath status
POST /api/v1/auth/nafath/verify       // Verify Nafath authentication
```

### SSO Application Management

```typescript
GET    /api/v1/sso/applications      // List SSO applications
POST   /api/v1/sso/applications      // Create new application
GET    /api/v1/sso/applications/:id  // Get application details
PUT    /api/v1/sso/applications/:id  // Update application
DELETE /api/v1/sso/applications/:id  // Delete application
```

### OAuth 2.0 & Token Management

```typescript
GET    /api/v1/oauth/authorize       // OAuth authorization endpoint
POST   /api/v1/oauth/token          // Token exchange endpoint
GET    /api/v1/oauth/userinfo       // User information endpoint
GET    /api/v1/oauth/.well-known/jwks.json // JWKS endpoint
DELETE /api/v1/oauth/tokens/:id     // Revoke access token
```

### User Management

```typescript
GET    /api/v1/users                // List users (admin)
GET    /api/v1/users/:id            // Get user details
PUT    /api/v1/users/:id            // Update user
DELETE /api/v1/users/:id            // Delete user
POST   /api/v1/users/:id/activate   // Activate user account
POST   /api/v1/users/:id/deactivate // Deactivate user account
```

### Webhook Management

```typescript
GET    /api/v1/webhooks/logs         // Get webhook execution logs
POST   /api/v1/webhooks/:id/retry    // Manually retry failed webhook
GET    /api/v1/webhooks/stats        // Webhook delivery statistics
GET    /api/v1/webhooks/health       // Webhook system health
```

### Analytics & Monitoring

```typescript
GET / api / v1 / analytics / dashboard; // Dashboard metrics
GET / api / v1 / analytics / users; // User analytics
GET / api / v1 / analytics / apps; // Application usage stats
GET / api / v1 / system / health; // System health status
GET / api / v1 / system / tasks; // Background task status
```

## ⚙️ Environment Variables

### Required Configuration

| Variable                  | Description              | Example                        | Required |
| ------------------------- | ------------------------ | ------------------------------ | -------- |
| `NEXT_PUBLIC_API_URL`     | Backend API base URL     | `http://localhost:3001/api/v1` | ✅       |
| `NEXT_PUBLIC_BACKEND_URL` | Backend server URL       | `http://localhost:3001`        | ✅       |
| `NEXT_PUBLIC_APP_URL`     | Frontend application URL | `http://localhost:3000`        | ✅       |
| `NODE_ENV`                | Environment mode         | `development\|production`      | ✅       |

### Authentication Providers

| Variable                        | Description            | Example                         | Required |
| ------------------------------- | ---------------------- | ------------------------------- | -------- |
| `NEXT_PUBLIC_AUTH_PROVIDERS`    | Enabled auth providers | `google,github,facebook,nafath` | ❌       |
| `NEXT_PUBLIC_GOOGLE_ENABLED`    | Enable Google OAuth    | `true\|false`                   | ❌       |
| `NEXT_PUBLIC_GITHUB_ENABLED`    | Enable GitHub OAuth    | `true\|false`                   | ❌       |
| `NEXT_PUBLIC_FACEBOOK_ENABLED`  | Enable Facebook OAuth  | `true\|false`                   | ❌       |
| `NEXT_PUBLIC_TWITTER_ENABLED`   | Enable Twitter OAuth   | `true\|false`                   | ❌       |
| `NEXT_PUBLIC_MICROSOFT_ENABLED` | Enable Microsoft OAuth | `true\|false`                   | ❌       |

### Nafath Configuration

| Variable                         | Description                  | Example                   | Required |
| -------------------------------- | ---------------------------- | ------------------------- | -------- |
| `NEXT_PUBLIC_NAFATH_ENABLED`     | Enable Nafath authentication | `true\|false`             | ❌       |
| `NEXT_PUBLIC_NAFATH_SERVICE_ID`  | Nafath service identifier    | `development_service_id`  | ❌       |
| `NEXT_PUBLIC_NAFATH_ENVIRONMENT` | Nafath environment           | `development\|production` | ❌       |

### Feature Flags

| Variable                             | Description                | Example       | Required |
| ------------------------------------ | -------------------------- | ------------- | -------- |
| `NEXT_PUBLIC_ENABLE_WEBHOOKS`        | Enable webhook management  | `true\|false` | ❌       |
| `NEXT_PUBLIC_ENABLE_ANALYTICS`       | Enable analytics dashboard | `true\|false` | ❌       |
| `NEXT_PUBLIC_ENABLE_USER_MANAGEMENT` | Enable user management     | `true\|false` | ❌       |
| `NEXT_PUBLIC_ENABLE_DARK_MODE`       | Enable dark mode toggle    | `true\|false` | ❌       |

### Development & Debugging

| Variable                  | Description              | Example                    | Required |
| ------------------------- | ------------------------ | -------------------------- | -------- |
| `NEXT_PUBLIC_DEBUG`       | Enable debug mode        | `true\|false`              | ❌       |
| `NEXT_PUBLIC_LOG_LEVEL`   | Client-side log level    | `debug\|info\|warn\|error` | ❌       |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | `30000`                    | ❌       |

## 🏗️ Development Guidelines

### Code Organization & Best Practices

**File Structure**:

- Use descriptive, kebab-case file names
- Group related components in feature folders
- Keep components small and focused (< 200 lines)
- Use barrel exports for clean imports
- Separate business logic into custom hooks

**TypeScript Standards**:

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use generic types for reusable components
- Implement proper error boundaries with typed errors
- Use discriminated unions for complex state management

**Component Patterns**:

```typescript
// Preferred component structure
interface ComponentProps {
  // Props definition
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  // Event handlers
  // Render logic
}
```

### Styling Guidelines

**Tailwind CSS Best Practices**:

- Use design system tokens (colors, spacing, typography)
- Create utility classes for repeated patterns
- Implement responsive design with mobile-first approach
- Use CSS variables for dynamic theming
- Maintain consistent spacing and typography scales

**Component Styling**:

- Use `cn()` utility for conditional classes
- Implement proper focus states for accessibility
- Support both light and dark themes
- Use semantic color tokens (primary, secondary, danger, etc.)

### State Management Patterns

**Server State (React Query)**:

- Use React Query for all server data
- Implement proper error and loading states
- Use optimistic updates for better UX
- Cache data appropriately with proper invalidation

**Client State**:

- Keep state as local as possible
- Use React Context for global app state
- Use Zustand for complex client-side state
- Implement proper state normalization

**Form Handling**:

- Use React Hook Form with Zod validation
- Implement proper error messaging
- Use field-level validation for better UX
- Handle async validation appropriately

### Performance Optimization

**Code Splitting**:

- Use dynamic imports for route-based splitting
- Implement component-level lazy loading
- Use React.memo for expensive components
- Optimize bundle size with tree shaking

**Image & Asset Optimization**:

- Use Next.js Image component for optimization
- Implement proper alt text for accessibility
- Use appropriate image formats (WebP, AVIF)
- Lazy load images below the fold

### Error Handling Strategy

**Error Boundaries**:

- Implement error boundaries at route level
- Show user-friendly error messages
- Log errors to monitoring service
- Provide recovery actions when possible

**API Error Handling**:

- Handle network failures gracefully
- Show appropriate loading states
- Implement retry mechanisms
- Display contextual error messages

### Testing Strategy

**Unit Testing**:

- Test component rendering and interactions
- Mock external dependencies
- Test custom hooks in isolation
- Achieve >80% code coverage

**Integration Testing**:

- Test complete user workflows
- Mock API responses
- Test error scenarios
- Validate accessibility requirements

## 🚀 Deployment & Production

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Docker Deployment

**Dockerfile Example**:

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM base AS production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

**Build and Run**:

```bash
docker build -t open-sso-frontend .
docker run -p 3000:3000 --env-file .env.production open-sso-frontend
```

### Environment Configuration

**Production Environment Setup**:

- Configure production API URLs
- Set secure authentication secrets
- Enable proper CORS origins
- Configure logging levels
- Set up monitoring and analytics

**Performance Optimization**:

- Enable compression and caching
- Configure CDN for static assets
- Implement proper security headers
- Set up monitoring and alerting

### CI/CD Pipeline

**GitHub Actions Example**:

```yaml
name: Deploy Frontend
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy
        run: # Your deployment script
```

## 🧪 Testing

### Testing Strategy

```bash
# Unit Tests
npm run test              # Run all tests
npm run test:watch        # Watch mode for development
npm run test:coverage     # Generate coverage report

# End-to-End Tests (if configured)
npm run e2e              # Run E2E tests
npm run e2e:headed       # Run E2E tests with browser
```

### Testing Best Practices

- **Component Testing**: Test user interactions and rendering
- **API Integration Testing**: Mock API responses and error cases
- **Accessibility Testing**: Validate WCAG compliance
- **Performance Testing**: Monitor bundle size and loading times

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions
