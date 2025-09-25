# AV-Polly - Polling App with QR Code Sharing

A modern web application that allows users to create polls and share them via unique links and QR codes for easy voting access. Built with Next.js, Supabase, and TypeScript.

## 🚀 Project Overview

AV-Polly is a full-stack polling application that enables users to:
- Register and authenticate securely
- Create custom polls with multiple options
- Share polls via unique links and QR codes
- Vote on polls in real-time
- View poll results and analytics
- Manage polls through a user dashboard

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Server Components + React hooks for client state
- **QR Code Generation**: qrcode.react
- **Testing**: Jest with React Testing Library

## 📋 Prerequisites

Before setting up the project, ensure you have:
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- A Supabase account and project

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd av-polly
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Supabase Configuration

1. Create a new project in [Supabase](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Set up the database schema by running the SQL in `database-schema.sql`
4. Configure Row Level Security (RLS) policies for your tables

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 5. Database Setup

Run the database schema setup:

```bash
# Apply the database schema
psql -h your_supabase_host -U postgres -d postgres -f database-schema.sql
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
npm start
```

## 📖 Usage Examples

### Creating a Poll

1. **Register/Login**: Create an account or sign in
2. **Navigate to Dashboard**: Go to `/polls` to view your polls
3. **Create New Poll**: Click "Create Poll" button
4. **Fill Poll Details**:
   - Enter poll title and description
   - Add poll options (minimum 2 required)
   - Set poll settings (duration, visibility)
5. **Publish**: Save and publish your poll
6. **Share**: Use the generated link or QR code to share

### Voting on a Poll

1. **Access Poll**: Click on a shared poll link or scan QR code
2. **View Options**: Review all available poll options
3. **Cast Vote**: Select your preferred option and submit
4. **View Results**: See real-time poll results (if enabled)

### Managing Polls

- **Edit Poll**: Modify poll details before voting begins
- **Delete Poll**: Remove polls from your dashboard
- **View Analytics**: Check vote counts and participant data
- **Export Results**: Download poll results as CSV

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API routes and database interactions
- **E2E Tests**: Full user workflow testing

## 📁 Project Structure

```
av-polly/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── polls/             # Poll-related pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── polls/            # Poll-specific components
│   ├── shared/           # Shared UI components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions and configurations
│   ├── actions.ts        # Server actions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper utilities
├── __tests__/            # Test files
└── public/               # Static assets
```

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow Next.js App Router patterns
- Prefer Server Components for data fetching
- Use Server Actions for mutations
- Implement proper error handling

### Component Patterns

- **Server Components**: For data fetching and static content
- **Client Components**: For interactive features (use `'use client'`)
- **Form Handling**: Use Server Actions with form submissions
- **State Management**: React hooks for local state, Server Components for server state

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed on any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

---

**Built with ❤️ using Next.js and Supabase**
