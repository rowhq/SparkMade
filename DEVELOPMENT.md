# OriginAI Development Guide

Complete guide to setting up and running the OriginAI platform locally.

## Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database (local or hosted on Neon/Supabase)
- **Anthropic API key** (Claude)
- **Stripe account** (test mode)
- **Clerk account** (authentication)
- **Resend account** (email)
- **S3-compatible storage** (optional for file uploads)

## Quick Start

### 1. Clone and Install

```bash
# Navigate to the project
cd ai-kickstarter

# Install all dependencies
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/originai"

# Stripe (use test keys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Clerk Authentication
CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Anthropic AI
ANTHROPIC_API_KEY="sk-ant-..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Cron secret (generate random string)
CRON_SECRET="your-random-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
# Start the dev server (runs on http://localhost:3000)
npm run dev
```

## Project Structure

```
ai-kickstarter/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/               # App Router pages
│       │   ├── (marketing)/  # Marketing pages (homepage)
│       │   ├── explore/      # Browse projects
│       │   ├── product/      # Product detail pages
│       │   ├── studio/       # AI design studio
│       │   ├── dashboard/    # User dashboards
│       │   └── api/          # API routes
│       ├── components/       # React components
│       │   ├── ui/          # shadcn/ui components
│       │   └── brand/       # Brand components (Nav, Footer)
│       └── lib/             # Utilities
│           ├── ai.ts        # AI integration
│           ├── stripe.ts    # Payment handling
│           ├── email.ts     # Email sending
│           └── prisma.ts    # Database client
│
├── packages/
│   ├── db/                   # Prisma schema and migrations
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts
│   ├── contracts/            # Shared TypeScript types
│   ├── config/              # Configuration
│   │   ├── prompts/         # AI system prompts
│   │   └── rules/           # Business rules
│   └── emails/              # Email templates
│
└── turbo.json              # Turborepo config
```

## Key Workflows

### Creating a Project Draft with AI

1. User describes idea in `/studio`
2. POST to `/api/ai/projects/draft` with `{ text: "..." }`
3. AI generates:
   - ProductBrief JSON
   - Render image prompt
   - Listing copy
   - Funding suggestions
4. Project created with status `DRAFT`

### Placing a Deposit

1. User views project at `/product/[id]`
2. Clicks "Reserve with deposit"
3. POST to `/api/projects/[id]/pledges`
4. Creates Stripe Payment Intent
5. Pledge record created with status `PENDING`
6. User completes Stripe checkout
7. Pledge updated to `HELD`

### Auto-Refunds (Cron)

1. Cron job calls `/api/cron/deadline-check` daily
2. Finds all `LIVE` projects past `deadlineAt`
3. Refunds all `HELD` pledges via Stripe
4. Updates pledges to `REFUNDED`
5. Updates project to `CANCELED`
6. Sends refund emails to backers

## Database

### Models

- **User** - Platform users (Backers, Creators, Manufacturers, Admins)
- **Project** - Product ideas/campaigns
- **Pledge** - Deposit reservations
- **Manufacturer** - Manufacturing partners
- **Quote** - Manufacturing quotes
- **Milestone** - Production milestones
- **Transaction** - Financial transactions
- **ComplianceCheck** - Safety/compliance records
- **Comment** - Project Q&A
- **Update** - Project updates

### Database Commands

```bash
# View database in browser
npm run db:studio

# Create a new migration
npm run db:migrate

# Reset database (WARNING: destroys all data)
npx prisma migrate reset

# Re-seed database
npm run db:seed
```

## API Routes

### AI Routes
- `POST /api/ai/projects/draft` - Create AI-powered draft

### Project Routes
- `GET /api/projects` - List projects
- `GET /api/projects/[id]` - Get project details
- `POST /api/projects/[id]/pledges` - Create deposit

### Auth Routes
- `POST /api/auth/webhook` - Clerk user sync webhook

### Cron Routes
- `POST /api/cron/deadline-check` - Auto-refund missed deadlines

## Testing

### Test Accounts

After seeding, you'll have:
- **Admin**: admin@originai.com
- **Creator**: creator@example.com
- **Backer**: backer@example.com

### Test Stripe Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

Expiry: Any future date
CVC: Any 3 digits

## Webhooks

### Clerk Webhook (User Sync)

1. In Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/auth/webhook`
3. Subscribe to: `user.created`, `user.updated`
4. Copy signing secret to `CLERK_WEBHOOK_SECRET`

### Stripe Webhook (Payments)

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database (Neon or Supabase)

1. Create PostgreSQL database
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `npm run db:migrate`
4. Seed: `npm run db:seed`

### Cron Jobs (Vercel Cron)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/deadline-check",
      "schedule": "0 0 * * *"
    }
  ]
}
```

## Troubleshooting

### "Module not found" errors

```bash
# Regenerate Prisma client
npm run db:generate

# Clear Next.js cache
rm -rf apps/web/.next

# Reinstall dependencies
npm install
```

### Database connection issues

```bash
# Test connection
npx prisma db pull

# Reset and re-migrate
npx prisma migrate reset
```

### AI calls failing

- Check `ANTHROPIC_API_KEY` is set correctly
- Verify you have credits in your Anthropic account
- Check prompt files exist in `packages/config/prompts/`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (test) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key (public) |
| `CLERK_WEBHOOK_SECRET` | Yes | Clerk webhook signing secret |
| `RESEND_API_KEY` | Yes | Resend email API key |
| `CRON_SECRET` | Yes | Secret for cron endpoints |
| `NEXT_PUBLIC_APP_URL` | Yes | App URL |
| `STORAGE_BUCKET_URL` | No | S3 bucket URL |
| `STORAGE_ACCESS_KEY` | No | S3 access key |
| `STORAGE_SECRET_KEY` | No | S3 secret key |

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Anthropic Documentation](https://docs.anthropic.com)
- [shadcn/ui](https://ui.shadcn.com)

## Support

For issues and questions, please refer to the README or open an issue in the repository.
