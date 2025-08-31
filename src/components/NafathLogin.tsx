'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Smartphone, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import { NafathInitiateRequest, NafathStatusResponse } from '@/types';

interface NafathLoginProps {
  onSuccess?: (token: string) => void;
  onError?: (error: string) => void;
}

export default function NafathLogin({ onSuccess, onError }: NafathLoginProps) {
  const [purpose, setPurpose] = useState('authentication');
  const [serviceId, setServiceId] = useState('');
  const [random, setRandom] = useState('');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'initiating' | 'pending' | 'approved' | 'rejected' | 'expired'>('idle');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  
  const { updateUser } = useAuth();
  const router = useRouter();

  // Generate random string for Nafath
  useEffect(() => {
    setRandom(Math.random().toString(36).substring(2, 15));
  }, []);

  // Poll for status updates
  useEffect(() => {
    if (transactionId && status === 'pending') {
      const interval = setInterval(async () => {
        try {
          const response = await authAPI.nafathStatus(transactionId);
          const data: NafathStatusResponse = response.data;
          
          if (data.status === 'APPROVED') {
            setStatus('approved');
            // User is now authenticated, the response should contain user data
            if (data.result?.user) {
              updateUser(data.result.user);
              onSuccess?.('success');
              router.push('/dashboard');
            }
          } else if (data.status === 'REJECTED') {
            setStatus('rejected');
            setError('Authentication was rejected');
            onError?.('Authentication was rejected');
          } else if (data.status === 'EXPIRED') {
            setStatus('expired');
            setError('Authentication request expired');
            onError?.('Authentication request expired');
          }
        } catch (err) {
          console.error('Status check failed:', err);
        }
      }, 2000); // Check every 2 seconds

      return () => clearInterval(interval);
    }
  }, [transactionId, status, onSuccess, onError, updateUser, router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && status === 'pending') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && status === 'pending') {
      setStatus('expired');
      setError('Authentication request expired');
    }
  }, [timeLeft, status]);

  const initiate = async () => {
    if (!serviceId.trim()) {
      setError('Please enter a service ID');
      return;
    }

    setStatus('initiating');
    setError('');

    try {
      const nafathData: NafathInitiateRequest = {
        purpose,
        serviceId: serviceId.trim(),
        random,
      };

      const response = await authAPI.nafathInitiate(nafathData);
      const data = response.data;
      
      setTransactionId(data.transactionId);
      setQrCode(data.qrCodeUrl || null);
      setDeepLink(data.deepLinkUrl || null);
      
      setStatus('pending');
      setTimeLeft(300); // 5 minutes default
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to initiate authentication';
      setError(errorMessage);
      setStatus('idle');
      onError?.(errorMessage);
    }
  };

  const reset = () => {
    setTransactionId(null);
    setQrCode(null);
    setStatus('idle');
    setError('');
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (status === 'idle' || status === 'initiating') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <img 
                src="/nafath-logo.png" 
                alt="Nafath" 
                className="h-8 w-8"
                onError={(e) => {
                  // Fallback to text if logo not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.classList.remove('hidden');
                }}
              />
              <span className="hidden text-green-600 font-bold text-sm">نفاذ</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sign in with Nafath</h2>
            <p className="text-gray-600 mt-2">Enter your National ID to authenticate</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-2">
                Service ID
              </label>
              <input
                type="text"
                id="serviceId"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                placeholder="Enter service ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={status === 'initiating'}
              />
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                Purpose
              </label>
              <select
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={status === 'initiating'}
              >
                <option value="authentication">Authentication</option>
                <option value="signature">Digital Signature</option>
                <option value="verification">Identity Verification</option>
              </select>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <button
              onClick={initiate}
              disabled={status === 'initiating' || !serviceId.trim()}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'initiating' ? 'Initiating...' : 'Authenticate with Nafath'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            {getStatusIcon()}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {status === 'pending' && 'Waiting for Authentication'}
            {status === 'approved' && 'Authentication Successful'}
            {status === 'rejected' && 'Authentication Rejected'}
            {status === 'expired' && 'Authentication Expired'}
          </h2>

          {status === 'pending' && (
            <>
              <p className="text-gray-600 mb-4">
                Please approve the authentication request in your Nafath app or scan the QR code below
              </p>
              
              {timeLeft > 0 && (
                <div className="text-sm text-gray-500 mb-4">
                  Time remaining: {formatTime(timeLeft)}
                </div>
              )}

              {qrCode && (
                <div className="mb-4">
                  <img 
                    src={qrCode} 
                    alt="Nafath QR Code" 
                    className="mx-auto max-w-48 max-h-48"
                  />
                </div>
              )}

              {deepLink && (
                <div className="mb-4">
                  <a
                    href={deepLink}
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 underline"
                  >
                    <Smartphone className="h-4 w-4" />
                    Open in Nafath App
                  </a>
                </div>
              )}
            </>
          )}

          {(status === 'rejected' || status === 'expired') && (
            <p className="text-gray-600 mb-4">{error}</p>
          )}

          {status === 'approved' && (
            <p className="text-green-600 mb-4">You have been successfully authenticated!</p>
          )}

          {(status === 'rejected' || status === 'expired') && (
            <button
              onClick={reset}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          )}

          {status === 'pending' && (
            <button
              onClick={reset}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
