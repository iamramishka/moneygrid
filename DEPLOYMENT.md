# MoneyGrid - Deployment Guide

## 🚀 Live Deployment

This MoneyGrid application is configured for deployment on:
- **Frontend**: GitHub Pages (Free)
- **Database**: Firebase (Free tier)
- **Authentication**: Firebase Auth

## 📋 Prerequisites

1. **GitHub Repository**: Make sure your code is pushed to a GitHub repository
2. **Firebase Project**: Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
3. **Node.js**: Version 20 or later

## 🔧 Setup Instructions

### Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - Enable Anonymous authentication (if needed)
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules as needed
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the Firebase config object

### Step 2: Environment Variables Setup

1. Create a `.env.local` file in the project root (for local development)
2. Add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 3: GitHub Pages Setup

1. Push your code to GitHub repository
2. Go to your repository settings
3. Navigate to "Pages" section
4. Under "Source", select "GitHub Actions"
5. The deployment will trigger automatically on push to main branch

### Step 4: Custom Domain (Optional)

If you want to use a custom domain:
1. Add a `CNAME` file to the `public` directory with your domain name
2. Update the `cname:` field in `.github/workflows/deploy.yml`
3. Configure DNS settings with your domain provider

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Test production build locally
npm start
```

## 🚀 Deployment Process

The deployment is automated using GitHub Actions:

1. **Trigger**: Push to main branch
2. **Build**: Next.js builds the static site
3. **Deploy**: Files are deployed to GitHub Pages
4. **Live**: Site is available at `https://yourusername.github.io/moneygrid`

## 📁 Project Structure

```
moneygrid/
├── .github/workflows/    # GitHub Actions deployment
├── src/
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utilities and Firebase config
├── public/              # Static assets
├── .env.local           # Local environment variables
├── .env.example         # Environment variables template
└── next.config.ts       # Next.js configuration
```

## 🔒 Security Notes

1. **Environment Variables**: Never commit `.env.local` to git
2. **Firebase Rules**: Configure proper Firestore security rules
3. **API Keys**: Firebase API keys are safe to expose in frontend code
4. **CORS**: Configure Firebase Auth domain restrictions if needed

## 🐛 Troubleshooting

### Build Issues
- Check Node.js version (requires 20+)
- Verify all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run typecheck`

### Deployment Issues
- Verify GitHub Actions has permissions to deploy
- Check if GitHub Pages is enabled in repository settings
- Ensure base path is correctly configured in `next.config.ts`

### Firebase Issues
- Verify Firebase project is active
- Check authentication methods are enabled
- Ensure Firestore database is created
- Verify environment variables are correct

## 📞 Support

If you encounter issues:
1. Check the GitHub Actions logs for build errors
2. Verify Firebase configuration and permissions
3. Ensure all environment variables are set correctly

## 🎉 Success!

Once deployed, your MoneyGrid application will be live at:
`https://yourusername.github.io/moneygrid`

The application includes:
- ✅ User authentication (Firebase Auth)
- ✅ Real-time database (Firestore)
- ✅ Responsive design
- ✅ Progressive Web App features
- ✅ Automated deployments