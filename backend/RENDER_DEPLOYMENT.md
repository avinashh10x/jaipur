# Render Deployment Guide

## Issues Resolved:

1. **Port Configuration**: Updated to bind to `0.0.0.0` for Render compatibility
2. **Node.js Version**: Added `.nvmrc` and `engines` field in package.json
3. **Environment Variables**: Created `render.yaml` for configuration
4. **CORS Configuration**: Updated for production vs development
5. **Health Check**: Default route at `/` provides API status

## Steps to Deploy on Render:

### 1. Environment Variables Setup
In your Render dashboard, set these environment variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://test:test123@cluster0.gdcm9.mongodb.net/profile_manager?retryWrites=true&w=majority&appName=Cluster0
PORT=10000 (Render will set this automatically)
```

### 2. Build Settings
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node
- **Node Version**: 22.14.0 (from .nvmrc)

### 3. Service Configuration
The `render.yaml` file is already configured with proper settings.

### 4. Common Issues & Solutions:

#### Issue: "Build failed" or "Logs not showing"
**Solution**: Check if these files exist and are properly configured:
- ✅ package.json (has start script)
- ✅ .nvmrc (specifies Node version)
- ✅ render.yaml (service configuration)

#### Issue: "Cannot connect to database"
**Solution**: Ensure MongoDB URI is set correctly in Render environment variables

#### Issue: "CORS errors"
**Solution**: Add your frontend domain to the CORS origins in index.js

#### Issue: "Port binding failed"
**Solution**: App now binds to 0.0.0.0 and uses Render's PORT variable

### 5. After Deployment:
1. Update your frontend API URL to point to your Render service
2. Test all endpoints
3. Monitor logs for any issues

### 6. Debugging Commands:
```bash
# Test locally first
npm start

# Check if all dependencies install correctly
npm install

# Verify Node version
node --version
```

## File Changes Made:
- ✅ `index.js` - Updated port binding and CORS
- ✅ `package.json` - Added engines and description
- ✅ `.nvmrc` - Specified Node.js version
- ✅ `render.yaml` - Service configuration
- ✅ This deployment guide

Your backend should now deploy successfully on Render!
