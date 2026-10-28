# Anon Confessions

A fully automated, 100% anonymous confession board for the crypto trenches. Users can submit their worst trades, rugs, and massive money extractions without ever linking a wallet, email, or identity. The submission is instantly broadcasted to a public Telegram channel.

## Live Links

- **Frontend App (Vercel):** [https://anon-confession-chi.vercel.app/](https://anon-confession-chi.vercel.app/)
- **Telegram Channel:** [@trenches_confessions](https://t.me/trenches_confessions)

## Inspiration

This project was inspired by a tweet from [@Mystral_777](https://x.com/Mystral_777) who suggested:

> _"someone needs to start a crypto confessions account where people anonymously submit the dumbest things they've done in the trenches or confess to huge money extractions"_

We built the infrastructure to make that a reality.

## Privacy & Anonymity First

This project was built with a "privacy-by-design" philosophy:

- **No IP Tracking:** We do not log or store user IP addresses.
- **No Accounts:** No email, no wallet connection, no login required.
- **Anonymous Rate Limiting:** Instead of tracking IPs, the backend uses native browser fingerprinting (hashing user agent, screen size, etc.) purely in memory to prevent spam. This fingerprint is _never_ saved to the database.
- **Archived Sans Identity:** Confessions are saved to the database for archival, but the text is completely decoupled from the user who submitted it.

## Features

- **Anonymous Submissions:** Instantly posts to Telegram via a custom bot.
- **Anti-Spam Honeypot:** A hidden CSS field that traps automated bots.
- **Rate Limiting (5 per hour):** Prevents users from flooding the channel.
- **Proof-of-Work (PoW) Challenge:** If a user hits the 5-per-hour limit, they are forced to solve a cryptographic SHA-256 puzzle in their browser to submit again. This makes spamming computationally expensive.
- **Smart Validation:** Blocks phishing links (http, .com, etc.) and severe Telegram ToS violations, but _allows_ wallet addresses so users can prove what rugged them.
- **Cloudflare Relay:** Routes Telegram API requests through a Cloudflare Worker to bypass cloud provider IP blocks.

## Architecture Flow

1. **Frontend (React/Vite):** User types a confession. A browser fingerprint is generated locally. A confirmation modal ensures intent.
2. **Backend (Node.js/Express):** Receives the text and fingerprint. Validates length, regex (blocks links), and blocklist words.
3. **Rate Limit & PoW Service:** Checks the in-memory cache. If under 5 requests, it passes. If over, it issues a PoW challenge.
4. **Database (PostgreSQL/Neon):** Saves the text for archival (without the fingerprint).
5. **Telegram Service:** Formats the message and sends it to a Cloudflare Worker.
6. **Cloudflare Worker:** Receives the request from Render and forwards it to the official Telegram Bot API, bypassing cloud IP restrictions.
7. **Telegram:** Publishes the confession to the public channel instantly.

## Tech Stack

### Frontend

- **React:** UI library for the submission form and modal.
- **Vite:** Next-generation frontend tooling.
- **Native Browser APIs:** Used for hashing device characteristics into a fingerprint (no third-party tracking libraries).
- **Vanilla CSS:**

### Backend

- **Node.js:** Runtime environment.
- **Express:** Web framework for the API.
- **Prisma ORM:** Type-safe database client.
- **@prisma/adapter-pg:** Prisma driver adapter for PostgreSQL connection pooling.
- **crypto:** Native Node.js module used for generating and verifying the Proof-of-Work SHA-256 hashes.
- **axios:** HTTP client for sending requests to the Cloudflare Proxy.
- **cors:** Middleware to allow cross-origin requests from Vercel to Render.

### Infrastructure & External Services

- **PostgreSQL (Neon):** Serverless database for archiving confessions.
- **Cloudflare Workers:** Serverless edge functions acting as a reverse proxy for the Telegram API.
- **Telegram Bot API:** Used to publish messages to the channel.
- **Render:** Backend hosting (Web Service).
- **Vercel:** Frontend hosting.

## Local Setup

### Prerequisites

- Node.js v18+
- PostgreSQL database (Local or Neon)

### 1. Backend Setup

1. `npm install`
2. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=verify-full"
   TELEGRAM_BOT_TOKEN="your_bot_token"
   TELEGRAM_CHANNEL_ID="@your_channel_username"
   TELEGRAM_PROXY_URL="https://your-cloudflare-worker.workers.dev"
   Generate Prisma Client and push the schema:
   ```

bash
npx prisma generate
npx prisma db push
Start the server:

bash
node server.js 2. Frontend Setup
cd client

npm install

Create a .env file:

env
VITE_API_URL=http://localhost:3000
Start Vite:

bash
npm run dev
📄 License
MIT License.
