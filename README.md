# Project Halo - Exam Generator

A modern, AI-powered exam generator built with Next.js, TypeScript, and Supabase. Create professional exam papers with drag-and-drop functionality and export to PDF.

## Features

- 🎯 **Smart Question Management**: Filter and organize questions by class, subject, topic, and type
- 📝 **Drag & Drop Interface**: Intuitive question paper building with reorderable sections
- 📄 **PDF Export**: Professional exam paper generation with custom formatting
- 🎨 **Modern UI**: High-contrast dark theme with responsive design
- 🔧 **Question Editing**: In-place editing of questions with support for multiple question types
- 📊 **Real-time Preview**: Live preview of your exam paper as you build it
- 🗄️ **Supabase Integration**: Real-time database with built-in authentication and API

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: jsPDF
- **Drag & Drop**: @dnd-kit
- **Deployment**: Vercel

## Deployment on Vercel with Supabase

### Prerequisites

1. **Supabase Account**: Sign up at [Supabase](https://supabase.com)
2. **Vercel Account**: Sign up at [Vercel](https://vercel.com)
3. **GitHub Repository**: Push your code to GitHub

### Step 1: Set up Supabase

1. **Create a new project**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose your organization and enter project details
   - Wait for the project to be created (usually takes 1-2 minutes)

2. **Get your credentials**:
   - Go to Settings > API
   - Copy your Project URL (looks like: `https://your-project-ref.supabase.co`)
   - Copy your anon/public key (starts with `eyJ...`)

3. **Set up the database schema**:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Paste it into the SQL Editor and click "Run"
   - This will create the questions table and insert sample data

### Step 2: Deploy to Vercel

1. **Import Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   - In your Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

3. **Deploy**:
   - Click "Deploy" and wait for the build to complete
   - Your app will be available at `https://your-project-name.vercel.app`

### Step 3: Initialize Database (Optional)

If you want to add more sample questions, visit: `https://your-project-name.vercel.app/api/init-db`

This will insert additional sample questions into your Supabase database.

## Local Development

### Prerequisites

- Node.js 18+ 
- Supabase account

### Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd project-halo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up the database**:
   - Go to your Supabase project's SQL Editor
   - Run the `supabase/schema.sql` file to create tables and sample data

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Initialize additional data (optional)**:
   Visit `http://localhost:3000/api/init-db` to add more sample questions

## Supabase Schema

The database uses a single `questions` table with the following structure:

```sql
CREATE TABLE questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id TEXT UNIQUE NOT NULL,
    question_text TEXT NOT NULL,
    question_answer TEXT,
    default_marks INTEGER DEFAULT 1,
    class TEXT,
    topic TEXT,
    subject TEXT,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'fill_in_blanks', 'match_pairs', 'short_answer')),
    options JSONB,
    correct_option_id TEXT,
    left_items TEXT[],
    right_items TEXT[],
    blanks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Question Types Supported:

1. **Multiple Choice**: Questions with options A, B, C, D
2. **Fill in Blanks**: Questions with blank spaces to fill
3. **Match Pairs**: Questions with left and right items to match
4. **Short Answer**: Open-ended text questions

## Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── questions/       # Questions API
│   │   └── init-db/         # Database initialization
│   ├── create/              # Main exam creation page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── create/              # Exam creation components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   └── utils.ts             # Utility functions
├── supabase/
│   └── schema.sql           # Database schema
├── public/                  # Static assets
└── types/                   # TypeScript type definitions
```

## API Endpoints

- `GET /api/questions` - Fetch all questions and filter options
- `POST /api/init-db` - Initialize database with sample data

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_APP_URL` | App URL for production | No |

## Supabase Features Used

- **PostgreSQL Database**: Reliable, scalable database
- **Row Level Security**: Built-in security policies
- **Real-time Subscriptions**: Live data updates
- **Auto-generated APIs**: REST and GraphQL APIs
- **Built-in Authentication**: User management (ready for future use)
- **Dashboard**: Easy database management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the GitHub repository.