# Deployment Guide

## GitHub Pages Deployment

This project is configured for easy deployment to GitHub Pages.

### Step 1: Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Tariff Wars game theory simulation"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Name it `gametheory` (or your preferred name)
3. Don't initialize with README (we already have one)
4. Create repository

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/gametheory.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** in the left sidebar
4. Under "Source", select:
   - **Branch**: `main`
   - **Folder**: `/docs`
5. Click **Save**

### Step 5: Wait for Deployment

GitHub will build and deploy your site. This usually takes 1-2 minutes.

You'll see a message like:
```
Your site is live at https://YOUR_USERNAME.github.io/gametheory/
```

### Step 6: Test Your Live Site

Visit the URL provided by GitHub Pages. Test on:
- Desktop browser
- iPhone Safari
- Android Chrome

## Updating the Site

After making changes:

```bash
# Make your changes to source files
npm run build  # Rebuild
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically redeploy within 1-2 minutes.

## Custom Domain (Optional)

If you want to use a custom domain like `gametheory.yourdomain.com`:

1. Add a `CNAME` file to `/docs` with your domain
2. Configure DNS with your domain provider:
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`
3. In GitHub Pages settings, enter your custom domain

## Troubleshooting

### Site Not Loading

- Check that `/docs` folder exists and has `index.html`
- Verify GitHub Pages is set to `/docs` folder
- Check that `.nojekyll` file exists in `/docs`
- Clear browser cache

### Assets Not Loading

- Check browser console for errors
- Verify `base` in `vite.config.ts` matches your repository name
- If using custom domain, change `base: '/'` in `vite.config.ts`

### Mobile Issues

The site is optimized for mobile, but if you encounter issues:
- Test in Chrome DevTools mobile emulator
- Check viewport meta tag in `index.html`
- Test on actual device (not just emulator)

## Performance Tips

The site is already optimized:
- Vite bundling for small files (~75KB gzipped)
- Chart.js loaded as dependency (not CDN)
- CSS is inlined
- No external font dependencies

But you can further optimize:
- Enable Cloudflare for CDN
- Add service worker for offline support
- Preload critical assets

## Alternative Deployment Options

### Netlify

```bash
npm run build
# Drag /docs folder to Netlify drop
```

### Vercel

```bash
npm run build
# Import GitHub repo to Vercel
# Set output directory to "docs"
```

### Self-Hosted

Just serve the `/docs` folder with any web server:

```bash
# Python
cd docs && python -m http.server 8000

# Node
cd docs && npx serve

# nginx, Apache, etc.
```

## Environment Variables

Currently no environment variables needed. If you add API keys or config:

1. Create `.env` file (never commit this!)
2. Use Vite's `import.meta.env` pattern
3. Set variables in GitHub Pages settings or Netlify dashboard

## Monitoring

Consider adding analytics:
- Google Analytics
- Plausible Analytics (privacy-friendly)
- Simple page view counter

Add tracking code to `index.html` before `</body>` tag.

## Security

The app is client-side only (no backend), so security concerns are minimal:
- No user data stored
- No authentication needed
- No XSS vulnerabilities (TypeScript + proper escaping)

## License

MIT License - anyone can fork and deploy their own version.
