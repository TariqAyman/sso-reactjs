# Open SSO - Next.js Frontend Implementation Plan

## Project Setup

### Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",

    // UI Libraries
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.0.0",
    "tailwindcss": "^3.3.0",
    "@tailwindcss/forms": "^0.5.0",
    "@tailwindcss/typography": "^0.5.0",

    // Form Handling
    "react-hook-form": "^7.45.0",
    "@hookform/resolvers": "^3.1.0",
    "zod": "^3.21.0",

    // State Management
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^4.29.0",

    // HTTP Client
    "axios": "^1.4.0",

    // Authentication
    "next-auth": "^4.22.0",
    "jose": "^4.14.0",

    // Utilities
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "qrcode": "^1.5.0",
    "@types/qrcode": "^1.5.0",
    "react-hot-toast": "^2.4.1",
    "react-qr-code": "^2.0.11",

    // Charts/Analytics
    "recharts": "^2.7.0",

    // Rich Text
    "@tiptap/react": "^2.0.0",
    "@tiptap/starter-kit": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.4.0",
    "eslint": "^8.44.0",
    "eslint-config-next": "^14.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",

    // Testing
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.0",
    "@testing-library/user-event": "^14.4.0",
    "jest": "^29.6.0",
    "jest-environment-jsdom": "^29.6.0",

    // E2E Testing
    "@playwright/test": "^1.36.0"
  }
}
```

## Project Structure

```
nextjs-open-sso/
├── src/
│   ├── app/                      # App Router (Next.js 13+)
│   │   ├── (auth)/              # Auth layout group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/         # Dashboard layout group
│   │   │   ├── admin/
│   │   │   ├── profile/
│   │   │   ├── sso-apps/
│   │   │   └── layout.tsx
│   │   ├── sso/                 # SSO login pages
│   │   │   └── [key]/
│   │   ├── oauth/               # OAuth callbacks
│   │   │   ├── google/
│   │   │   ├── github/
│   │   │   └── [...provider]/
│   │   ├── api/                 # API routes (if needed)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   ├── form.tsx
│   │   │   ├── card.tsx
│   │   │   └── index.ts
│   │   ├── forms/               # Form components
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── profile-form.tsx
│   │   │   └── sso-app-form.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navigation.tsx
│   │   ├── auth/                # Auth-specific components
│   │   │   ├── oauth-buttons.tsx
│   │   │   ├── two-fa-setup.tsx
│   │   │   ├── qr-code.tsx
│   │   │   └── protected-route.tsx
│   │   ├── admin/               # Admin components
│   │   │   ├── user-table.tsx
│   │   │   ├── sso-app-table.tsx
│   │   │   ├── analytics-chart.tsx
│   │   │   └── webhook-logs.tsx
│   │   └── sso/                 # SSO components
│   │       ├── sso-login.tsx
│   │       ├── app-selector.tsx
│   │       └── consent-form.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-api.ts
│   │   ├── use-sso.ts
│   │   ├── use-local-storage.ts
│   │   └── use-2fa.ts
│   ├── lib/                     # Utilities and configurations
│   │   ├── api.ts              # API client configuration
│   │   ├── auth.ts             # Auth utilities
│   │   ├── utils.ts            # General utilities
│   │   ├── validations.ts      # Form validation schemas
│   │   ├── constants.ts        # App constants
│   │   └── types.ts            # TypeScript types
│   ├── stores/                  # State management
│   │   ├── auth-store.ts
│   │   ├── user-store.ts
│   │   ├── sso-store.ts
│   │   └── admin-store.ts
│   ├── styles/                  # Styling
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── themes.css
│   └── types/                   # TypeScript definitions
│       ├── auth.ts
│       ├── user.ts
│       ├── sso.ts
│       └── api.ts
├── public/
│   ├── icons/
│   ├── images/
│   └── favicon.ico
├── __tests__/
├── playwright/
├── docs/
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── jest.config.js
└── playwright.config.ts
```

## Core Components Implementation

### 1. Authentication Components

#### Login Form Component

```typescript
// src/components/forms/login-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { TwoFactorModal } from "@/components/auth/two-factor-modal";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [loginToken, setLoginToken] = useState<string>("");
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data.username, data.password);

      if (result.requires2FA) {
        setIs2FARequired(true);
        setLoginToken(result.tempToken);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handle2FASuccess = () => {
    setIs2FARequired(false);
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username or Email
          </label>
          <Input
            id="username"
            type="text"
            {...register("username")}
            className="mt-1"
            error={errors.username?.message}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className="mt-1"
            error={errors.password?.message}
          />
        </div>

        <Button type="submit" className="w-full" loading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <OAuthButtons className="mt-6" />
      </div>

      <TwoFactorModal
        isOpen={is2FARequired}
        onClose={() => setIs2FARequired(false)}
        onSuccess={handle2FASuccess}
        tempToken={loginToken}
      />
    </div>
  );
}
```

#### OAuth Buttons Component

```typescript
// src/components/auth/oauth-buttons.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOAuth } from "@/hooks/use-oauth";

