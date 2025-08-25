export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  SSO: {
    APPLICATIONS: "/sso/applications",
    WEBHOOKS: "/sso/webhooks",
    WEBHOOK_LOGS: "/sso/webhook-logs",
  },
  OAUTH: {
    CLIENTS: "/oauth/clients",
    TOKENS: "/oauth/tokens",
    AUTHORIZE: "/oauth/authorize",
    TOKEN: "/oauth/token",
  },
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "sso_token",
  USER_DATA: "sso_user",
};

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
};
