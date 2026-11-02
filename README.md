# Alpha Coding School V1

React + Tailwind (client) · Express + Node (server) · MongoDB

## Run
```
# 1. server
cd server && cp .env.example .env && npm install
npm run seed      # adds "DSA Mastery" + 2 live classes
npm run dev       # http://localhost:5000

# 2. client (new terminal)
cd client && npm install && npm run dev   # http://localhost:5173
```
Needs MongoDB running locally, or set MONGO_URI to an Atlas URL.

## Notes
- Payment is a mock in `server/src/routes.js` (`/payments/checkout`). Swap in Stripe/Razorpay there.
- Add real courses by editing `server/src/seed.js` (video URLs, notes, logic, problems, live links).
