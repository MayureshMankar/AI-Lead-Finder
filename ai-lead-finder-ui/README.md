This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.






Complete User Navigation Flow
1. Landing Page (Home) - /
User arrives at the home page
Options:
"Start Free Trial" → /signup (if not logged in) or /dashboard (if logged in)
"See Demo" → /demo (new interactive demo page)
"Login" → /login
"Get Started" → /signup
"View All Plans" → /pricing
2. Pricing Page - /pricing
User can view pricing plans
Options:
"Start Free Today" → /signup (if not logged in) or /dashboard (if logged in)
"Contact Sales" → /contact (new contact page - no more 404!)
"View All Plans" → stays on pricing page
3. Demo Page - /demo
Interactive demo showcasing features
Options:
"Start Free Trial" → /signup (if not logged in) or /dashboard (if logged in)
"View Pricing" → /pricing
"Go to Dashboard" → /dashboard (if logged in)
4. Contact Page - /contact
Professional contact form for sales inquiries
Features:
Contact form with inquiry types
Quick contact information
Response times
Office hours
Links to Help Center and Discord
5. Authentication Flow
Signup → /signup → redirects to /dashboard after successful registration
Login → /login → redirects to /dashboard after successful login
Protected Routes → All dashboard pages require authentication
6. Dashboard Flow (After Login)
Dashboard → /dashboard (main hub)
Search Jobs → /search (unified search)
Scrape & Outreach → /scrape (bulk operations)
Leads → /leads (lead management)
Analytics → /analytics (insights and metrics)
Settings → /settings (user preferences)
Profile → /profile (user profile)
7. Support & Legal Pages
Help & Support → /help (FAQ and support)
Terms of Service → /terms
Privacy Policy → /privacy
System Status → /health
8. Error Handling
404 Page → /not-found (custom error page with helpful links)