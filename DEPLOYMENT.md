# Deployment Guide

## Deploying to Vercel

### Prerequisites
1. A Vercel account connected to your GitHub
2. A PostgreSQL database (we recommend [Neon](https://neon.tech) or [Supabase](https://supabase.com))
3. An Anthropic API key

### Step 1: Set Up Database

1. Create a PostgreSQL database on your preferred provider
2. Get your `DATABASE_URL` connection string (it should look like: `postgresql://user:password@host:5432/database`)

### Step 2: Configure Environment Variables

In your Vercel project settings, add the following environment variables:

#### Required Variables:
```
DATABASE_URL=postgresql://user:password@host:5432/database
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Optional Variables (for full functionality):
```
# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Clerk (for authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Resend (for emails)
RESEND_API_KEY=re_...
```

### Step 3: Run Database Migrations

After deploying, you need to set up your database schema. You can do this in two ways:

#### Option A: Using Vercel CLI locally
```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull

# Run migrations
npm run db:push

# Seed the database with demo data
npm run db:seed
```

#### Option B: Add a build step
The database will be automatically set up during the first deployment if you have `DATABASE_URL` configured.

### Step 4: Deploy

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Import your GitHub repository `rowhq/SparkMade`

2. **Configure Build Settings**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build --filter=@originai/web`
   - Output Directory: `apps/web/.next`
   - Install Command: `npm install`

3. **Deploy**: Click "Deploy" and Vercel will build and deploy your application

### Step 5: Post-Deployment Setup

After your first deployment:

1. Run the database migrations (see Step 3)
2. Test the application by visiting your Vercel URL
3. Try creating a project in the Studio to verify AI integration works

## Troubleshooting

### Build Fails with Database Error
**Solution**: Make sure `DATABASE_URL` is set in Vercel environment variables

### AI Generation Doesn't Work
**Solution**: Verify `ANTHROPIC_API_KEY` is correctly set and starts with `sk-ant-api03-`

### 404 on Project Pages
**Solution**: Run `npm run db:seed` to populate the database with demo projects

### Turborepo Build Issues
**Solution**: Ensure the build command includes the filter: `npm run build --filter=@originai/web`

## Database Providers

### Recommended: Neon (Best for Vercel)
- Free tier available
- Serverless PostgreSQL
- Auto-scaling
- [Sign up here](https://neon.tech)

### Alternative: Supabase
- Free tier with 500MB database
- PostgreSQL with additional features
- [Sign up here](https://supabase.com)

### Alternative: Railway
- Free tier available
- Simple PostgreSQL setup
- [Sign up here](https://railway.app)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | ✅ Yes | Claude AI API key |
| `NEXT_PUBLIC_APP_URL` | ✅ Yes | Your application URL |
| `STRIPE_SECRET_KEY` | ⚠️ For payments | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ⚠️ For payments | Stripe publishable key |
| `CLERK_SECRET_KEY` | ⚠️ For auth | Clerk secret key |
| `RESEND_API_KEY` | ⚠️ For emails | Resend API key |

## Production Checklist

- [ ] Set all required environment variables
- [ ] Run database migrations
- [ ] Seed database with demo data (optional)
- [ ] Test project creation with AI
- [ ] Verify all pages load correctly
- [ ] Check contribution flow works
- [ ] Test responsive design on mobile
- [ ] Set up custom domain (optional)
- [ ] Configure CORS if needed
- [ ] Set up monitoring/analytics

## Need Help?

- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Open an issue on GitHub

---

Generated with Claude Code
