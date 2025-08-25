'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, Shield, Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:bg-primary lg:px-12">
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary-content text-primary">
              <Shield className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold text-primary-content">Welcome Back</h1>
            <p className="mt-4 text-xl text-primary-content/80">
              Sign in to manage your SSO infrastructure
            </p>
            <div className="mt-8 space-y-4 text-primary-content/70">
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary-content/50"></div>
                <span>Secure OAuth 2.0 implementation</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary-content/50"></div>
                <span>Real-time webhook monitoring</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary-content/50"></div>
                <span>Enterprise-grade security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-content">
                <Shield className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Open SSO</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
              <p className="mt-2 text-gray-600">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email address</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full pl-12"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full pl-12 pr-12"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="label cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                  <span className="label-text ml-2">Remember me</span>
                </label>
                <a href="#" className="link link-primary text-sm">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading && <span className="loading loading-spinner loading-sm"></span>}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="link link-primary font-medium">
                  Sign up here
                </a>
              </p>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="btn btn-ghost btn-sm gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