interface OAuthButtonsProps {
  className?: string;
  ssoKey?: string;
}

export function OAuthButtons({ className, ssoKey }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const { initiateOAuth, providers } = useOAuth();

  const handleOAuthLogin = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await initiateOAuth(provider, ssoKey);
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {providers.google.enabled && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin("google")}
          loading={loadingProvider === "google"}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            {/* Google Icon SVG */}
          </svg>
          Continue with Google
        </Button>
      )}

      {providers.github.enabled && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin("github")}
          loading={loadingProvider === "github"}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            {/* GitHub Icon SVG */}
          </svg>
          Continue with GitHub
        </Button>
      )}

      {providers.facebook.enabled && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin("facebook")}
          loading={loadingProvider === "facebook"}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            {/* Facebook Icon SVG */}
          </svg>
          Continue with Facebook
        </Button>
      )}

      {providers.microsoft.enabled && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin("microsoft")}
          loading={loadingProvider === "microsoft"}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            {/* Microsoft Icon SVG */}
          </svg>
          Continue with Microsoft
        </Button>
      )}
    </div>
  );
}
```

#### Two-Factor Authentication Modal

```typescript
// src/components/auth/two-factor-modal.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAuthStore } from "@/stores/auth-store";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tempToken: string;
}

export function TwoFactorModal({
  isOpen,
  onClose,
  onSuccess,
  tempToken,
}: TwoFactorModalProps) {
  const [codes, setCodes] = useState<string[]>(Array(6).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verify2FA } = useAuthStore();

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    }
  };

  const handleSubmit = async () => {
    const code = codes.join("");
    if (code.length !== 6) return;

    setIsLoading(true);
    try {
      await verify2FA(tempToken, code);
      onSuccess();
    } catch (error) {
      console.error("2FA verification error:", error);
      setCodes(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Two-Factor Authentication">
      <div className="space-y-6">
        <p className="text-gray-600">
          Enter the 6-digit code from your authenticator app or check your email
          for the code.
        </p>

        <div className="flex justify-center space-x-2">
          {codes.map((code, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={code}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ))}
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={codes.join("").length !== 6}
          >
            Verify
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

### 2. SSO Components

#### SSO Login Page

```typescript
// src/components/sso/sso-login.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { useSSOStore } from "@/stores/sso-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SSOLoginPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [appInfo, setAppInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { validateSSOApp, authorizeSSOAccess } = useSSOStore();

  const ssoKey = params.key as string;
  const redirectUri = searchParams.get("redirect_uri");

  useEffect(() => {
    const loadAppInfo = async () => {
      try {
        const app = await validateSSOApp(ssoKey);
        setAppInfo(app);
      } catch (error) {
        console.error("Invalid SSO application:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ssoKey) {
      loadAppInfo();
    }
  }, [ssoKey, validateSSOApp]);

  const handleAuthorize = async () => {
    if (!appInfo) return;

    try {
      const result = await authorizeSSOAccess(ssoKey, redirectUri);

      // Redirect to the callback URL with the SSO token
      const callbackUrl = new URL(appInfo.callbackUrl);
      callbackUrl.searchParams.set("token", result.token);
      if (redirectUri) {
        callbackUrl.searchParams.set("redirect_uri", redirectUri);
      }

      window.location.href = callbackUrl.toString();
    } catch (error) {
      console.error("SSO authorization error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!appInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Invalid Application
            </h1>
            <p className="text-gray-600 mb-6">
              The SSO application you're trying to access is invalid or has been
              disabled.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Sign in to {appInfo.name}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            You are being redirected from {appInfo.name}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Authorization Request
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    <strong>{appInfo.name}</strong> is requesting access to your
                    account. You will be redirected after signing in.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <LoginForm />

          <div className="mt-6">
            <Button
              onClick={handleAuthorize}
              className="w-full"
              variant="outline"
            >
              Continue to {appInfo.name}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
```

### 3. Admin Dashboard Components

#### SSO Applications Table

```typescript
// src/components/admin/sso-app-table.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { SSOAppForm } from "@/components/forms/sso-app-form";
import { useSSOStore } from "@/stores/sso-store";
import { formatDate } from "@/lib/utils";

export function SSOAppTable() {
  const [apps, setApps] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<any>(null);
  const { getSSOApps, deleteSSOApp, toggleAppStatus } = useSSOStore();

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const data = await getSSOApps();
      setApps(data);
    } catch (error) {
      console.error("Error loading SSO apps:", error);
    }
  };

  const handleEdit = (app: any) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleDelete = async (appId: string) => {
    if (confirm("Are you sure you want to delete this SSO application?")) {
      try {
        await deleteSSOApp(appId);
        await loadApps();
      } catch (error) {
        console.error("Error deleting SSO app:", error);
      }
    }
  };

  const handleToggleStatus = async (appId: string, currentStatus: string) => {
    try {
      await toggleAppStatus(
        appId,
        currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      );
      await loadApps();
    } catch (error) {
      console.error("Error toggling app status:", error);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "key", label: "API Key" },
    { key: "callbackUrl", label: "Callback URL" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
    { key: "actions", label: "Actions" },
  ];

  const rows = apps.map((app) => ({
    id: app.id,
    name: app.name,
    key: (
      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
        {app.key.substring(0, 16)}...
      </code>
    ),
    callbackUrl: (
      <span className="text-sm text-gray-600 truncate max-w-xs">
        {app.callbackUrl}
      </span>
    ),
    status: (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          app.status === "ACTIVE"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {app.status}
      </span>
    ),
    createdAt: formatDate(app.createdAt),
    actions: (
      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={() => handleEdit(app)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant={app.status === "ACTIVE" ? "outline" : "default"}
          onClick={() => handleToggleStatus(app.id, app.status)}
        >
          {app.status === "ACTIVE" ? "Disable" : "Enable"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(app.id)}
        >
          Delete
        </Button>
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">SSO Applications</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          Add New Application
        </Button>
      </div>

      <Table columns={columns} rows={rows} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingApp(null);
        }}
        title={editingApp ? "Edit SSO Application" : "Create SSO Application"}
      >
        <SSOAppForm
          app={editingApp}
          onSuccess={() => {
            setIsModalOpen(false);
            setEditingApp(null);
            loadApps();
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingApp(null);
          }}
        />
      </Modal>
    </div>
  );
}
```

## State Management (Zustand)

### Auth Store

```typescript
// src/stores/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  fullname?: string;
  role: "ADMIN" | "MEMBER";
  gravatar?: string;
  email2fa: boolean;
  ga2fa: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  verify2FA: (tempToken: string, code: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  enable2FA: (type: "2fa-email" | "2fa-totp") => Promise<any>;
  disable2FA: (type: "2fa-email" | "2fa-totp") => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post("/auth/login", {
            username,
            password,
          });

          if (response.data.requires2FA) {
            return {
              requires2FA: true,
              tempToken: response.data.tempToken,
            };
          }

          const { access_token, user } = response.data;

          set({
            token: access_token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set API authorization header
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Remove API authorization header
        delete api.defaults.headers.common["Authorization"];

        // Clear local storage
        localStorage.removeItem("auth-storage");
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          await api.post("/auth/register", data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verify2FA: async (tempToken: string, code: string) => {
        try {
          const response = await api.post("/auth/2fa/verify", {
            tempToken,
            code,
          });

          const { access_token, user } = response.data;

          set({
            token: access_token,
            user,
            isAuthenticated: true,
          });

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;
        } catch (error) {
          throw error;
        }
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await api.post("/auth/refresh", { token });
          const { access_token } = response.data;

          set({ token: access_token });
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;
        } catch (error) {
          // If refresh fails, logout
          get().logout();
        }
      },

      updateProfile: async (data) => {
        try {
          const response = await api.patch("/users/profile", data);
          set({ user: response.data });
        } catch (error) {
          throw error;
        }
      },

      enable2FA: async (type) => {
        try {
          const response = await api.post("/auth/2fa/enable", { type });

          // Update user state
          const { user } = get();
          if (user) {
            set({
              user: {
                ...user,
                [type === "2fa-email" ? "email2fa" : "ga2fa"]: true,
              },
            });
          }

          return response.data;
        } catch (error) {
          throw error;
        }
      },

      disable2FA: async (type) => {
        try {
          await api.post("/auth/2fa/disable", { type });

          // Update user state
          const { user } = get();
          if (user) {
            set({
              user: {
                ...user,
                [type === "2fa-email" ? "email2fa" : "ga2fa"]: false,
              },
            });
          }
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

## Custom Hooks

### useAuth Hook

```typescript
// src/hooks/use-auth.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { user, isAuthenticated, token, refreshToken } = useAuthStore();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push("/login");
      return;
    }

    // Set up token refresh interval
    if (token) {
      const interval = setInterval(() => {
        refreshToken();
      }, 7 * 60 * 1000); // Refresh every 7 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token, requireAuth, router, refreshToken]);

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === "ADMIN",
  };
}
```

### useOAuth Hook

```typescript
// src/hooks/use-oauth.ts
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface OAuthProvider {
  enabled: boolean;
  clientId?: string;
}

interface OAuthProviders {
  google: OAuthProvider;
  github: OAuthProvider;
  facebook: OAuthProvider;
  microsoft: OAuthProvider;
  apple: OAuthProvider;
}

export function useOAuth() {
  const [providers, setProviders] = useState<OAuthProviders>({
    google: { enabled: false },
    github: { enabled: false },
    facebook: { enabled: false },
    microsoft: { enabled: false },
    apple: { enabled: false },
  });

  useEffect(() => {
    loadOAuthConfig();
  }, []);

  const loadOAuthConfig = async () => {
    try {
      const response = await api.get("/oauth/config");
      setProviders(response.data);
    } catch (error) {
      console.error("Error loading OAuth config:", error);
    }
  };

  const initiateOAuth = async (provider: string, ssoKey?: string) => {
    try {
      const params = new URLSearchParams({
        provider,
        ...(ssoKey && { sso_key: ssoKey }),
      });

      window.location.href = `/api/oauth/${provider}?${params.toString()}`;
    } catch (error) {
      console.error(`Error initiating ${provider} OAuth:`, error);
      throw error;
    }
  };

  return {
    providers,
    initiateOAuth,
  };
}
```

## API Configuration

### API Client

```typescript
// src/lib/api.ts
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
    }

    // Show error toast
    const message = error.response?.data?.message || "An error occurred";
    toast.error(message);

    return Promise.reject(error);
  }
);

export default api;
```

This comprehensive Next.js frontend implementation provides:

1. **Modern React Architecture** with App Router, TypeScript, and Tailwind CSS
2. **State Management** with Zustand for scalable state handling
3. **Form Handling** with react-hook-form and Zod validation
4. **Authentication Flow** including OAuth and 2FA support
5. **Admin Dashboard** with comprehensive management interfaces
6. **SSO Integration** with seamless login flows
7. **Responsive Design** optimized for all devices
8. **Error Handling** with proper user feedback
9. **Performance Optimization** with code splitting and caching
10. **Type Safety** throughout the application

The frontend maintains feature parity with the original implementation while providing a modern, maintainable, and scalable foundation for future enhancements.
