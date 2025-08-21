# GetReceipts.org

A web app and API for publishing and sharing "receipts" of claims/counterclaims with sources and a Consensus Meter.

## Tech Stack

- **Frontend**: Next.js 15.5 + React 19 + TypeScript + Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI + Lucide React
- **Database**: Drizzle ORM + PostgreSQL + pgvector
- **Backend**: Supabase (Auth/Storage) + Next.js API Routes  
- **Testing**: Vitest + Testing Library
- **Validation**: Zod (RF-1 format)
- **Deployment**: Vercel

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `env.example` to `.env.local` and fill in your values:

```bash
cp env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE` - Your Supabase service role key (server-side only)
- `DATABASE_URL` - PostgreSQL connection string

### 3. Database Setup
```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Seed demo data (optional)
npm run db:seed
```

### 4. Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with demo data

## API Endpoints

- `POST /api/receipts` - Submit RF-1 formatted claims
- `GET /api/badge/[slug].svg` - Generate consensus badges
- `GET /api/claims/[slug]` - Get claim data with sources and reviews

## Pages

- `/` - Home page with trending claims
- `/submit` - Submit RF-1 formatted claims
- `/claim/[slug]` - View individual claims
- `/embed/[slug]` - Embeddable claim cards

## Supabase Setup

1. Create a new Supabase project
2. In the SQL Editor, run:
   ```sql
   create extension if not exists vector;
   ```
3. Get your project URL and keys from Settings > API
4. Add them to your `.env.local` file

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

**Important**: Never expose `SUPABASE_SERVICE_ROLE` to the client-side.

## Project Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── claim/        # Claim pages
│   ├── embed/        # Embed pages
│   └── submit/       # Submit page
├── components/ui/    # shadcn/ui components
├── db/               # Database schema
└── lib/              # Utilities and clients
```

## License

MIT License - see LICENSE file for details.
