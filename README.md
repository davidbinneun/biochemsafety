# Biochemical Safety

A modern web application for biochemical safety services built with React, Vite, Supabase, and deployed on Vercel.

## 🚀 Deployment Setup

This repository is configured for automated deployment through GitHub → Vercel with Supabase as the backend database.

### Prerequisites

1. **GitHub Account** - Repository: `davidbinneun/biochemsafety`
2. **Vercel Account** - For hosting and deployment
3. **Supabase Account** - For backend database and authentication

## 📋 Step-by-Step Deployment Guide

### 1. Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to **Project Settings** → **API**
3. Note down:
   - **Project URL** (`VITE_SUPABASE_URL`)
   - **anon/public key** (`VITE_SUPABASE_ANON_KEY`)
   - **service_role key** (keep this secret!)

4. Initialize the database schema:

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push the schema
supabase db push --file supabase/init.sql
```

Alternatively, you can copy the contents of `supabase/init.sql` and run it in the Supabase SQL Editor.

### 2. Set Up Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import the `davidbinneun/biochemsafety` repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Configure GitHub Actions (For Automatic Deployments)

1. Go to your GitHub repository settings
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

   **Required Secrets:**
   - `VERCEL_TOKEN` - Get from [Vercel Account Tokens](https://vercel.com/account/tokens)
   - `VERCEL_PROJECT_ID` - Find in Vercel project settings
   - `VERCEL_ORG_ID` - Find in Vercel project settings
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

4. Push to `main` branch to trigger automatic deployment

## 🛠️ Local Development

### Setup

1. Clone the repository:
```bash
git clone https://github.com/davidbinneun/biochemsafety.git
cd biochemsafety
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 📁 Project Structure

```
biochemsafety/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── api/                    # API integration
│   ├── components/             # React components
│   ├── pages/                  # Page components
│   ├── lib/                    # Utilities and helpers
│   └── main.jsx                # Application entry point
├── supabase/
│   └── init.sql                # Database schema
├── .env.example                # Environment variables template
├── vercel.json                 # Vercel configuration
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies and scripts
```

## 🔐 Environment Variables

### Required
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

### Optional (Server-side only)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

- **profiles** - User profiles (extends auth.users)
- **services** - Biochemical safety services
- **contact_inquiries** - Contact form submissions

The full schema is available in [supabase/init.sql](supabase/init.sql) with Row Level Security (RLS) policies enabled.

## 🚦 Deployment Status

Once deployed, your application will be available at:
- **Production**: `https://biochemsafety.vercel.app` (or your custom domain)
- **GitHub**: `https://github.com/davidbinneun/biochemsafety`

## 📚 Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)

## 🐛 Troubleshooting

### Build Failures

If the build fails on Vercel:
1. Check that all environment variables are set correctly
2. Verify the build command is `npm run build`
3. Ensure output directory is set to `dist`
4. Check Vercel build logs for specific errors

### Supabase Connection Issues

1. Verify your `VITE_SUPABASE_URL` is correct and accessible
2. Check that `VITE_SUPABASE_ANON_KEY` matches your project
3. Ensure your Supabase project is active and not paused
4. Check RLS policies if you're having permission issues

### GitHub Actions Failures

1. Verify all GitHub secrets are set correctly
2. Check that `VERCEL_TOKEN` has the necessary permissions
3. Ensure Supabase environment variables are added to secrets
4. Review the Actions logs in your GitHub repository

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret - it bypasses RLS policies
- Use Row Level Security (RLS) policies to protect your data
- The `VITE_SUPABASE_ANON_KEY` is safe to expose in the frontend

## 📝 License

This project is created for biochemical safety services.

## 🤝 Support

For issues or questions:
- Supabase: [Supabase Support](https://supabase.com/support)
- Vercel: [Vercel Support](https://vercel.com/support)
- GitHub Issues: Create an issue in this repository
