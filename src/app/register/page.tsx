'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { ArrowLeft, Shield, Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success/5 via-white to-success/10 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-success text-success-content">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Your account has been created successfully. Redirecting to login...
          </p>
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-success"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-white to-accent/5">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:bg-secondary lg:px-12">
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-secondary-content text-secondary">
              <Shield className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold text-secondary-content">Join Open SSO</h1>
            <p className="mt-4 text-xl text-secondary-content/80">
              Start managing your authentication infrastructure today
            </p>
            <div className="mt-8 space-y-4 text-secondary-content/70">
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-secondary-content/50"></div>
                <span>Free tier with generous limits</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-secondary-content/50"></div>
                <span>Easy integration with existing apps</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-secondary-content/50"></div>
                <span>24/7 developer support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-content">
                <Shield className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Open SSO</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
              <p className="mt-2 text-gray-600">
                Get started with your SSO management platform
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
                  <span className="label-text font-medium">Full name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-12"
                    placeholder="Enter your full name"
                  />
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email address</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-12 pr-12"
                    placeholder="Create a password"
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

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Confirm password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-12 pr-12"
                    placeholder="Confirm your password"
                  />
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input type="checkbox" required className="checkbox checkbox-secondary checkbox-sm" />
                  <span className="label-text">
                    I agree to the{' '}
                    <a href="#" className="link link-secondary">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="link link-secondary">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-secondary w-full"
              >
                {isLoading && <span className="loading loading-spinner loading-sm"></span>}
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="link link-secondary font-medium">
                  Sign in here
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
