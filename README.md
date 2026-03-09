# 🌾 SoukFellah

A marketplace connecting buyers directly with local farmers to buy fresh produce at fair prices.

## Technologies

- **Frontend** : React + Vite
- **Backend** : Supabase (PostgreSQL + Auth + RLS)
- **Styling** : CSS Modules
- **Payments** : Stripe

## Run the project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

## Roles

| Role | Access |
|------|--------|
| `buyer` | Browse, cart, orders, favorites |
| `farmer` | Farm, products, listings, requests |
| `admin` | Full platform moderation |