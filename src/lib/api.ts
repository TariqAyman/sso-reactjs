import axios from "axios";
import { BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from "./constants";
import {
  LoginRequest,
  RegisterRequest,
  CreateSsoApplicationRequest,
  UpdateSsoApplicationRequest,
  NafathInitiateRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  TwoFactorRequest,
} from "../types";

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token first
      const refreshToken = localStorage.getItem("sso_refresh_token");
      if (refreshToken && !error.config.url?.includes("/auth/refresh")) {
        try {
          const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
            refresh_token: refreshToken,
          });
          const { access_token } = response.data;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);

          // Retry the original request
          error.config.headers.Authorization = `Bearer ${access_token}`;
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh failed, clear auth data
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem("sso_refresh_token");
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = "/login";
        }
      } else {
        // Clear auth data on 401
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem("sso_refresh_token");
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// Export API functions
export const authAPI = {
  // Basic authentication
  login: (data: LoginRequest) => api.post(API_ENDPOINTS.AUTH.LOGIN, data),

  register: (data: RegisterRequest) =>
    api.post(API_ENDPOINTS.AUTH.REGISTER, data),

  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),

  refresh: (refreshToken: string) =>
    api.post(API_ENDPOINTS.AUTH.REFRESH, { refresh_token: refreshToken }),

  getProfile: () => api.get(API_ENDPOINTS.AUTH.PROFILE),

  // Password management
  forgotPassword: (email: string) =>
    api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  resetPassword: (token: string, password: string) =>
    api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }),

  // Account activation
  activate: (token: string) =>
    api.get(`${API_ENDPOINTS.AUTH.ACTIVATE}?token=${token}`),

  resendActivation: (email: string) =>
    api.post(API_ENDPOINTS.AUTH.RESEND_ACTIVATION, { email }),

  // Social authentication
  getSocialProviders: () => {
    const providers = [
      {
        name: "google",
        displayName: "Google",
        authUrl: `${BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE}`,
      },
      {
        name: "github",
        displayName: "GitHub",
        authUrl: `${BASE_URL}${API_ENDPOINTS.AUTH.GITHUB}`,
      },
      {
        name: "facebook",
        displayName: "Facebook",
        authUrl: `${BASE_URL}${API_ENDPOINTS.AUTH.FACEBOOK}`,
      },
      {
        name: "twitter",
        displayName: "Twitter",
        authUrl: `${BASE_URL}${API_ENDPOINTS.AUTH.TWITTER}`,
      },
      {
        name: "microsoft",
        displayName: "Microsoft",
        authUrl: `${BASE_URL}${API_ENDPOINTS.AUTH.MICROSOFT}`,
      },
    ];
    return Promise.resolve({ data: providers });
  },

  // Nafath authentication
  nafathInitiate: (data: NafathInitiateRequest) =>
    api.post(API_ENDPOINTS.AUTH.NAFATH_INITIATE, data),

  nafathStatus: (transactionId: string) =>
    api.get(`${API_ENDPOINTS.AUTH.NAFATH_STATUS}/${transactionId}`),

  nafathVerify: (data: { transactionId: string; authCode: string }) =>
    api.post(API_ENDPOINTS.AUTH.NAFATH_VERIFY, data),
};

export const usersAPI = {
  // Profile management
  getProfile: () => api.get(API_ENDPOINTS.USERS.PROFILE),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put(API_ENDPOINTS.USERS.PROFILE, data),

  changePassword: (data: ChangePasswordRequest) =>
    api.put(API_ENDPOINTS.USERS.PROFILE_PASSWORD, data),

  // Two-factor authentication
  enableTwoFactor: (code: string) =>
    api.post(API_ENDPOINTS.USERS.TWO_FACTOR_ENABLE, { code }),

  disableTwoFactor: (code: string) =>
    api.post(API_ENDPOINTS.USERS.TWO_FACTOR_DISABLE, { code }),

  // User management (admin)
  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get(API_ENDPOINTS.USERS.BASE, { params }),

  getUser: (id: string) => api.get(`${API_ENDPOINTS.USERS.BASE}/${id}`),

  createUser: (data: RegisterRequest) =>
    api.post(API_ENDPOINTS.USERS.BASE, data),

  updateUser: (id: string, data: UpdateProfileRequest) =>
    api.put(`${API_ENDPOINTS.USERS.BASE}/${id}`, data),

  updateUserStatus: (id: string, status: string) =>
    api.put(`${API_ENDPOINTS.USERS.BASE}/${id}/status`, { status }),

  deleteUser: (id: string) => api.delete(`${API_ENDPOINTS.USERS.BASE}/${id}`),
};

export const ssoAPI = {
  // SSO Applications
  getApplications: (params?: { page?: number; limit?: number }) =>
    api.get(API_ENDPOINTS.SSO.APPLICATIONS, { params }),

  getApplication: (id: string) =>
    api.get(`${API_ENDPOINTS.SSO.APPLICATIONS}/${id}`),

  createApplication: (data: CreateSsoApplicationRequest) =>
    api.post(API_ENDPOINTS.SSO.APPLICATIONS, data),

  updateApplication: (id: string, data: UpdateSsoApplicationRequest) =>
    api.put(`${API_ENDPOINTS.SSO.APPLICATIONS}/${id}`, data),

  deleteApplication: (id: string) =>
    api.delete(`${API_ENDPOINTS.SSO.APPLICATIONS}/${id}`),

  regenerateSecret: (id: string) =>
    api.post(`${API_ENDPOINTS.SSO.APPLICATIONS}/${id}/regenerate-secret`),
};

export const oauthAPI = {
  // OAuth authorization flow
  authorize: (params: {
    response_type: string;
    client_id: string;
    redirect_uri: string;
    scope?: string;
    state?: string;
  }) => {
    const searchParams = new URLSearchParams(params);
    return `${BASE_URL}${
      API_ENDPOINTS.OAUTH.AUTHORIZE
    }?${searchParams.toString()}`;
  },

  getConsent: (params: { client_id: string; scope?: string }) =>
    api.get(API_ENDPOINTS.OAUTH.CONSENT, { params }),

  token: (data: {
    grant_type: string;
    code?: string;
    redirect_uri?: string;
    client_id: string;
    client_secret?: string;
    refresh_token?: string;
  }) => api.post(API_ENDPOINTS.OAUTH.TOKEN, data),

  refreshToken: (data: {
    refresh_token: string;
    client_id: string;
    client_secret?: string;
  }) => api.post(API_ENDPOINTS.OAUTH.TOKEN_REFRESH, data),

  getUserInfo: () => api.get(API_ENDPOINTS.OAUTH.USERINFO),

  revokeToken: (data: { token: string; token_type_hint?: string }) =>
    api.post(API_ENDPOINTS.OAUTH.REVOKE, data),

  // OpenID Connect discovery
  getOpenIdConfiguration: () => api.get(API_ENDPOINTS.OAUTH.OPENID_CONFIG),

  getJwks: () => api.get(API_ENDPOINTS.OAUTH.JWKS),
};

export const webhooksAPI = {
  // Webhook logs
  getLogs: (params?: {
    page?: number;
    limit?: number;
    applicationId?: string;
  }) => api.get(API_ENDPOINTS.WEBHOOKS.LOGS, { params }),

  getLog: (id: string) => api.get(`${API_ENDPOINTS.WEBHOOKS.LOGS}/${id}`),

  retryWebhook: (id: string) =>
    api.post(`${API_ENDPOINTS.WEBHOOKS.RETRY}/${id}`),

  getStats: () => api.get(API_ENDPOINTS.WEBHOOKS.STATS),
};
