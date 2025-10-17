# OriginAI - Quick Start Guide

Get the OriginAI platform running in 5 minutes.

## What You've Built

OriginAI is a complete AI-powered crowdfunding platform with:

✅ **AI Design Studio** - Turn product ideas into complete designs using Claude
✅ **Smart Crowdfunding** - Refundable deposits with auto-refunds
✅ **Stripe Integration** - Secure payments and escrow
✅ **Role-Based Access** - Backers, Creators, Manufacturers, Admins
✅ **Email Notifications** - Automated emails for deposits, refunds, updates
✅ **Apple-Inspired Design** - Clean, polished UI with Framer Motion
✅ **Manufacturing Workflow** - Milestone tracking and staged fund releases
✅ **Compliance Engine** - Category restrictions and safety checks

## Get Started in 3 Steps

### 1. Install Dependencies

```bash
cd ai-kickstarter
npm install
```

### 2. Configure Environment

Create `.env` file in the root:

```env
DATABASE_URL="postgresql://localhost:5432/originai"
ANTHROPIC_API_KEY="sk-ant-your-key"
STRIPE_SECRET_KEY="sk_test_your-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-key"
CLERK_PUBLISHABLE_KEY="pk_test_your-key"
CLERK_SECRET_KEY="sk_test_your-key"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your-key"
RESEND_API_KEY="re_your-key"
CRON_SECRET="random-secret-string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Minimum Required Keys:**
- Anthropic API key (get from console.anthropic.com)
- Clerk keys (get from dashboard.clerk.com)
- PostgreSQL database

### 3. Set Up Database & Run

```bash
# Generate Prisma client
npm run db:generate

# Create database schema
npm run db:push

# Seed with sample data
npm run db:seed

# Start development server
npm run dev
```

Visit **http://localhost:3000**

## Test the Platform

### Sample Projects

After seeding, you'll see 3 sample projects:
1. Eco-Friendly Desk Organizer
2. Modular Cable Management System
3. Collapsible Water Bottle

### Test Accounts

- **Admin**: admin@originai.com
- **Creator**: creator@example.com
- **Backer**: backer@example.com

### Try These Workflows

**1. Browse Projects**
→ Visit `/explore` to see live projects

**2. View Product Details**
→ Click any project card to see full details

**3. AI Studio (Coming Soon)**
→ Visit `/studio` to see the AI design interface

## Core Features

### For Creators

1. **Describe product idea** → AI generates complete design
2. **Review & refine** → Iterate with AI assistant
3. **Submit for review** → Admin approval
4. **Go live** → Collect deposits from backers
5. **Hit threshold** → Design locks, production starts

### For Backers

1. **Browse projects** → Filter by category
2. **Place deposit** → Fully refundable if goal not met
3. **Track progress** → Milestones and updates
4. **Get product** → When production completes

### Auto-Refunds

- Cron job checks deadlines daily
- Projects that miss goals auto-refund all backers
- Email notifications sent automatically

## Project Structure

```
apps/web/          # Next.js application
  app/             # Pages (App Router)
  components/      # React components
  lib/             # Core utilities (AI, Stripe, Email)

packages/
  db/              # Prisma schema & migrations
  config/          # AI prompts & rules
  contracts/       # Shared types
```

## Key Technologies

- **Next.js 14** - React framework with App Router
- **Prisma** - Type-safe database ORM
- **Anthropic Claude** - AI reasoning and generation
- **Stripe** - Payments and escrow
- **Clerk** - Authentication
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling

## What's Included

### AI Prompts (7 total)
- `idea_to_brief` - Convert text to ProductBrief
- `brief_to_render` - Generate image prompts
- `brief_to_spec` - Create manufacturing specs
- `manufacturability` - DFM analysis
- `copy_writer` - Marketing copy
- `funding_suggest` - Pricing recommendations
- `canvas_runtime` - Studio assistant

### API Routes
- `POST /api/ai/projects/draft` - Create AI draft
- `POST /api/projects/[id]/pledges` - Place deposit
- `POST /api/cron/deadline-check` - Auto-refunds
- `POST /api/auth/webhook` - User sync

### Database Schema
- Users (with roles)
- Projects (full lifecycle)
- Pledges (escrow system)
- Manufacturers & Quotes
- Milestones (staged releases)
- Compliance checks

## Next Steps

1. **Get API Keys** - Sign up for Anthropic, Clerk, Stripe, Resend
2. **Configure Webhooks** - Set up Clerk and Stripe webhooks
3. **Customize Prompts** - Edit prompts in `packages/config/prompts/`
4. **Add Categories** - Update safe categories for MVP
5. **Deploy** - Push to Vercel with Neon/Supabase PostgreSQL

## Full Documentation

- **DEVELOPMENT.md** - Complete setup guide
- **README.md** - Project overview
- **Spec** - Full requirements (see original spec)

## Need Help?

Check DEVELOPMENT.md for:
- Detailed setup instructions
- Troubleshooting guide
- Webhook configuration
- Deployment instructions

---

**The product is the strategy.**
Built with Claude Code.
