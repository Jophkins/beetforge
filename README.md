# beetForge

Gamified goal & habit tracker – turn your real life progress into XP, levels and achievements.

**Level up your life, one task at a time.**

## Current features

- User authentication (httpOnly cookies)
- Goal & habit creation
- XP & level progression system
- Basic profile & progress overview

## Tech stack

- Next.js 16 (App Router)
- PostgreSQL + Prisma ORM
- Tailwind CSS
- httpOnly cookies + secure auth flow

## What's next

- Middleware & protected routes / redirects
- Loading skeletons for all components
- Improved XP calculation & level-up logic
- Achievements & visual progress feedback
- Mobile-friendly layout & PWA support (planned)

## Quick start (local development)

# 1. Clone & install

git clone https://github.com/Jophkins/beetforge
cd beetforge
npm install

# 2. Set up environment variables (.env see example env.example)

# DATABASE_URL="postgresql://..."

# ...

# 3. Run migrations & seed

npx prisma migrate

# npx prisma db seed

# 4. Start dev server

npm run dev

Open http://localhost:3000 (or check the proper port in the terminal)

Made with ❤️
