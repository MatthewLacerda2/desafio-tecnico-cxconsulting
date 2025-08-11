# Next.js + Supabase Web Application

A modern, full-stack web application built with Next.js, TypeScript, Tailwind CSS, and Supabase. Ready for deployment on Vercel with built-in API routes.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for modern, responsive design
- **Supabase** integration for database and authentication
- **API Routes** built-in for backend functionality
- **Vercel** deployment ready
- **Responsive Design** with mobile-first approach

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- Vercel account (for deployment)

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd desafio-tecnico-cxconsulting
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Create a `users` table with the following SQL:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Create policy for authenticated insert
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (true);
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── health/        # Health check endpoint
│   │   └── users/         # Users CRUD API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── lib/                   # Utility libraries
│   └── supabase.ts        # Supabase client configuration
public/                    # Static assets
```

## 🔌 API Endpoints

### Health Check
- **GET** `/api/health` - API status check

### Users
- **GET** `/api/users` - Fetch all users
- **POST** `/api/users` - Create a new user

## 🎨 Customization

### Adding New API Routes

Create new files in `src/app/api/` following the pattern:

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello World' })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}
```

### Database Operations

Use the Supabase client in your API routes:

```typescript
import { createServerSupabaseClient } from '@/lib/supabase'

const supabase = createServerSupabaseClient()

// Query data
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert([{ column: 'value' }])
```

## 🚀 Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy!

### 3. Environment Variables on Vercel

Make sure to add your environment variables in the Vercel dashboard:
- Go to Project Settings > Environment Variables
- Add the same variables from your `.env.local` file

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 📱 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Fetch and display data from Supabase
- **Form Handling**: Create new users with validation
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: Graceful error handling and user feedback

## 🔒 Security Considerations

- Environment variables are properly configured
- Supabase Row Level Security (RLS) can be enabled
- API routes include proper error handling
- No sensitive data exposed in client-side code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [Supabase documentation](https://supabase.com/docs)
3. Check [Vercel deployment guide](https://vercel.com/docs)

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS
