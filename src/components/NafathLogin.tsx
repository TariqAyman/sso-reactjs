'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Smartphone, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface NafathLoginProps {
  onSuccess?: (token: string) => void;
  onError?: (error: string) => void;
}

export default function NafathLogin({ onSuccess, onError }: NafathLoginProps) {
  const [nationalId, setNationalId] = useState('');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'initiating' | 'pending' | 'approved' | 'rejected' | 'expired'>('idle');
  const [channel, setChannel] = useState<'PUSH' | 'QR'>('PUSH');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  
  const { loginWithNafath, verifyNafathTransaction } = useAuth();
  const router = useRouter();

  // Poll for status updates
  useEffect(() => {
    if (transactionId && status === 'pending') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/auth/nafath/status/${transactionId}`);
          const data = await response.json();
          
          if (data.status === 'APPROVED') {
            setStatus('approved');
            // Verify the transaction using auth context
            try {
              await verifyNafathTransaction(transactionId);
              onSuccess?.('success');
              router.push('/dashboard'); // Redirect to dashboard on success
            } catch (error) {
              setError('Verification failed');
              onError?.('Verification failed');
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
  }, [transactionId, status, onSuccess, onError]);

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
    if (!nationalId.trim()) {
      setError('Please enter your National ID');
      return;
    }

    if (!/^[12]\d{9}$/.test(nationalId)) {
      setError('Please enter a valid 10-digit National ID starting with 1 or 2');
      return;
    }

    setStatus('initiating');
    setError('');

    try {
      const transactionId = await loginWithNafath(nationalId, channel);
      setTransactionId(transactionId);
      
      // Get additional details like QR code if needed
      const response = await fetch(`/api/auth/nafath/status/${transactionId}`);
      const data = await response.json();
      setQrCode(data.qrCode);
      
      setStatus('pending');
      setTimeLeft(300); // 5 minutes default
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate authentication');
      setStatus('idle');
      onError?.(err instanceof Error ? err.message : 'Failed to initiate authentication');
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
              <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
                National ID / Iqama Number
              </label>
              <input
                type="text"
                id="nationalId"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                maxLength={10}
                disabled={status === 'initiating'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authentication Method
              </label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setChannel('PUSH')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md border ${
                    channel === 'PUSH'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-white border-gray-300 text-gray-600'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  Push Notification
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('QR')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md border ${
                    channel === 'QR'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-white border-gray-300 text-gray-600'
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  QR Code
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <button
              onClick={initiate}
              disabled={status === 'initiating' || !nationalId.trim()}
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
                {channel === 'PUSH' 
                  ? 'Please approve the authentication request in your Nafath app'
                  : 'Please scan the QR code with your Nafath app'
                }
              </p>
              
              {timeLeft > 0 && (
                <div className="text-sm text-gray-500 mb-4">
                  Time remaining: {formatTime(timeLeft)}
                </div>
              )}

              {qrCode && channel === 'QR' && (
                <div className="mb-4">
                  <img 
                    src={qrCode} 
                    alt="Nafath QR Code" 
                    className="mx-auto max-w-48 max-h-48"
                  />
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
