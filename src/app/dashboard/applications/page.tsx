'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ssoAPI } from '@/lib/api';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  Shield, 
  ExternalLink,
  Smartphone,
  Settings,
  Copy,
  CheckCircle
} from 'lucide-react';
import type { SsoApplication } from '@/types';

export default function ApplicationsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => ssoAPI.getApplications().then((res: any) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ssoAPI.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading applications...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">Applications</h1>
        </div>
        <div className="navbar-end">
          <button 
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Application
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {showCreateForm && (
          <CreateApplicationForm 
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              queryClient.invalidateQueries({ queryKey: ['applications'] });
            }}
          />
        )}

        {/* Applications Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications?.map((app: SsoApplication) => (
            <div key={app.id} className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{app.applicationName}</h3>
                      <p className="text-base-content/70 text-sm">
                        {app.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className={`badge ${
                    app.status === 'active' 
                      ? 'badge-success' 
                      : 'badge-error'
                  }`}>
                    {app.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-base-content/50" />
                      <span className="text-sm font-medium">Application URL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-base-200 px-3 py-2 rounded text-xs font-mono truncate">
                        {app.applicationUrl}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(app.applicationUrl)}
                        className="btn btn-ghost btn-xs"
                        title="Copy URL"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-base-content/50" />
                      <span className="text-sm font-medium">Redirect URI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-base-200 px-3 py-2 rounded text-xs font-mono truncate">
                        {app.redirectUri}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(app.redirectUri)}
                        className="btn btn-ghost btn-xs"
                        title="Copy URI"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-base-content/70">Scope</span>
                    <div className="mt-1">
                      <div className="badge badge-outline badge-sm">
                        {app.scope || 'openid'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-6 pt-4 border-t border-base-300">
                  <a 
                    href={`/dashboard/applications/${app.id}`}
                    className="btn btn-ghost btn-sm gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </a>
                  <button 
                    onClick={() => handleDelete(app.id, app.applicationName)}
                    disabled={deleteMutation.isPending}
                    className="btn btn-error btn-sm gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {applications?.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-base-200">
              <Smartphone className="h-10 w-10 text-base-content/50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No applications yet</h3>
            <p className="text-base-content/70 mb-8 max-w-md mx-auto">
              Create your first SSO application to start managing authentication for your services
            </p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary btn-lg gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Your First Application
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function CreateApplicationForm({ 
  onClose, 
  onSuccess 
}: { 
  onClose: () => void; 
  onSuccess: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    redirectUris: [''],
    allowedScopes: ['openid', 'profile', 'email'],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: any) => ssoAPI.createApplication(data),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to create application');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Filter out empty redirect URIs
    const redirectUris = formData.redirectUris.filter(uri => uri.trim() !== '');
    
    if (redirectUris.length === 0) {
      setError('At least one redirect URI is required');
      setIsLoading(false);
      return;
    }

    createMutation.mutate({
      ...formData,
      redirectUris,
    });
    
    setIsLoading(false);
  };

  const addRedirectUri = () => {
    setFormData({
      ...formData,
      redirectUris: [...formData.redirectUris, '']
    });
  };

  const updateRedirectUri = (index: number, value: string) => {
    const updated = [...formData.redirectUris];
    updated[index] = value;
    setFormData({
      ...formData,
      redirectUris: updated
    });
  };

  const removeRedirectUri = (index: number) => {
    const updated = formData.redirectUris.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      redirectUris: updated
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">Create New Application</h3>
            <p className="text-base-content/70">Set up a new SSO application for your service</p>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm"
          >
            ✕
          </button>
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
              <span className="label-text font-medium">Application Name *</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input input-bordered w-full"
              placeholder="My Awesome App"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="textarea textarea-bordered"
              rows={3}
              placeholder="Brief description of your application"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Redirect URIs *</span>
              <span className="label-text-alt">Where users will be redirected after authentication</span>
            </label>
            {formData.redirectUris.map((uri, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={uri}
                  onChange={(e) => updateRedirectUri(index, e.target.value)}
                  className="input input-bordered flex-1"
                  placeholder="https://yourapp.com/auth/callback"
                />
                {formData.redirectUris.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRedirectUri(index)}
                    className="btn btn-outline btn-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addRedirectUri}
              className="btn btn-outline btn-sm gap-2 mt-2"
            >
              <Plus className="h-4 w-4" />
              Add Redirect URI
            </button>
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || createMutation.isPending}
              className="btn btn-primary"
            >
              {(isLoading || createMutation.isPending) && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              {isLoading || createMutation.isPending ? 'Creating...' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
