# Resmic-PRO
# Resmic Infrastructure: Self-Hosted Setup Guide

Welcome to the **Resmic Payment Infrastructure** ✨

Resmic is an **open-source, decentralised crypto payment infrastructure** that lets you accept crypto payments directly to your wallet — no custody, no middlemen, no fees.

This guide helps you self-host Resmic entirely on your own infrastructure: smart contracts, backend services, database, payment front-end, and dashboard.

If you prefer the hosted solution, you can skip all of this and start instantly at [https://resmic.com](https://resmic.com).

---

## 🧭 Index / Task Checklist

1. Deploy Smart Contracts (Factory + Temp Wallet)
2. Set up PostgreSQL Database
3. Fund Wallet with Gas
4. Launch Node.js Backend Server (with Redis)
5. Host Payment Page Frontend
6. Host Dashboard Frontend

---

## 📂 GitHub Repositories

- **Smart Contracts**: [Resmic SC Repo](https://github.com/0xResmic/Resmic-PRO/smartContract)
- **Backend Server**: [Resmic Backend](https://github.com/0xResmic/Resmic-PRO/backend)
- **Payment Page (Frontend)**: [Resmic Payment Page](https://github.com/0xResmic/Resmic-PRO/paymentPage)
- **Dashboard (Frontend)**: [Resmic Dashboard](https://github.com/0xResmic/Resmic-PRO/dashboard)

---

## ⚖️ Smart Contract Deployment

Resmic uses a smart contract factory system for deploying session-based wallets.

**How it works:**
1. A user initiates a payment session
2. The system predicts the contract address
3. User sends the payment
4. Upon detection, the smart contract is deployed (using the funds just received)
5. Funds are automatically withdrawn to your main wallet

### What you need to do:
- Manually deploy the following contracts on your preferred EVM-compatible blockchain:
  - **Factory Contract**
  - **Temp Wallet Contract**

---

## 📊 Database Setup

We use **PostgreSQL** to store transaction and session data.

- Required: PostgreSQL instance (hosted or local)
- Schema: Provided at a `/backend/src/dbqueries.js` runnable file in the backend repo 
- Just run the file, all table will be generated.

---

## 🚀 Backend Hosting (Node.js + Express)

Clone the backend server:
```bash
cd backend
# Create and update .env file.
npm install
npm run dev
```

### Responsibilities of Backend:
- Create and manage payment sessions
- Predict smart contract address
- Deploy contract when payment is received
- Listen to on-chain events via WebSocket/RPC
- Update database with status
- Send webhook (with signature verification) and email notifications
- Withdraw received funds to the configured main wallet
- Cache payment status using Redis (make sure Redis server is running)

### Backend Requirements:
- Node.js + NPM
- Redis (localhost, default port)
- Alchemy or compatible RPC URL per supported chain
- A funded wallet (private key in .env) to pay for contract deployment gas fees

---

## 🖼️ Frontend: Payment Page

This is the public-facing crypto checkout page your users will see.

```bash
cd paymentPage
# Create and update .env file.
npm install
npm run dev
```

Can be deployed to **Vercel**, **Netlify**, or any server.

Includes:
- Token selection
- QR code generator
- Chain selector
- Realtime payment status tracking

---

## 📊 Frontend: Dashboard

The dashboard provides a full control panel for managing your payment infrastructure.

```bash
cd dashboard
# Create and update .env file.
npm install
npm run dev
```

Includes:
- Payment history & analytics
- API keys & webhook secret generation
- Transaction exports
- Real-time payment logs

---

## 🔐 Environment Variables

Each repo includes a `.env.example` file with all required values.

---

## 🛠 Summary of Self-Hosting Steps

To self-host Resmic and accept crypto payments in a fully decentralised way:

1. Deploy the Smart Contracts (Factory + Temp Wallet)
2. Set up PostgreSQL DB (run the schema setup file)
3. Fund your main wallet with gas fees
4. Launch the Node.js backend server
5. Host your payment page frontend
6. Host your Resmic dashboard

---

## 🛟 Need Help?

Resmic is fully open-source and we’re always open to contributions, questions, or improvements.

Feel free to open issues or contact us via GitHub.

---

Built with ❤️ by Resmic for decentralised payments.
