# Biochemical Safety - Base44 App

A modern web application for biochemical safety services built with React, Vite, Base44, and deployed on Vercel.

## 🚀 Deployment Setup

This repository is configured for automated deployment through GitHub → Vercel, with Base44 as the primary backend and optional Supabase integration.

### Prerequisites

1. **GitHub Account** - Repository: `davidbinneun/biochemsafety`
2. **Vercel Account** - For hosting and deployment
3. **Base44 Account** - Get your app credentials from [Base44 Dashboard](https://base44.com)
4. **Supabase Account** (Optional) - For additional backend features

## 📋 Step-by-Step Deployment Guide

### 1. Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Setup for deployment"

# Add remote and push
git remote add origin https://github.com/davidbinneun/biochemsafety.git
git branch -M main
git push -u origin main
```

### 2. Configure Base44

1. Log in to your [Base44 Dashboard](https://base44.com)
2. Create a new app or use an existing one
3. Note down:
   - `App ID`
   - `Backend URL` (usually `https://api.base44.com`)
   - `Functions Version` (usually `v1`)

### 3. Set Up Vercel

#### Option A: Using Vercel Dashboard (Recommended for first-time setup)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import the `davidbinneun/biochemsafety` repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `VITE_BASE44_APP_ID` - Your Base44 App ID
   - `VITE_BASE44_BACKEND_URL` - Your Base44 backend URL
   - `VITE_BASE44_FUNCTIONS_VERSION` - Your Base44 functions version
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

### 4. Configure GitHub Actions (For Automatic Deployments)

1. Go to your GitHub repository settings
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

   **Required Secrets:**
   - `VERCEL_TOKEN` - Get from [Vercel Account Tokens](https://vercel.com/account/tokens)
   - `VERCEL_PROJECT_ID` - Find in Vercel project settings
   - `VERCEL_ORG_ID` - Find in Vercel project settings
   - `VITE_BASE44_APP_ID` - Your Base44 App ID
   - `VITE_BASE44_BACKEND_URL` - Your Base44 backend URL
   - `VITE_BASE44_FUNCTIONS_VERSION` - Your Base44 functions version

4. Push to `main` branch to trigger automatic deployment

### 5. Configure Supabase (Optional)

If you want to use Supabase for additional backend features:

1. Create a new project on [Supabase](https://supabase.com)
2. Go to **Project Settings** → **API**
3. Note down:
   - `Project URL`
   - `anon/public key`
   - `service_role key` (keep this secret!)

4. Run the initialization SQL:

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

5. Add Supabase environment variables to Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

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

4. Update `.env` with your credentials:
```env
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_BACKEND_URL=https://api.base44.com
VITE_BASE44_FUNCTIONS_VERSION=v1
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
│   ├── api/                    # Base44 API integration
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

### Required (Base44)
- `VITE_BASE44_APP_ID` - Your Base44 application ID
- `VITE_BASE44_BACKEND_URL` - Base44 backend URL (usually `https://api.base44.com`)
- `VITE_BASE44_FUNCTIONS_VERSION` - API version (usually `v1`)

### Optional (Supabase)
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional (Build Configuration)
- `BASE44_LEGACY_SDK_IMPORTS` - Enable legacy SDK imports (`true`/`false`)

## 🚦 Deployment Status

Once deployed, your application will be available at:
- **Production**: `https://biochemsafety.vercel.app` (or your custom domain)
- **GitHub**: `https://github.com/davidbinneun/biochemsafety`

## 📚 Documentation

- [Base44 Documentation](https://docs.base44.com)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)

## 🐛 Troubleshooting

### Build Failures

If the build fails on Vercel:
1. Check that all environment variables are set correctly
2. Verify the build command is `npm run build`
3. Ensure output directory is set to `dist`
4. Check Vercel build logs for specific errors

### Base44 Connection Issues

1. Verify your `VITE_BASE44_APP_ID` is correct
2. Check that `VITE_BASE44_BACKEND_URL` is accessible
3. Ensure you're using the correct `VITE_BASE44_FUNCTIONS_VERSION`

### GitHub Actions Failures

1. Verify all GitHub secrets are set correctly
2. Check that `VERCEL_TOKEN` has the necessary permissions
3. Review the Actions logs in your GitHub repository

## 📝 License

This project is created with Base44.

## 🤝 Support

For issues or questions:
- Base44: [Base44 Support](https://base44.com/support)
- Vercel: [Vercel Support](https://vercel.com/support)
- GitHub Issues: Create an issue in this repository
