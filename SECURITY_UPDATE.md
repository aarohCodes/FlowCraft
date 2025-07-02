# 🔒 Security Update: Zoom Client Secret Protection

## Issue
The `VITE_ZOOM_CLIENT_SECRET` environment variable was exposed to the browser, which is a security vulnerability. Vite environment variables prefixed with `VITE_` are bundled into the client-side code and visible to users.

## Solution
Moved all Zoom OAuth operations to secure backend API endpoints that keep the client secret private.

## Changes Made

### 1. Created Secure Backend API Endpoints
- `api/zoom/auth.js` - Handles OAuth authorization and token exchange
- `api/zoom/transcript.js` - Securely fetches meeting transcripts

### 2. Updated Frontend Services
- `src/services/zoomApi.ts` - Now uses `/api/zoom/auth` and `/api/zoom/transcript` endpoints
- `src/services/videoMeetingApi.ts` - Updated to use secure backend for Zoom operations

### 3. Environment Variables
**Remove from frontend (.env):**
```
VITE_ZOOM_CLIENT_SECRET=your_secret_here
```

**Add to backend (Vercel environment variables):**
```
ZOOM_CLIENT_ID=your_client_id
ZOOM_CLIENT_SECRET=your_client_secret
ZOOM_REDIRECT_URI=https://flowcraft-six.vercel.app/zoom/callback
```

## Security Benefits
- ✅ Client secret is never exposed to the browser
- ✅ All sensitive operations happen on the server
- ✅ OAuth flow is properly secured
- ✅ API calls are authenticated via access tokens

## Deployment
1. Add the environment variables to Vercel dashboard
2. Deploy the API endpoints to Vercel
3. Remove `VITE_ZOOM_CLIENT_SECRET` from frontend environment

## Testing
- OAuth flow should work as before
- Meeting transcripts should be fetched securely
- No client secret exposure in browser developer tools 