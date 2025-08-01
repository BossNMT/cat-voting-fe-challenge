# 🚀 Deployment Guide

## Quick Deploy Options

### Option 1: Netlify (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository for automatic deploys

3. **Add Environment Variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add: `VITE_CAT_API_KEY` with your TheCatAPI key
   - Add: `VITE_CAT_API_BASE_URL` with `https://api.thecatapi.com/v1`

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add Environment Variables**
   ```bash
   vercel env add VITE_CAT_API_KEY
   vercel env add VITE_CAT_API_BASE_URL
   ```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Build and deploy**
   ```bash
   npm run build
   npm run deploy
   ```

## Environment Variables

Make sure to set these environment variables in your deployment platform:

```
VITE_CAT_API_KEY=your_actual_api_key_here
VITE_CAT_API_BASE_URL=https://api.thecatapi.com/v1
```

## Getting TheCatAPI Key

1. Go to [thecatapi.com](https://thecatapi.com)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Use it in your environment variables

## Build Settings

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18+

## Post-Deployment Checklist

- [ ] Verify the app loads correctly
- [ ] Test image loading functionality
- [ ] Test voting functionality
- [ ] Verify error handling works
- [ ] Check responsive design on mobile
- [ ] Test refresh functionality
- [ ] Confirm vote persistence works

## Troubleshooting

### Images not loading
- Check if `VITE_CAT_API_KEY` is correctly set
- Verify API key is valid on TheCatAPI dashboard

### Build failures
- Ensure Node.js version is 18+
- Run `npm install --legacy-peer-deps` if dependency conflicts occur
- Check TypeScript errors with `npm run build`

### Voting not working
- Verify API key has voting permissions
- Check browser console for network errors
- Ensure CORS is properly configured (TheCatAPI handles this)

## Performance Optimization

For production deployments, consider:

- Enable gzip compression
- Set up CDN for static assets
- Configure proper caching headers
- Monitor bundle size with `npm run build`

## Security Notes

- API key is exposed in client-side code (this is normal for TheCatAPI)
- TheCatAPI is public and free, so no sensitive data exposure
- Consider rate limiting if needed in the future