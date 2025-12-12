# Performance Optimization - Quick Reference

## 🚀 Quick Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Start Production Server
npm start

# Analyze Bundle Size
npm run analyze
```

## 📊 What Was Optimized

### Images
- ✅ AVIF & WebP formats
- ✅ Responsive sizing
- ✅ 1-year caching
- ✅ Sanity CDN in production

### Caching
- ✅ Static assets: 1 year
- ✅ API responses: 60s with stale-while-revalidate
- ✅ Products: 5 minutes
- ✅ Projects: 10 minutes

### Code
- ✅ React Compiler enabled
- ✅ Dynamic imports for heavy components
- ✅ Package import optimization
- ✅ Compression enabled

### CSS
- ✅ GPU acceleration
- ✅ CSS containment
- ✅ Reduced motion support

### Network
- ✅ Preconnect to external domains
- ✅ DNS prefetch
- ✅ Resource hints

## 🎯 Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| FCP | < 1.8s |
| TTFB | < 800ms |

## 🔍 How to Test

### 1. Lighthouse (Recommended)
```bash
npm run build
npm start
# Open Chrome DevTools > Lighthouse > Run Audit
```

### 2. Bundle Analysis
```bash
npm run analyze
# Opens interactive bundle visualizer
```

### 3. Web Vitals
- Check browser console in development
- Metrics logged on page load

## 📁 Key Files Modified

1. `next.config.ts` - Build & caching config
2. `lib/products.ts` - Sanity client optimization
3. `app/globals.css` - CSS performance
4. `components/ResourceHints.tsx` - Network optimization
5. `app/layout.tsx` - Resource hints integration
6. `app/page.tsx` - Revalidation timing

## 💡 Tips

- Run `npm run analyze` before and after major changes
- Monitor Web Vitals in production
- Use Lighthouse for comprehensive audits
- Check bundle size regularly

## 🐛 Troubleshooting

**Build fails?**
```bash
rm -rf .next
npm install
npm run build
```

**Slow images?**
- Verify using Next.js Image component
- Check Sanity CDN is enabled
- Review image sizes

**Large bundle?**
```bash
npm run analyze
# Look for large packages
# Consider lazy loading
```

## 📚 Documentation

- Full details: `PERFORMANCE_OPTIMIZATION.md`
- Summary: `PERFORMANCE_SUMMARY.md`
- This guide: `PERFORMANCE_QUICK_REFERENCE.md`
