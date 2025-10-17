# OriginAI

**The product is the strategy.**

OriginAI is a next-generation crowdfunding platform that helps anyone turn product ideas into reality using AI-powered design assistance and smart manufacturing workflows.

## Features

- **AI-Powered Design Studio**: Describe your idea in plain English, get a complete product brief with renders in under 60 seconds
- **Refundable Deposits**: Backers reserve products with deposits automatically refunded if goals aren't met
- **Smart Manufacturing**: Auto-matched with manufacturers, milestone-based fund releases
- **Compliance First**: Built-in safety checks and category restrictions
- **Apple-Inspired Design**: Clean, accessible, and delightful to use

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Clerk (email + OAuth, KYC via Stripe Identity)
- **Payments**: Stripe (Payment Intents, Connect, escrow)
- **AI**: Anthropic Claude for all reasoning and generation
- **Storage**: S3-compatible (Supabase/R2/AWS)
- **Email**: Resend
- **Hosting**: Vercel + Neon/Supabase

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account
- Clerk account
- Anthropic API key
- S3-compatible storage
- Resend account

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd ai-kickstarter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. Set up the database:
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
originai/
├── apps/
│   └── web/                 # Next.js application
│       ├── app/            # App Router pages
│       ├── components/     # React components
│       └── lib/           # Utilities and integrations
├── packages/
│   ├── db/                # Prisma schema and migrations
│   ├── contracts/         # Shared TypeScript types
│   ├── config/           # AI prompts and rules
│   └── emails/           # Email templates
└── turbo.json           # Turborepo configuration
```

## Key Workflows

### For Creators

1. **Draft**: Describe product idea → AI generates brief, render, specs
2. **Refine**: Iterate with AI assistant ("make it smaller", "use bamboo", etc.)
3. **Submit**: Finalize for admin review
4. **Launch**: Once approved, collect deposits from backers
5. **Produce**: When threshold is met, design locks and production begins

### For Backers

1. **Explore**: Browse live projects with filters
2. **Reserve**: Place refundable deposit
3. **Track**: Monitor progress through milestones
4. **Receive**: Get product when production completes

### For Manufacturers

1. **Onboard**: Register capabilities and certifications
2. **Quote**: Submit quotes for matched projects
3. **Produce**: Deliver milestones with evidence
4. **Get Paid**: Receive staged payments as milestones are approved

## Database Schema

See `packages/db/prisma/schema.prisma` for the complete schema including:

- **Users** (with roles: Visitor, Backer, Creator, Manufacturer, Admin)
- **Projects** (lifecycle: Draft → Review → Live → Locked → Producing → Fulfilled)
- **Pledges** (escrow-held deposits)
- **Manufacturers** & **Quotes**
- **Milestones** (staged fund releases)
- **Compliance checks**

## AI Prompts

All AI prompts are stored in `packages/config/prompts/`:

- `idea_to_brief.system.txt` - Convert user text to ProductBrief JSON
- `brief_to_render.system.txt` - Generate image prompts
- `brief_to_spec.system.txt` - Create manufacturing specs
- `manufacturability.system.txt` - DFM analysis
- `copy_writer.system.txt` - Generate listing copy
- `funding_suggest.system.txt` - Suggest deposit/threshold
- `canvas_runtime.system.txt` - Studio assistant behavior

## API Routes

- `POST /api/ai/projects/draft` - Start new AI-powered draft
- `POST /api/ai/projects/[id]/iterate` - Iterate on design
- `POST /api/projects/[id]/pledges` - Create deposit
- `POST /api/cron/deadline-check` - Auto-refund missed deadlines

See full API documentation in the spec.

## Compliance & Safety

- Banned categories include weapons, hazardous materials, medical devices, etc.
- All projects screened before going live
- KYC required for creators via Stripe Identity
- Age verification (13+)

## Deployment

Recommended stack:

- **Web**: Vercel
- **Database**: Neon or Supabase PostgreSQL
- **Cron**: Vercel Cron (for auto-refunds)
- **Monitoring**: Sentry

## License

Proprietary - All rights reserved

## Support

For issues and questions, please contact support.
