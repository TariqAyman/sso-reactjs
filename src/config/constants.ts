/**
 * SSO Admin Dashboard Configuration
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

export const ROUTES = {
  // Authentication
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",

  // SSO Applications
  APPLICATIONS: "/applications",
  APPLICATION_CREATE: "/applications/create",
  APPLICATION_DETAILS: (id: string) => `/applications/${id}`,
  APPLICATION_EDIT: (id: string) => `/applications/${id}/edit`,

  // OAuth
  OAUTH_CLIENTS: "/oauth/clients",
  OAUTH_LOGS: "/oauth/logs",

  // Webhooks
  WEBHOOKS: "/webhooks",
  WEBHOOK_LOGS: "/webhooks/logs",

  // Monitoring
  ANALYTICS: "/analytics",
  MONITORING: "/monitoring",

  // Settings
  SETTINGS: "/settings",
  PROFILE: "/profile",
} as const;

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    REFRESH: "/auth/refresh",
  },

  // SSO Applications
  SSO: {
    APPLICATIONS: "/sso/applications",
    APPLICATION: (id: number) => `/sso/applications/${id}`,
    REGENERATE_SECRET: (id: number) =>
      `/sso/applications/${id}/regenerate-secret`,
  },

  // OAuth
  OAUTH: {
    AUTHORIZE: "/oauth/authorize",
    TOKEN: "/oauth/token",
    USERINFO: "/oauth/userinfo",
    REVOKE: "/oauth/revoke",
  },

  // Webhooks
  WEBHOOKS: {
    LOGS: "/webhooks/logs",
    LOG: (id: number) => `/webhooks/logs/${id}`,
    RETRY: (id: number) => `/webhooks/retry/${id}`,
    STATS: "/webhooks/stats",
  },
} as const;

export const APP_CONFIG = {
  NAME: "Open SSO",
  DESCRIPTION: "Single Sign-On Administration Dashboard",
  VERSION: "1.0.0",
  GITHUB_URL: "https://github.com/yourusername/open-sso",
  DOCUMENTATION_URL: "https://docs.opensso.com",
} as const;
