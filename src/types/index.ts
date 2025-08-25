/**
 * User types
 */
export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  emailVerified: boolean;
  role: string;
  status: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
}

/**
 * SSO Application types
 */
export interface SsoApplication {
  id: number;
  applicationName: string;
  applicationUrl: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  status: string;
  allowedOrigins?: string;
  tokenExpirationTime: number;
  refreshTokenEnabled: boolean;
  description?: string;
  logoUrl?: string;
  webhookUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSsoApplicationRequest {
  applicationName: string;
  applicationUrl: string;
  redirectUri: string;
  scope?: string;
  description?: string;
  logoUrl?: string;
  webhookUrl?: string;
  allowedOrigins?: string;
  tokenExpirationTime?: number;
  refreshTokenEnabled?: boolean;
}

export interface UpdateSsoApplicationRequest
  extends Partial<CreateSsoApplicationRequest> {
  status?: "active" | "inactive" | "suspended";
}

/**
 * Webhook types
 */
export interface WebhookLog {
  id: number;
  event: string;
  payload: string;
  response?: string;
  status: string;
  httpStatusCode?: number;
  attempt: number;
  errorMessage?: string;
  deliveredAt?: string;
  nextRetryAt?: string;
  createdAt: string;
  ssoApplication: {
    id: number;
    applicationName: string;
    clientId: string;
    webhookUrl?: string;
  };
}

export interface WebhookStats {
  statusCounts: Record<string, number>;
  recentActivity: WebhookLog[];
}

/**
 * OAuth types
 */
export interface OAuthAuthorizationRequest {
  response_type: string;
  client_id: string;
  redirect_uri: string;
  scope?: string;
  state?: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

/**
 * API Response types
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Dashboard Analytics types
 */
export interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  totalUsers: number;
  activeUsers: number;
  totalWebhooks: number;
  successfulWebhooks: number;
  failedWebhooks: number;
}

export interface ApplicationUsageStats {
  applicationId: number;
  applicationName: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  lastUsed?: string;
}

export interface WebhookAnalytics {
  deliveryRate: number;
  averageDeliveryTime: number;
  retryRate: number;
  eventDistribution: Record<string, number>;
}
