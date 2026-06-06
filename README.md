# Real-Time Crypto Trading Simulator

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://crypto-trade-simulator.vercel.app/)

A full-stack, real-time cryptocurrency paper trading simulator built with Node.js, Express, React, JavaScript, WebSocket (Binance API), Socket.IO, PostgreSQL, Redis, and Prisma ORM.

## Features

- **Authentication**: Register/Login with secure password hashing (`bcryptjs`) and stateless token sessions (`JWT`). Starting balance of $10,000 virtual cash.
- **Real-Time Prices**: Instant WebSocket connection to the Binance API. Stream prices for BTC, ETH, SOL, BNB, XRP, ADA, DOGE, and DOT, and broadcast them using Socket.IO.
- **Trading Engine**: BUY and SELL virtual crypto with atomic operations using Prisma transactions, automatic avg-buy-price updates, and validation checks.
- **Watchlist**: Track custom symbols in real-time with responsive UI indicators.
- **Portfolio & Leaderboard**: Visual performance charts using Recharts, live P&L calculators, and a global leader rank.
- **Premium UI**: Professional, humanized SaaS dashboard design with a sleek neutral/indigo color palette.
- **Docker & Render Ready**: Fully containerized environment for local development and a `render.yaml` included for easy deployment on Render.

---

## Technical Stack

| Area | Technologies |
|---|---|
| **Frontend** | React (Vite), JavaScript, Tailwind CSS, Recharts, Zustand, Socket.IO Client, Axios |
| **Backend** | Node.js, Express, JavaScript, Socket.IO Server, ws (Binance Websocket Client) |
| **Database & Cache** | PostgreSQL, Prisma ORM, Redis |
| **DevOps** | Docker, Nginx, docker-compose |

---

## Project Structure

```
.
├── docker-compose.yml          # Container configuration
├── client/                     # Frontend Vite SPA
│   ├── src/                    # Components, pages, stores, hooks
│   ├── Dockerfile
│   └── nginx.conf              # SPA & proxy configuration
└── server/                     # Backend API & WebSocket server
    ├── src/                    # Services, controllers, websocket stream
    ├── prisma/                 # Database schemas & migrations
    └── Dockerfile
```

---

## Setup & Running Guide

### Method 1: Using Docker (Recommended)

To run the entire suite (PostgreSQL, Redis, Backend, Frontend) with a single command:

1. Make sure you have **Docker** and **Docker Compose** installed.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. Open your browser to `http://localhost:5173`.
4. *Optional:* Run database seeds to populate leaderboard/test data:
   ```bash
   docker-compose exec server npm run seed
   ```

### Method 2: Manual Local Setup

#### Prerequisites
- Node.js (v20+)
- PostgreSQL running locally
- Redis running locally (optional, falls back gracefully)

#### 1. Backend Setup
1. Open the `server` directory:
   ```bash
   cd server
   ```
2. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Update the database URL configuration in `.env` to match your local PostgreSQL credentials.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run database migrations:
   ```bash
   npx prisma db push
   ```
6. Seed initial test data:
   ```bash
   npm run seed
   ```
7. Start the development backend:
   ```bash
   npm run dev
   ```

#### 2. Frontend Setup
1. Open a new terminal in the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:5173`.

---

## API Routes & Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| **POST** | `/api/auth/register` | Create user account (+ $10,000 USD balance) | No |
| **POST** | `/api/auth/login` | Login user and retrieve JWT | No |
| **GET** | `/api/auth/profile` | Retrieve profile metadata | Yes |
| **POST** | `/api/trades` | Execute market BUY or SELL order | Yes |
| **GET** | `/api/trades/history` | Paginated trading transactions history | Yes |
| **GET** | `/api/portfolio` | Retrieve current assets, valuation & live P&L | Yes |
| **GET** | `/api/portfolio/leaderboard` | View top global traders rank list | No |
| **GET** | `/api/watchlist` | Retrieve user watchlist coins | Yes |
| **POST** | `/api/watchlist` | Add a crypto to user watchlist | Yes |
| **DELETE** | `/api/watchlist/:symbol` | Delete a crypto from user watchlist | Yes |

---

## WebSocket Events

### Socket.IO Client Outgoing
- `prices:subscribe`: Pass string array of symbols to subscribe (`['BTCUSDT']`)
- `prices:unsubscribe`: Unsubscribe from symbols

### Socket.IO Server Incoming
- `prices:update`: Broadcasts an object dictionary of live ticker values every second.
- `trade:executed`: Sent to the user's specific room when a trade completes, containing trade info and a description string.
