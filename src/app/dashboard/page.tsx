'use client';

import { useAuth } from '@/lib/auth-context';
import { useQuery } from '@tanstack/react-query';
import { ssoAPI, oauthAPI } from '@/lib/api';
import { 
  Shield, 
  Settings, 
  Users, 
  Server, 
  Webhook, 
  BarChart3, 
  Plus, 
  Bell, 
  Search,
  Menu,
  LogOut,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  // Fetch dashboard data
  const { data: applications } = useQuery({
    queryKey: ['applications'],
    queryFn: () => ssoAPI.getApplications().then(res => res.data),
  });

  const { data: oauthClients } = useQuery({
    queryKey: ['oauth-clients'],
    queryFn: () => oauthAPI.getClients().then(res => res.data),
  });

  const { data: webhooks } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => ssoAPI.getWebhooks().then(res => res.data),
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warning text-warning-content">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-base-content/70 mb-6">You need to be logged in to access the dashboard</p>
          <a href="/login" className="btn btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="navbar bg-base-100 border-b border-base-300 px-6">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <Menu className="h-5 w-5" />
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a href="/dashboard/applications">Applications</a></li>
              <li><a href="/dashboard/oauth">OAuth Clients</a></li>
              <li><a href="/dashboard/webhooks">Webhooks</a></li>
              <li><a href="/oauth">OAuth Testing</a></li>
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-content">
              <Shield className="h-6 w-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Open SSO</h1>
              <p className="text-sm text-base-content/70">Dashboard</p>
            </div>
          </div>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <div className="form-control">
            <div className="input-group">
              <input type="text" placeholder="Search..." className="input input-bordered input-sm w-64" />
              <button className="btn btn-square btn-sm">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="navbar-end">
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-circle btn-sm">
              <div className="indicator">
                <Bell className="h-5 w-5" />
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
            
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <span className="text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><span className="font-medium">{user.name}</span></li>
                <li><span className="text-xs text-base-content/70">{user.email}</span></li>
                <li><hr className="my-2" /></li>
                <li><a><Settings className="h-4 w-4" />Settings</a></li>
                <li><button onClick={logout}><LogOut className="h-4 w-4" />Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-base-content/70">Here's what's happening with your SSO infrastructure today.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 border border-base-300 rounded-lg">
            <div className="stat-figure text-primary">
              <Users className="h-8 w-8" />
            </div>
            <div className="stat-title">Applications</div>
            <div className="stat-value text-primary">{applications?.length || 0}</div>
            <div className="stat-desc">Active SSO applications</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-lg">
            <div className="stat-figure text-secondary">
              <Server className="h-8 w-8" />
            </div>
            <div className="stat-title">OAuth Clients</div>
            <div className="stat-value text-secondary">{oauthClients?.length || 0}</div>
            <div className="stat-desc">Configured clients</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-lg">
            <div className="stat-figure text-accent">
              <Webhook className="h-8 w-8" />
            </div>
            <div className="stat-title">Webhooks</div>
            <div className="stat-value text-accent">{webhooks?.length || 0}</div>
            <div className="stat-desc">Active endpoints</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-lg">
            <div className="stat-figure text-success">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div className="stat-title">Uptime</div>
            <div className="stat-value text-success">99.9%</div>
            <div className="stat-desc">Last 30 days</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Applications Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="card-title text-lg">Applications</h3>
              </div>
              <p className="text-base-content/70 text-sm mb-4">
                Create and manage your SSO applications
              </p>
              <div className="card-actions flex-col gap-2">
                <a href="/dashboard/applications" className="btn btn-primary btn-sm w-full">
                  Manage Applications
                </a>
                <a href="/dashboard/applications/new" className="btn btn-outline btn-sm w-full gap-1">
                  <Plus className="h-4 w-4" />
                  Create New App
                </a>
              </div>
            </div>
          </div>

          {/* OAuth Clients Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                  <Server className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="card-title text-lg">OAuth Clients</h3>
              </div>
              <p className="text-base-content/70 text-sm mb-4">
                OAuth 2.0 client management
              </p>
              <div className="card-actions flex-col gap-2">
                <a href="/dashboard/oauth" className="btn btn-secondary btn-sm w-full">
                  Manage Clients
                </a>
                <a href="/dashboard/oauth/new" className="btn btn-outline btn-sm w-full gap-1">
                  <Plus className="h-4 w-4" />
                  Create New Client
                </a>
              </div>
            </div>
          </div>

          {/* Webhooks Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Webhook className="h-5 w-5 text-accent" />
                </div>
                <h3 className="card-title text-lg">Webhooks</h3>
              </div>
              <p className="text-base-content/70 text-sm mb-4">
                Monitor webhook deliveries
              </p>
              <div className="card-actions flex-col gap-2">
                <a href="/dashboard/webhooks" className="btn btn-accent btn-sm w-full">
                  Manage Webhooks
                </a>
                <a href="/dashboard/webhook-logs" className="btn btn-outline btn-sm w-full gap-1">
                  <Activity className="h-4 w-4" />
                  View Logs
                </a>
              </div>
            </div>
          </div>

          {/* OAuth Testing Card */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <BarChart3 className="h-5 w-5 text-info" />
                </div>
                <h3 className="card-title text-lg">OAuth Testing</h3>
              </div>
              <p className="text-base-content/70 text-sm mb-4">
                Test OAuth 2.0 integration
              </p>
              <div className="card-actions flex-col gap-2">
                <a href="/oauth" className="btn btn-info btn-sm w-full">
                  Test OAuth Flow
                </a>
                <a href="/oauth/callback" className="btn btn-outline btn-sm w-full gap-1">
                  <Clock className="h-4 w-4" />
                  View Last Result
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title text-xl">Recent Activity</h2>
              <button className="btn btn-ghost btn-sm">
                View All
              </button>
            </div>
            
            <div className="text-center py-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-base-200">
                <Activity className="h-8 w-8 text-base-content/50" />
              </div>
              <h3 className="text-lg font-medium text-base-content/70 mb-2">No recent activity</h3>
              <p className="text-base-content/50">
                Activity will appear here as you use the system
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
