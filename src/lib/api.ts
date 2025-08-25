import axios from "axios";
import { BASE_URL } from "./constants";

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
      const token = localStorage.getItem("sso_token");
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
      // Clear auth data on 401
      if (typeof window !== "undefined") {
        localStorage.removeItem("sso_token");
        localStorage.removeItem("sso_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Export API functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (userData: any) => api.post("/auth/register", userData),

  logout: () => api.post("/auth/logout"),

  getCurrentUser: () => api.get("/auth/me"),
};

export const ssoAPI = {
  getApplications: () => api.get("/sso/applications"),

  createApplication: (data: any) => api.post("/sso/applications", data),

  updateApplication: (id: string, data: any) =>
    api.put(`/sso/applications/${id}`, data),

  deleteApplication: (id: string) => api.delete(`/sso/applications/${id}`),

  getWebhooks: () => api.get("/sso/webhooks"),

  createWebhook: (data: any) => api.post("/sso/webhooks", data),

  getWebhookLogs: (webhookId?: string) =>
    api.get(`/sso/webhook-logs${webhookId ? `?webhookId=${webhookId}` : ""}`),
};

export const oauthAPI = {
  getClients: () => api.get("/oauth/clients"),

  createClient: (data: any) => api.post("/oauth/clients", data),

  updateClient: (id: string, data: any) =>
    api.put(`/oauth/clients/${id}`, data),

  deleteClient: (id: string) => api.delete(`/oauth/clients/${id}`),

  getTokens: () => api.get("/oauth/tokens"),

  revokeToken: (tokenId: string) => api.delete(`/oauth/tokens/${tokenId}`),
};
