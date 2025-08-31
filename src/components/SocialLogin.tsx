'use client';

import { useState, useEffect } from 'react';
import { Github, Chrome, Facebook, Twitter, Building } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { SocialProvider } from '@/types';

interface SocialLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const providerIcons: Record<string, React.ComponentType<any>> = {
  google: Chrome,
  github: Github,
  facebook: Facebook,
  twitter: Twitter,
  microsoft: Building,
};

const providerColors: Record<string, string> = {
  google: 'bg-red-500 hover:bg-red-600',
  github: 'bg-gray-800 hover:bg-gray-900',
  facebook: 'bg-blue-600 hover:bg-blue-700',
  twitter: 'bg-sky-500 hover:bg-sky-600',
  microsoft: 'bg-blue-500 hover:bg-blue-600',
};

export default function SocialLogin({ onSuccess, onError }: SocialLoginProps) {
  const [providers, setProviders] = useState<SocialProvider[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await authAPI.getSocialProviders();
        const providersWithEnabled = response.data.map((provider: any) => ({
          ...provider,
          enabled: true, // Assume all providers are enabled by default
        }));
        setProviders(providersWithEnabled);
      } catch (error) {
        console.error('Failed to load social providers:', error);
      }
    };

    loadProviders();
  }, []);

  const handleProviderLogin = (provider: SocialProvider) => {
    setLoading(provider.name);
    
    // Open social login in a popup window
    const popup = window.open(
      provider.authUrl,
      'socialLogin',
      'width=600,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for messages from the popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'SOCIAL_LOGIN_SUCCESS') {
        popup?.close();
        window.removeEventListener('message', messageListener);
        setLoading(null);
        onSuccess?.();
      } else if (event.data.type === 'SOCIAL_LOGIN_ERROR') {
        popup?.close();
        window.removeEventListener('message', messageListener);
        setLoading(null);
        onError?.(event.data.error || 'Social login failed');
      }
    };

    window.addEventListener('message', messageListener);

    // Handle popup closed manually
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        setLoading(null);
      }
    }, 1000);
  };

  if (providers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {providers.map((provider) => {
          const Icon = providerIcons[provider.name];
          const colorClass = providerColors[provider.name] || 'bg-gray-600 hover:bg-gray-700';
          
          return (
            <button
              key={provider.name}
              onClick={() => handleProviderLogin(provider)}
              disabled={loading === provider.name || !provider.enabled}
              className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${colorClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === provider.name ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  Continue with {provider.displayName}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
