# Todo List Kanban

Kanban task board built with Next.js 15, Tailwind CSS, and MongoDB. Each browser gets a private board via an anonymous cookie — no login required.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- MongoDB — local **or** [MongoDB Atlas](https://www.mongodb.com/atlas) (recommended for Vercel)

### Local MongoDB (macOS)

```bash
brew services start mongodb-community
```

### MongoDB Atlas

1. Create a free cluster
2. **Database & Network Access** → add a DB user and allow IP `0.0.0.0/0` (for Vercel)
3. Copy the connection string (Drivers → Node.js) and set `MONGODB_URI` in `.env.local`

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your MONGODB_URI
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add environment variable:
   - `MONGODB_URI` = your Atlas connection string (include `/todolist` database name)
4. Deploy

No login setup needed — each visitor automatically gets a `todo_user_id` cookie and only sees their own tasks.

## How user separation works

- On first visit, the server sets an httpOnly cookie `todo_user_id` (random UUID)
- All todos are stored with that `userId` in MongoDB
- API routes filter by `userId` — users cannot read or modify each other's tasks
- Clearing cookies = new empty board (old tasks remain in DB under the old id)

## Features

- Kanban board: Not started / In progress / Done
- Drag-and-drop between columns
- Double-click to edit title, description, deadline
- Red card styling when deadline is within 3 days
- Optimistic UI updates

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/todos` | List current user's todos |
| `POST` | `/api/todos` | Create a todo |
| `PATCH` | `/api/todos/[id]` | Update a todo |
| `DELETE` | `/api/todos/[id]` | Delete a todo |

All routes require the `todo_user_id` cookie (set automatically on first request).
