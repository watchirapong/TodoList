# Todo List

A full-stack todo app built with Next.js 15, Tailwind CSS, and MongoDB.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) running locally on port 27017

### Start MongoDB (macOS)

```bash
brew services start mongodb-community
```

Or run `mongod` directly if you prefer a foreground process.

The database `todolist` is created automatically on the first write.

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

The default connection string in `.env.local`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/todolist
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Features

- Add, complete, and delete tasks
- Filter by All, Active, or Completed
- Optimistic UI updates with error recovery
- Tasks persist in MongoDB and survive page refresh

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/todos` | List all todos (newest first) |
| `POST` | `/api/todos` | Create a todo `{ text: string }` |
| `PATCH` | `/api/todos/[id]` | Update `{ completed?, text? }` |
| `DELETE` | `/api/todos/[id]` | Delete a todo |
