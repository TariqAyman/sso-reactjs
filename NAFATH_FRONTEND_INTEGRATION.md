# Nafath Frontend Integration Guide

## Overview

This document outlines the changes made to integrate Nafath SSO authentication into the Next.js frontend of the Open SSO project.

## ✅ Completed Changes

### 1. **Environment Configuration**

Added Nafath-specific environment variables to `.env.local`:

```bash
# Nafath Configuration
NEXT_PUBLIC_NAFATH_ENABLED=true
NEXT_PUBLIC_NAFATH_CLIENT_ID=your_nafath_client_id
NEXT_PUBLIC_NAFATH_ENVIRONMENT=development
```

### 2. **Auth Context Updates**

Updated `/src/lib/auth-context.tsx`:

- Added `loginWithNafath()` method for initiating Nafath authentication
- Added `verifyNafathTransaction()` method for completing authentication
- Integrated with existing auth state management

### 3. **Login Page Integration**

Updated `/src/app/login/page.tsx`:

- Added Nafath login section with separator
- Integrated `NafathLogin` component into the main login flow
- Maintains existing email/password authentication

### 4. **NafathLogin Component**

Updated `/src/components/NafathLogin.tsx`:

- Integrated with auth context for seamless authentication flow
- Added automatic redirect to dashboard on successful authentication
- Uses shared authentication state management

### 5. **API Proxy Routes**

Created Next.js API routes in `/src/app/api/auth/nafath/`:

- `initiate/route.ts` - Proxy for authentication initiation
- `status/[transactionId]/route.ts` - Proxy for status polling
- `verify/route.ts` - Proxy for transaction verification

## 🎯 Key Features

### Authentication Flow

1. **Initiation**: User enters National ID and selects channel (PUSH/QR)
2. **Polling**: Real-time status updates with 5-minute timeout
3. **Verification**: Automatic user creation and JWT token generation
4. **Redirect**: Seamless redirect to dashboard on success

### User Experience

- **Dual Channel Support**: Both PUSH notifications and QR code scanning
- **Real-time Feedback**: Live status updates and countdown timer
- **Error Handling**: Comprehensive error messages and retry options
- **Responsive Design**: Works on desktop and mobile devices

### Security Features

- **National ID Validation**: Validates Saudi National ID format
- **Transaction Expiry**: 5-minute timeout for security
- **State Management**: Secure transaction ID handling
- **Error Recovery**: Proper cleanup and reset functionality

## 🔧 Testing the Integration

### 1. Start Development Servers

```bash
# Backend (NestJS)
cd nestjs-open-sso
npm run start:dev

# Frontend (Next.js)
cd nextjs-open-sso
npm run dev
```

### 2. Test Nafath Login

1. Navigate to `http://localhost:3001/login`
2. Scroll down to see "Or continue with" section
3. Click "Sign in with Nafath" button
4. Enter a test National ID (e.g., `1234567890`)
5. Select PUSH or QR channel
6. Click "Authenticate with Nafath"
7. The system will show pending status with countdown
8. Mock responses will auto-approve after a few seconds

### 3. Verify Authentication Flow

- Check browser network tab for API calls
- Verify JWT token storage in browser
- Confirm redirect to dashboard
- Test error scenarios with invalid National IDs

## 📝 Configuration Notes

### Production Setup

For production deployment, update these configurations:

1. **Environment Variables**:

```bash
NEXT_PUBLIC_NAFATH_CLIENT_ID=actual_production_client_id
NEXT_PUBLIC_NAFATH_ENVIRONMENT=production
```

2. **Backend Integration**:

- Replace mock responses with actual Nafath API calls
- Configure proper SSL certificates
- Set up webhook endpoints for callbacks

3. **Security Considerations**:

- Enable HTTPS for all API communications
- Implement proper CORS policies
- Add rate limiting for authentication attempts

## 🔍 Troubleshooting

### Common Issues

1. **Component Not Rendering**:

   - Check that NafathLogin component is properly imported
   - Verify Auth context is wrapped around the app

2. **API Calls Failing**:

   - Ensure backend server is running on port 3000
   - Check proxy route configurations
   - Verify environment variables are set

3. **Authentication Not Working**:
   - Check browser console for errors
   - Verify JWT token generation in backend
   - Test API endpoints directly with curl

### Debug Commands

```bash
# Test backend endpoints
curl -X POST http://localhost:3000/api/auth/nafath/initiate \
  -H "Content-Type: application/json" \
  -d '{"nationalId":"1234567890","channel":"PUSH"}'

# Check frontend API routes
curl http://localhost:3001/api/auth/nafath/initiate
```

## 📋 Next Steps

### Optional Enhancements

1. **Biometric Support**: Add fingerprint/face recognition options
2. **Multiple Languages**: Implement Arabic/English language switching
3. **Advanced Analytics**: Track authentication success rates
4. **Admin Dashboard**: Monitor Nafath transactions and users

### Integration with Other Features

1. **SSO Providers**: Add Nafath to OAuth provider selection
2. **User Management**: Enhance user profiles with Nafath data
3. **Audit Logging**: Track Nafath authentication events
4. **Webhooks**: Implement Nafath webhook handling

## 🔗 Related Documentation

- [Backend Nafath Integration](../nestjs-open-sso/NAFATH_INTEGRATION.md)
- [API Documentation](../nestjs-open-sso/docs/api/nafath.md)
- [Security Guidelines](SECURITY.md)
- [Deployment Guide](DEPLOYMENT.md)
