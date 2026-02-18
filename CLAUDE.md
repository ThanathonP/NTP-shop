# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server on port 3000
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint via next lint
```

No testing framework is configured.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```

## Architecture

**Single Next.js 14 App Router application** — not a monorepo, despite the name.

**Data layer**: Supabase (PostgreSQL + Auth). All database access goes through:
- `lib/supabase/client.ts` — browser-side Supabase client
- `lib/supabase/server.ts` — server-side client (used in Server Components and API routes)
- `lib/supabase/middleware.ts` — session refresh logic

**Authentication & Authorization**:
- Supabase Auth with cookie-based sessions managed by `@supabase/ssr`
- `middleware.ts` at the root validates sessions and enforces role-based access
- `/admin/*` routes are restricted to `shop_owner` and `admin` roles
- All database tables have Row-Level Security (RLS) policies defined in `supabase/schema.sql`

**Roles**: `customer` | `shop_owner` | `admin` (stored in `profiles.role`)

**Key conventions**:
- Server Components fetch data directly; Client Components are co-located as `*Client.tsx` files (e.g., `CartClient.tsx`, `ProductsClient.tsx`)
- `lib/utils.ts` exports `cn()` (clsx + tailwind-merge), `formatPrice()` (Thai Baht), and order status maps
- All TypeScript interfaces are in `types/index.ts`
- Path alias `@/*` maps to the project root

**Styling**: Tailwind CSS with custom theme — accent color `#C8A882`, fonts Sarabun (Thai, sans) and Playfair Display (serif). Reusable component classes (`.btn-primary`, `.btn-outline`, `.btn-accent`, `.input`, `.card`) are defined in `app/globals.css`.

**Image domains** allowed in `next.config.js`: `*.supabase.co`, `images.unsplash.com`.

## Database Schema

Six tables: `profiles`, `shops`, `products`, `cart_items`, `orders`, `order_items`. Full schema with RLS policies is in `supabase/schema.sql`. A trigger automatically creates a `profiles` row on Supabase Auth signup.

Order status flow: `pending` → `confirmed` → `shipping` → `delivered` (or `cancelled`).
