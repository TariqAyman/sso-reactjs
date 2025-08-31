'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  Play, 
  Code, 
  Shield, 
  Users,
  Key,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function OAuthContent() {
  const [clientId, setClientId] = useState('your-client-id');
  const [redirectUri, setRedirectUri] = useState('http://localhost:3001/oauth/callback');
  const [scope, setScope] = useState('openid profile email');
  const [state, setState] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    // Generate a random state for CSRF protection
    const randomState = Math.random().toString(36).substring(2, 15);
    setState(randomState);
  }, []);

  useEffect(() => {
    // Build authorization URL
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      state: state,
    });
    
    setAuthUrl(`${baseUrl}/api/v1/oauth/authorize?${params.toString()}`);
  }, [clientId, redirectUri, scope, state]);

  const handleAuthorize = () => {
    window.location.href = authUrl;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCodeExample = () => {
    return `// Frontend JavaScript Example
const authorize = () => {
  const authUrl = new URL('http://localhost:3000/oauth/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', '${clientId}');
  authUrl.searchParams.set('redirect_uri', '${redirectUri}');
  authUrl.searchParams.set('scope', '${scope}');
  authUrl.searchParams.set('state', '${state}');
  
  window.location.href = authUrl.toString();
};

// Handle callback (in your callback page)
const handleCallback = async (code, state) => {
  // Verify state matches what you sent
  if (state !== '${state}') {
    throw new Error('Invalid state parameter');
  }
  
  // Exchange code for access token
  const response = await fetch('http://localhost:3000/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: '${redirectUri}',
      client_id: '${clientId}',
      client_secret: 'your-client-secret',
    }),
  });
  
  const tokens = await response.json();
  console.log('Access Token:', tokens.access_token);
  
  // Use access token to get user info
  const userResponse = await fetch('http://localhost:3000/auth/me', {
    headers: {
      'Authorization': \`Bearer \${tokens.access_token}\`,
    },
  });
  
  const user = await userResponse.json();
  console.log('User Info:', user);
};`;
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="navbar bg-base-100 border-b border-base-300 px-6">
        <div className="navbar-start">
          <a href="/dashboard" className="btn btn-ghost gap-2">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </a>
          <div className="divider divider-horizontal"></div>
          <div>
            <h1 className="text-xl font-bold">OAuth 2.0 Testing</h1>
            <p className="text-sm text-base-content/70">Test OAuth integration with Open SSO</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6">
            <AlertCircle className="h-5 w-5" />
            <div>
              <h3 className="font-bold">OAuth Error: {error}</h3>
              <div className="text-sm">{errorDescription || 'An error occurred during OAuth authentication'}</div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configuration Panel */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="card-title">OAuth Configuration</h2>
                  <p className="text-base-content/70 text-sm">Configure your OAuth 2.0 client parameters</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Client ID</span>
                  </label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="input input-bordered"
                    placeholder="your-client-id"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Redirect URI</span>
                  </label>
                  <input
                    type="url"
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                    className="input input-bordered"
                    placeholder="http://localhost:3001/oauth/callback"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Scope</span>
                  </label>
                  <input
                    type="text"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="input input-bordered"
                    placeholder="openid profile email"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">State (CSRF Protection)</span>
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input input-bordered"
                    placeholder="random-state-value"
                  />
                </div>

                <div className="card-actions mt-6">
                  <button onClick={handleAuthorize} className="btn btn-primary w-full gap-2">
                    <Play className="h-4 w-4" />
                    Start OAuth Authorization
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Generated URL Panel */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                  <Key className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h2 className="card-title">Authorization URL</h2>
                  <p className="text-base-content/70 text-sm">Generated OAuth authorization URL</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-base-200 p-4 rounded-lg border">
                  <code className="text-sm break-all text-base-content/80">
                    {authUrl}
                  </code>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(authUrl)}
                    className="btn btn-outline flex-1 gap-2"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => window.open(authUrl, '_blank')}
                    className="btn btn-outline flex-1 gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in New Tab
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="card bg-base-100 shadow-lg border border-base-300 mt-8">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Code className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="card-title">Integration Code Example</h2>
                <p className="text-base-content/70 text-sm">JavaScript example for integrating OAuth 2.0 in your application</p>
              </div>
            </div>

            <div className="mockup-code bg-neutral text-neutral-content">
              <pre><code>{generateCodeExample()}</code></pre>
            </div>

            <div className="card-actions mt-4">
              <button
                onClick={() => copyToClipboard(generateCodeExample())}
                className="btn btn-outline gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Code
              </button>
            </div>
          </div>
        </div>

        {/* OAuth Flow Explanation */}
        <div className="card bg-base-100 shadow-lg border border-base-300 mt-8">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Users className="h-5 w-5 text-info" />
              </div>
              <div>
                <h2 className="card-title">OAuth 2.0 Authorization Code Flow</h2>
                <p className="text-base-content/70 text-sm">Step-by-step explanation of the OAuth flow</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-content text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base-content">Authorization Request</h4>
                  <p className="text-base-content/70 text-sm mt-1">
                    User clicks "Start OAuth Authorization" and is redirected to the authorization server
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-content text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base-content">User Authentication</h4>
                  <p className="text-base-content/70 text-sm mt-1">
                    User logs in and grants permission to your application
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-content text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base-content">Authorization Code</h4>
                  <p className="text-base-content/70 text-sm mt-1">
                    User is redirected back to your app with an authorization code
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-content text-sm font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base-content">Token Exchange</h4>
                  <p className="text-base-content/70 text-sm mt-1">
                    Your backend exchanges the authorization code for an access token
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info text-info-content text-sm font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base-content">Access Protected Resources</h4>
                  <p className="text-base-content/70 text-sm mt-1">
                    Use the access token to make API calls on behalf of the user
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p className="text-gray-600">Loading OAuth testing page...</p>
        </div>
      </div>
    }>
      <OAuthContent />
    </Suspense>
  );
}
