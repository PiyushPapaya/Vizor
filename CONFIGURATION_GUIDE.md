# ChartForge Configuration Guide

## Critical Fixes Applied ✅

### 1. Error Handling
- ✅ Added try-catch blocks to all analytics and monitoring initialization
- ✅ App now loads gracefully even without configured API keys
- ✅ All Sentry functions wrapped with safety checks
- ✅ Console logs show when services are skipped

### 2. SEO Optimization
- ✅ Meta tags dynamically update on each page
- ✅ Open Graph and Twitter Card support
- ✅ Structured data (JSON-LD) added to all pages
- ✅ Sitemap.xml created with all routes
- ✅ Robots.txt updated with sitemap reference

### 3. Email Notification System
- ✅ 5 email templates created (welcome, export, upgrade, report, password reset)
- ✅ All templates use turquoise brand color (#2DBDAA)
- ✅ EmailQueue class for batch sending
- ⏳ Needs EmailJS configuration (see below)

---

## Required Configuration Steps

### 1. PostHog Analytics Setup

**File:** `src/lib/analytics.ts` (Line 7)

1. Sign up at https://posthog.com
2. Create a new project
3. Copy your Project API Key from Settings
4. Replace in `analytics.ts`:
   ```typescript
   const POSTHOG_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```
5. Optionally update the host URL if self-hosting

**Current Status:** Safely skipped with console message "PostHog not configured"

---

### 2. Sentry Error Monitoring Setup

**File:** `src/lib/monitoring.ts` (Line 6)

1. Sign up at https://sentry.io
2. Create a new React project
3. Copy your DSN from Project Settings
4. Replace in `monitoring.ts`:
   ```typescript
   const SENTRY_DSN = 'https://YOUR_ACTUAL_DSN@sentry.io/YOUR_PROJECT_ID';
   ```
5. Configure additional options:
   - `tracesSampleRate`: 1.0 for 100% performance tracking (0.1 for 10%)
   - `replaysSessionSampleRate`: 0.1 for 10% of sessions
   - `replaysOnErrorSampleRate`: 1.0 for 100% of error sessions

**Current Status:** Safely skipped with console message "Sentry not configured"

---

### 3. EmailJS Integration

**File:** `src/lib/email.ts` (sendEmail function)

1. Sign up at https://emailjs.com
2. Create an email service (Gmail, SendGrid, etc.)
3. Create 5 email templates in EmailJS dashboard:
   - `welcome_email`
   - `export_ready_email`
   - `upgrade_email`
   - `weekly_report_email`
   - `password_reset_email`

4. Replace the console.log in `sendEmail()` with actual EmailJS call:
   ```typescript
   import emailjs from '@emailjs/browser';
   
   export const sendEmail = async (config: EmailConfig): Promise<boolean> => {
     try {
       const result = await emailjs.send(
         'YOUR_SERVICE_ID',
         'YOUR_TEMPLATE_ID',
         {
           to_email: config.to,
           subject: config.subject,
           message: config.message,
           html_content: config.html,
         },
         'YOUR_PUBLIC_KEY'
       );
       return result.status === 200;
     } catch (error) {
       console.error('Email send failed:', error);
       return false;
     }
   };
   ```

5. Install EmailJS package:
   ```bash
   npm install @emailjs/browser
   ```

**Current Status:** Logs email attempts to console

---

## Testing Checklist

### Black Screen Fix Verification
- [ ] App loads without black screen
- [ ] Console shows "PostHog not configured" message
- [ ] Console shows "Sentry not configured" message
- [ ] No JavaScript errors in browser console

### SEO Verification
- [ ] View page source and check for meta tags with turquoise theme colors
- [ ] Verify Open Graph tags: `<meta property="og:title" content="...">`
- [ ] Verify Twitter Cards: `<meta name="twitter:card" content="summary_large_image">`
- [ ] Check JSON-LD structured data in `<script type="application/ld+json">`
- [ ] Verify sitemap at `/sitemap.xml`
- [ ] Verify robots.txt at `/robots.txt`

### Email Testing
- [ ] Check console logs when triggering email events
- [ ] Verify HTML template renders correctly
- [ ] Verify turquoise branding color (#2DBDAA) in templates

### Onboarding
- [ ] Clear localStorage: `localStorage.removeItem('chartforge-onboarding-completed')`
- [ ] Refresh app and verify 5-step tutorial appears
- [ ] Complete tutorial and verify it doesn't show again

### Mobile Responsive
- [ ] Test at 375px width (mobile)
- [ ] Test at 768px width (tablet)
- [ ] Test at 1024px width (desktop)
- [ ] Verify sidebar collapses on mobile
- [ ] Verify touch controls work

---

## Phase 2 - Next Implementation

### Pricing Page
Create `src/pages/Pricing.tsx`:
- **Free Tier**: Unlimited charts, 3 projects, basic export
- **Pro Tier**: $9/month - Unlimited projects, advanced exports, API access
- **Teams Tier**: $29/month - Collaboration, priority support, custom branding

### Stripe Integration
1. Install Stripe packages:
   ```bash
   npm install @stripe/stripe-js stripe
   ```

2. Create `src/lib/stripe.ts` for checkout flows

3. Add pricing logic to Supabase backend

### Usage Limits
1. Track project count in localStorage/Supabase
2. Show upgrade prompts when limits reached
3. Disable export for free users after 10 exports/day

---

## Deployment on Render

Your current Render configuration:
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npx serve dist -l $PORT`
- **Publish Directory**: `dist`

After completing configuration:
1. Set environment variables in Render dashboard:
   - `VITE_POSTHOG_API_KEY`
   - `VITE_SENTRY_DSN`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`

2. Update code to use environment variables:
   ```typescript
   const POSTHOG_API_KEY = import.meta.env.VITE_POSTHOG_API_KEY;
   ```

3. Redeploy on Render

---

## Summary of All Features Implemented

✅ **Landing Page**: Hero, Features, Gallery, Video Showcase, Platform Downloads, Live Demo
✅ **Legal Pages**: Privacy Policy (9 sections), Terms of Service (10 sections)
✅ **Analytics**: PostHog integration with event tracking
✅ **Error Monitoring**: Sentry integration with error capturing
✅ **SEO**: Meta tags, Open Graph, Twitter Cards, structured data, sitemap, robots.txt
✅ **Email System**: 5 templates with turquoise branding
✅ **Onboarding**: 5-step interactive tutorial
✅ **Mobile Responsive**: Optimized for all screen sizes
✅ **Color Scheme**: Turquoise/teal theme (#2DBDAA)
✅ **Error Handling**: Graceful degradation for all services

---

## Need Help?

If you encounter any issues:
1. Check browser console for error messages
2. Verify all files are saved
3. Clear browser cache and localStorage
4. Run `npm ci` to reinstall dependencies
5. Check that all imports resolve correctly

For configuration questions, refer to the official documentation:
- PostHog: https://posthog.com/docs
- Sentry: https://docs.sentry.io
- EmailJS: https://www.emailjs.com/docs
