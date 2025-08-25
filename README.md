# Open SSO - Next.js Frontend

A modern admin dashboard for managing your Open SSO system built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication

- Secure login/register system
- JWT token management
- Protected routes and components
- User session management

### 🏢 Application Management

- Create and manage SSO applications
- Configure redirect URIs and scopes
- Monitor application status
- Bulk operations support

### 🔑 OAuth 2.0 Management

- OAuth client registration
- Token lifecycle management
- Authorization flow monitoring
- Refresh token handling

### 🎣 Webhook System

- Configure webhook endpoints
- Monitor delivery status
- Retry failed deliveries
- Real-time webhook logs

### 📊 Dashboard & Analytics

- System overview with key metrics
- Real-time activity monitoring
- Performance insights
- User analytics

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI + Custom components
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Open SSO Backend running on port 3000

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nextjs-open-sso
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update the variables in `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   NODE_ENV=development
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open the application**
   ```
   http://localhost:3001
   ```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   ├── register/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   └── ...              # Feature-specific components
├── lib/                 # Utility functions and configurations
│   ├── api.ts           # API client setup
│   ├── auth-context.tsx # Authentication context
│   ├── constants.ts     # App constants
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
    └── index.ts         # Type exports
```

## Key Components

### Authentication Context

Manages user authentication state across the application:

- Login/logout functionality
- Token storage and retrieval
- Protected route handling
- User session persistence

### API Client

Centralized HTTP client with:

- Automatic token injection
- Request/response interceptors
- Error handling
- Retry logic

### UI Components

Built on Radix UI primitives:

- Consistent design system
- Accessible components
- Dark mode support
- Responsive design

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## API Integration

The frontend communicates with the Open SSO backend through RESTful APIs:

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### SSO Management Endpoints

- `GET /sso/applications` - List applications
- `POST /sso/applications` - Create application
- `PUT /sso/applications/:id` - Update application
- `DELETE /sso/applications/:id` - Delete application

### OAuth Endpoints

- `GET /oauth/clients` - List OAuth clients
- `POST /oauth/clients` - Create OAuth client
- `GET /oauth/tokens` - List tokens
- `DELETE /oauth/tokens/:id` - Revoke token

### Webhook Endpoints

- `GET /sso/webhooks` - List webhooks
- `POST /sso/webhooks` - Create webhook
- `GET /sso/webhook-logs` - Get webhook logs

## Environment Variables

| Variable              | Description      | Default                 |
| --------------------- | ---------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL  | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | `http://localhost:3001` |
| `NODE_ENV`            | Environment mode | `development`           |

## Development Guidelines

### Code Organization

- Use TypeScript for all new code
- Follow the established folder structure
- Create reusable components in `/components`
- Keep business logic in custom hooks

### Styling

- Use Tailwind CSS classes
- Follow the design system tokens
- Create utility classes for repeated patterns
- Maintain responsive design principles

### State Management

- Use React Query for server state
- Use React Context for app-wide state
- Keep component state local when possible
- Use custom hooks for complex state logic

### Error Handling

- Implement proper error boundaries
- Show user-friendly error messages
- Log errors appropriately
- Handle network failures gracefully

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Docker Deployment

```bash
docker build -t open-sso-frontend .
docker run -p 3001:3001 open-sso-frontend
```

### Environment Setup

Ensure all environment variables are configured for production:

- Update API URLs
- Set proper CORS origins
- Configure authentication secrets

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
