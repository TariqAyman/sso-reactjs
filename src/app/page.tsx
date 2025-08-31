'use client';

import type { NextPage } from 'next';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, Shield, Server, Webhook, Users, Globe, Lock } from 'lucide-react';

const HomePage: NextPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      {/* Test Banner to verify DaisyUI is working */}
      <div className="alert alert-info mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>If you can see this styled alert, DaisyUI is working! 🎉</span>
      </div>

      {/* Hero Section */}
      <div className="hero min-h-screen bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="mb-8">
              <div className="avatar">
                <div className="w-24 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <Shield className="h-12 w-12" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold">
              <span className="text-primary">Open</span> SSO
            </h1>
            <p className="py-6">
              The modern Single Sign-On platform that simplifies authentication 
              and authorization for your applications.
            </p>
            
            {user ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  Welcome back, {user.name}!
                </h2>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <a href="/dashboard" className="btn btn-primary btn-lg">
                    Go to Dashboard
                    <ChevronRight className="h-5 w-5" />
                  </a>
                  <button onClick={logout} className="btn btn-outline btn-lg">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <a href="/login" className="btn btn-primary btn-lg">
                    Get Started
                    <ChevronRight className="h-5 w-5" />
                  </a>
                  <a href="/register" className="btn btn-outline btn-lg">
                    Sign Up
                  </a>
                </div>
                <p className="text-sm text-base-content/70">
                  No credit card required • Free tier available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need for modern authentication
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Built with security, scalability, and developer experience in mind.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Application Management */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="mb-4">
                  <div className="avatar">
                    <div className="w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <h3 className="card-title">Application Management</h3>
                <p className="text-base-content/70">
                  Manage your SSO applications and configurations with an intuitive interface.
                  Create, update, and monitor all your applications from one central dashboard.
                </p>
                <div className="card-actions justify-start mt-4">
                  <div className="badge badge-primary badge-outline">Easy Setup</div>
                  <div className="badge badge-secondary badge-outline">Real-time</div>
                </div>
              </div>
            </div>

            {/* OAuth 2.0 Server */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="mb-4">
                  <div className="avatar">
                    <div className="w-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                      <Server className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <h3 className="card-title">OAuth 2.0 Server</h3>
                <p className="text-base-content/70">
                  Complete OAuth 2.0 authorization server implementation with client management,
                  token handling, and comprehensive security features.
                </p>
                <div className="card-actions justify-start mt-4">
                  <div className="badge badge-success badge-outline">RFC Compliant</div>
                  <div className="badge badge-info badge-outline">Secure</div>
                </div>
              </div>
            </div>

            {/* Webhook System */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="mb-4">
                  <div className="avatar">
                    <div className="w-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                      <Webhook className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <h3 className="card-title">Webhook System</h3>
                <p className="text-base-content/70">
                  Real-time webhook notifications for authentication events.
                  Monitor deliveries, retry failed requests, and manage endpoints.
                </p>
                <div className="card-actions justify-start mt-4">
                  <div className="badge badge-warning badge-outline">Real-time</div>
                  <div className="badge badge-error badge-outline">Reliable</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16 text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of developers who trust Open SSO for their authentication needs.
          </p>
          {!user && (
            <a href="/register" className="btn btn-accent btn-lg">
              Start Free Trial
              <ChevronRight className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
