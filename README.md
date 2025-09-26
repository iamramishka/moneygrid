# MoneyGrid - Personal Finance Management App

A modern, responsive personal finance management application built with Next.js, Firebase, and Tailwind CSS.

## 🚀 Live Demo

- **Demo**: [Visit Live App](https://iamramishka.github.io/moneygrid)
- **Repository**: [GitHub](https://github.com/iamramishka/moneygrid)

## ✨ Features

- 💰 Income and Expense Tracking
- 📊 Financial Analytics & Charts
- 🎯 Savings Goals Management
- 🔐 User Authentication (Firebase Auth)
- 📱 Responsive Design
- 🌙 Dark/Light Mode Support
- 💾 Real-time Data Sync (Firebase Firestore)
- 🤖 AI-powered Financial Recommendations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Charts**: Recharts
- **Deployment**: GitHub Pages
- **AI**: Google Generative AI (Genkit)

## 📋 Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 20 or later) and `npm` installed on your computer.

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/iamramishka/moneygrid.git
cd moneygrid
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Set up Firebase:
   - Create a project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore
   - Copy your Firebase config to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🚀 Deployment

This application is configured for automatic deployment to GitHub Pages. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

### Quick Deployment Steps:

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Set up Firebase project and update environment variables
4. The app will automatically deploy on push to main branch

## 📁 Project Structure

```
moneygrid/
├── .github/workflows/    # CI/CD pipeline
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Auth, Theme)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and configurations
│   └── ai/              # AI integration and flows
├── public/              # Static assets
└── docs/                # Documentation
```

## 🎨 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run deploy` - Build and prepare for deployment

## 🔐 Environment Variables

Required environment variables (add to `.env.local`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Firebase](https://firebase.google.com/)
- Charts by [Recharts](https://recharts.org/)

---

Made with ❤️ by [Ramishka](https://github.com/iamramishka)
