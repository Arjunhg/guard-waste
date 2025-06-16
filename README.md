# GreenGuard Waste Management Platform

A decentralized waste management platform that incentivizes users to report and collect waste through a token-based reward system. Built with Next.js, Web3Auth, and AI-powered waste verification.

## �� Features

### Core Functionality
- **Waste Reporting**: Users can report waste locations with AI-powered waste type and quantity verification
- **Waste Collection**: View and collect reported waste with real-time status updates
- **Reward System**: Earn tokens for reporting and collecting waste
- **AI Verification**: Uses Google's Gemini AI to verify waste types and quantities
- **Web3 Authentication**: Secure login using Web3Auth with social login options

### Key Components
- **Dashboard**: Track your impact with metrics like waste collected, reports submitted, and tokens earned
- **Report System**: Upload waste images for AI verification and location tracking
- **Collection System**: Browse and collect waste with verification process
- **Reward System**: Earn and track tokens for contributions
- **Leaderboard**: Compete with other users for top collector status

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Authentication**: Web3Auth
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Google Gemini AI
- **Styling**: Tailwind CSS, shadcn/ui
- **Blockchain**: Ethereum Sepolia Testnet

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Web3Auth account and client ID
- Google Gemini API key
- Ankr RPC API key

### Environment Variables
Create a `.env` file with:
```env
NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID=your_web3auth_client_id
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_ANKR_API_KEY=your_ankr_api_key
```

### Installation
1. Clone the repository
```bash
git clone https://github.com/Arjunhg/waste-management.git
cd waste-management
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npm run db:push
```

4. Start the development server
```bash
npm run dev
```

## �� Features in Detail

### Waste Reporting
- Upload waste images for AI verification
- Automatic waste type and quantity detection
- Location-based reporting
- Earn points for verified reports

### Waste Collection
- Browse available collection tasks
- Real-time status updates
- AI-powered collection verification
- Earn tokens for successful collections

### Reward System
- Points for reporting waste
- Tokens for collecting waste
- Transaction history
- Reward redemption system

## 🔒 Security Features
- Web3Auth integration for secure authentication
- AI-powered verification to prevent fraud
- Blockchain-based reward system
- Secure database operations

## 📞 Support
For support, please open an issue in the GitHub repository or contact the development team.