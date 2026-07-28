# Singapore Security — CCTV Shop Catalog & Enquiry System

A modern, mobile-first single-page application for browsing CCTV equipment, adding items to a cart, and submitting enquiries via phone OTP verification.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion, GSAP ScrollTrigger, react-three-fiber
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions)
- **OTP SMS:** MSG91
- **State:** Zustand (persisted to localStorage)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) project
- (For OTP) An [MSG91](https://msg91.com) account with API key

### 1. Clone and Install

```bash
git clone <repo-url>
cd singapore-security
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`
3. Create a **Storage bucket** named `product-images` (public) — run the storage SQL at the bottom of the migration file
4. Create an admin user in **Authentication > Users** (email/password)

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Fill in your Supabase project URL and anon key from **Settings > API**.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Deploy to Vercel

```bash
npx vercel
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel environment variables.

## Admin Panel

Access at `/admin` — login with the admin credentials created in step 2.4.

## License

Private — Singapore Security, Indore.
