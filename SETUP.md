# Polling App Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account and project

## Environment Variables
Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key
```

## Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL script to create the necessary tables and policies

## Installation
```bash
npm install
```

## Development
```bash
npm run dev
```

## Project Structure
- `/app` - Next.js App Router pages and routes
- `/components` - Reusable UI components
  - `/ui` - shadcn/ui components
  - `/polls` - Poll-specific components
  - `/shared` - Shared components like navigation
- `/lib` - Utility functions and Server Actions
- `/database-schema.sql` - Database setup script

## Key Features
- **Server Components**: Pages use Server Components for data fetching
- **Server Actions**: Form submissions use Server Actions instead of API routes
- **Supabase Integration**: Direct database access from Server Actions
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern styling with shadcn/ui components

## Architecture Notes
- The app follows Next.js 13+ App Router patterns
- Server Actions handle all data mutations (creating polls, voting)
- Client Components are only used when interactivity is required
- Database queries happen directly in Server Actions using Supabase client
