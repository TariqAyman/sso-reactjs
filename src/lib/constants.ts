export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    ACTIVATE: "/auth/activate",
    RESEND_ACTIVATION: "/auth/resend-activation",
    // Social providers
    GOOGLE: "/auth/google",
    GITHUB: "/auth/github",
    FACEBOOK: "/auth/facebook",
    TWITTER: "/auth/twitter",
    MICROSOFT: "/auth/microsoft",
    // Nafath
    NAFATH_INITIATE: "/auth/nafath/initiate",
    NAFATH_STATUS: "/auth/nafath/status",
    NAFATH_CALLBACK: "/auth/nafath/callback",
    NAFATH_VERIFY: "/auth/nafath/verify",
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    PROFILE_PASSWORD: "/users/profile/password",
    PROFILE_VERIFY: "/users/profile/verify",
    TWO_FACTOR_ENABLE: "/users/profile/two-factor/enable",
    TWO_FACTOR_DISABLE: "/users/profile/two-factor/disable",
  },
  SSO: {
    APPLICATIONS: "/sso/applications",
  },
  OAUTH: {
    AUTHORIZE: "/oauth/authorize",
    CONSENT: "/oauth/consent",
    TOKEN: "/oauth/token",
    TOKEN_REFRESH: "/oauth/token/refresh",
    USERINFO: "/oauth/userinfo",
    REVOKE: "/oauth/revoke",
    OPENID_CONFIG: "/oauth/.well-known/openid_configuration",
    JWKS: "/oauth/.well-known/jwks.json",
  },
  WEBHOOKS: {
    LOGS: "/webhooks/logs",
    RETRY: "/webhooks/retry",
    STATS: "/webhooks/stats",
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
