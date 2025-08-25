'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  [key: string]: any;
}

export default function OAuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [tokens, setTokens] = useState<TokenResponse | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [rawResponse, setRawResponse] = useState<string>('');
  
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const errorParam = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    const handleCallback = async () => {
      // Check for OAuth errors
      if (errorParam) {
        setStatus('error');
        setError(`${errorParam}: ${errorDescription || 'Unknown error'}`);
        return;
      }

      // Check for authorization code
      if (!code) {
        setStatus('error');
        setError('No authorization code received');
        return;
      }

      try {
        // Exchange authorization code for access token
        const tokenResponse = await fetch('http://localhost:3000/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3001/oauth/callback',
            client_id: 'your-client-id', // In production, this would come from your config
            client_secret: 'your-client-secret', // In production, this would be done server-side
          }),
        });

        const tokenData = await tokenResponse.json();
        setRawResponse(JSON.stringify(tokenData, null, 2));

        if (!tokenResponse.ok) {
          throw new Error(tokenData.error || 'Failed to exchange code for token');
        }

        setTokens(tokenData);

        // Use access token to get user information
        const userResponse = await fetch('http://localhost:3000/auth/me', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserInfo(userData);
        }

        setStatus('success');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    };

    handleCallback();
  }, [code, errorParam, errorDescription]);

  const formatExpiresIn = (expiresIn: number) => {
    const minutes = Math.floor(expiresIn / 60);
    const seconds = expiresIn % 60;
    return `${minutes}m ${seconds}s`;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Processing OAuth Callback
            </h2>
            <p className="text-gray-600">
              Exchanging authorization code for access token...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full px-4">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">OAuth Error</CardTitle>
              <CardDescription className="text-red-700">
                An error occurred during the OAuth process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-red-100 border border-red-200 rounded-md p-4 mb-4">
                <pre className="text-sm text-red-800 whitespace-pre-wrap">
                  {error}
                </pre>
              </div>
              {rawResponse && (
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Raw Response:</h4>
                  <pre className="bg-red-100 border border-red-200 rounded-md p-4 text-sm text-red-800 overflow-x-auto">
                    {rawResponse}
                  </pre>
                </div>
              )}
              <div className="mt-6 flex space-x-4">
                <Button variant="outline" asChild>
                  <a href="/oauth">← Try Again</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/dashboard">Dashboard</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-900">OAuth Authentication Successful!</h1>
          <p className="mt-2 text-gray-600">
            Successfully exchanged authorization code for access token
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Token Information */}
          <Card>
            <CardHeader>
              <CardTitle>Access Token Details</CardTitle>
              <CardDescription>
                Information about the received access token
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tokens && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Access Token
                    </label>
                    <div className="bg-gray-50 p-3 rounded border font-mono text-sm break-all">
                      {tokens.access_token}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Token Type
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {tokens.token_type}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expires In
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {formatExpiresIn(tokens.expires_in)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scope
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {tokens.scope}
                    </div>
                  </div>

                  {tokens.refresh_token && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Refresh Token
                      </label>
                      <div className="bg-gray-50 p-3 rounded border font-mono text-sm break-all">
                        {tokens.refresh_token}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                User details retrieved using the access token
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userInfo ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {userInfo.id}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {userInfo.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {userInfo.name}
                    </div>
                  </div>

                  {/* Show any additional user properties */}
                  {Object.entries(userInfo).map(([key, value]) => {
                    if (['id', 'email', 'name'].includes(key)) return null;
                    return (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <div className="bg-gray-50 p-3 rounded border">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Unable to retrieve user information</p>
                  <p className="text-sm mt-2">
                    The access token might not have sufficient scope or the user endpoint might be unavailable
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Raw Response */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Raw Token Response</CardTitle>
              <CardDescription>
                Complete response from the token endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                {rawResponse}
              </pre>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(rawResponse)}
                >
                  Copy Response
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center space-x-4">
          <Button variant="outline" asChild>
            <a href="/oauth">← Test Again</a>
          </Button>
          <Button asChild>
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
