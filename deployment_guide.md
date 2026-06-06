# Deployment Guide — Crypto Trading Simulator

This guide walk you through deploying your full-stack Crypto Trading Simulator application to the public internet using free hosting options.

---

## 🏗️ Architecture Overview
- **Database**: PostgreSQL (hosted on Render or Neon)
- **Backend API & WebSockets**: Node.js/Express (hosted on Render Web Services)
- **Frontend SPA**: React/Vite (hosted on Render Static Sites or Vercel)

---

## 🛠️ Step 1: Database Setup (Render or Neon)

To run the application, you need a hosted PostgreSQL database.

### Option A: Render PostgreSQL (Fast & Simple)
1. Go to [Render](https://render.com/) and log in.
2. Click **New +** and select **PostgreSQL**.
3. Configure your database:
   - **Name**: `crypto-trading-db`
   - **Database Name**: `crypto_trading_sim`
   - **User**: `crypto_user`
4. Click **Create Database**.
5. Once created, copy the **External Database URL**. It looks like:
   `postgresql://crypto_user:password@dpg-xxx-a.oregon-postgres.render.com/crypto_trading_sim`

### Option B: Neon PostgreSQL (Free Forever)
1. Go to [Neon.tech](https://neon.tech/) and sign up.
2. Create a new project named `crypto-sim`.
3. Copy the database connection string from the dashboard.

---

## 🚀 Step 2: Deploy Backend API (Render)

1. Go to your Render Dashboard.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following details:
   - **Name**: `crypto-trading-backend`
   - **Root Directory**: `server`
   - **Language**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx prisma db push && npm start`
5. Click **Advanced** and add the following **Environment Variables**:
   - `DATABASE_URL`: *(Your PostgreSQL URL from Step 1)*
   - `JWT_SECRET`: *(A random secure string)*
   - `PORT`: `4000`
   - `CORS_ORIGIN`: `https://your-frontend-domain.onrender.com` (you can update this after deploying the frontend)
   - `NODE_ENV`: `production`
6. Click **Create Web Service**.

Once deployed, copy your backend URL (e.g., `https://crypto-trading-backend.onrender.com`).

---

## 🎨 Step 3: Deploy Frontend Client

### Option A: Render Static Site (Simplest)
1. Go to Render Dashboard.
2. Click **New +** and select **Static Site**.
3. Connect your GitHub repository.
4. Configure the settings:
   - **Name**: `crypto-trading-simulator`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Click **Advanced** and add the following **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
   - `VITE_WS_URL`: `https://your-backend-url.onrender.com`
6. Click **Create Static Site**.

### Option B: Vercel (Fastest & Best CDN)
1. Go to [Vercel](https://vercel.com/) and sign up.
2. Click **Add New** > **Project** and import your GitHub repository.
3. Configure the settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
4. Expand **Environment Variables** and add:
   - Name: `VITE_API_URL`, Value: `https://your-backend-url.onrender.com/api`
   - Name: `VITE_WS_URL`, Value: `https://your-backend-url.onrender.com`
5. Click **Deploy**.

---

## ⚙️ Step 4: Final Environment Sync

Once both are deployed:
1. Copy your frontend URL (e.g., `https://crypto-trading-simulator.onrender.com` or `https://xxx.vercel.app`).
2. Go back to your backend **Web Service** settings on Render.
3. Update the `CORS_ORIGIN` environment variable to match your frontend URL.
4. Render will automatically redeploy the backend with the correct CORS configuration.

---

## 🧪 Step 5: Verification Checklist

- [ ] Open the frontend URL in your browser.
- [ ] Check that live prices are updating on the dashboard (indicated by blinking green/red indicators).
- [ ] Try creating a new account (verifies Database connection).
- [ ] Execute a virtual market order to buy BTC or ETH (verifies Trade Execution & Socket updates).
